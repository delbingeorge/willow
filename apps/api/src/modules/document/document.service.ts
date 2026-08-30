import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import * as Y from 'yjs';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { YjsSyncService } from '../collaboration/yjs-sync.service.js';
import type { CreateDocumentInput } from './dto/create-document.input.js';
import type { UpdateDocumentInput } from './dto/update-document.input.js';

interface DocumentFilters {
  parentId?: string | null;
  isArchived?: boolean;
}

export type DocumentRole = 'editor' | 'viewer';

export interface SearchRow {
  id: string;
  title: string;
  icon: string | null;
  updatedAt: Date;
  snippet: string | null;
}

@Injectable()
export class DocumentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly yjsSync: YjsSyncService,
  ) {}

  findMany(orgId: string, filters: DocumentFilters) {
    return this.prisma.document.findMany({
      where: {
        orgId,
        ...(filters.parentId !== undefined
          ? { parentId: filters.parentId }
          : {}),
        ...(filters.isArchived !== undefined
          ? { isArchived: filters.isArchived }
          : {}),
      },
      include: { creator: true },
      orderBy: { position: 'asc' },
    });
  }

  async findInOrg(orgId: string, id: string) {
    const document = await this.prisma.document.findFirst({
      where: { id, orgId },
      include: { creator: true },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async resolveAccess(user: AuthenticatedUser, id: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: { creator: true },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    if (document.orgId === user.orgId) {
      return { document, role: 'editor' as DocumentRole };
    }

    const share = await this.prisma.documentShare.findUnique({
      where: { documentId_userId: { documentId: id, userId: user.id } },
    });

    if (!share) {
      throw new NotFoundException('Document not found');
    }

    return { document, role: (share.role === 'editor' ? 'editor' : 'viewer') as DocumentRole };
  }

  async findOne(user: AuthenticatedUser, id: string) {
    return (await this.resolveAccess(user, id)).document;
  }

  async assertEditAccess(user: AuthenticatedUser, id: string) {
    const { document, role } = await this.resolveAccess(user, id);

    if (role !== 'editor') {
      throw new ForbiddenException('You do not have permission to edit this document');
    }

    return document;
  }

  findTree(orgId: string) {
    return this.prisma.document.findMany({
      where: { orgId, isArchived: false },
      include: { creator: true },
      orderBy: { position: 'asc' },
    });
  }

  findChildren(documentId: string) {
    return this.prisma.document.findMany({
      where: { parentId: documentId },
      include: { creator: true },
      orderBy: { position: 'asc' },
    });
  }

  countChildren(documentId: string) {
    return this.prisma.document.count({ where: { parentId: documentId } });
  }

  async create(orgId: string, userId: string, input: CreateDocumentInput) {
    const parentId = input.parentId ?? null;

    if (parentId) {
      await this.assertParentInOrg(orgId, parentId);
    }

    const position = await this.nextPosition(orgId, parentId);

    return this.prisma.document.create({
      data: {
        orgId,
        createdBy: userId,
        title: input.title ?? 'Untitled',
        icon: input.icon,
        parentId,
        position,
      },
      include: { creator: true },
    });
  }

  async update(user: AuthenticatedUser, id: string, input: UpdateDocumentInput) {
    await this.assertEditAccess(user, id);

    const document = await this.prisma.document.update({
      where: { id },
      data: input,
      include: { creator: true },
    });

    if (input.title !== undefined) {
      await this.yjsSync.setTitle(id, document.title);
    }

    return document;
  }

  async setArchived(user: AuthenticatedUser, id: string, isArchived: boolean) {
    await this.assertEditAccess(user, id);

    return this.prisma.document.update({
      where: { id },
      data: { isArchived },
      include: { creator: true },
    });
  }

  async remove(user: AuthenticatedUser, id: string) {
    await this.assertEditAccess(user, id);
    await this.prisma.document.delete({ where: { id } });
    return true;
  }

  async duplicate(orgId: string, userId: string, id: string) {
    const original = await this.findInOrg(orgId, id);
    const position = await this.nextPosition(orgId, original.parentId);

    return this.prisma.document.create({
      data: {
        orgId,
        createdBy: userId,
        title: `${original.title} (Copy)`,
        icon: original.icon,
        coverUrl: original.coverUrl,
        parentId: original.parentId,
        position,
      },
      include: { creator: true },
    });
  }

  async move(orgId: string, id: string, parentId: string | null | undefined, position: number) {
    await this.findInOrg(orgId, id);
    const nextParentId = parentId ?? null;

    if (nextParentId) {
      if (nextParentId === id) {
        throw new BadRequestException('A document cannot be its own parent');
      }
      await this.assertParentInOrg(orgId, nextParentId);
      await this.assertNotDescendant(orgId, id, nextParentId);
    }

    return this.prisma.document.update({
      where: { id },
      data: { parentId: nextParentId, position },
      include: { creator: true },
    });
  }

  private async nextPosition(orgId: string, parentId: string | null) {
    return this.prisma.document.count({
      where: { orgId, parentId, isArchived: false },
    });
  }

  private async assertParentInOrg(orgId: string, parentId: string) {
    const parent = await this.prisma.document.findFirst({
      where: { id: parentId, orgId },
    });

    if (!parent) {
      throw new NotFoundException('Parent document not found');
    }
  }

  private async assertNotDescendant(orgId: string, movingId: string, targetParentId: string) {
    let current: string | null = targetParentId;

    while (current) {
      if (current === movingId) {
        throw new BadRequestException('Cannot move a document under its own descendant');
      }

      const doc: { parentId: string | null } | null = await this.prisma.document.findFirst({
        where: { id: current, orgId },
        select: { parentId: true },
      });

      current = doc?.parentId ?? null;
    }
  }

  async importState(user: AuthenticatedUser, id: string, base64State: string) {
    await this.assertEditAccess(user, id);

    const state = Buffer.from(base64State, 'base64');

    try {
      Y.applyUpdate(new Y.Doc(), state);
    } catch {
      throw new BadRequestException('Invalid Yjs document state');
    }

    await this.prisma.documentYjsState.upsert({
      where: { documentId: id },
      create: { documentId: id, state },
      update: { state },
    });

    return true;
  }

  async search(orgId: string, query: string) {
    const term = query.trim();

    if (term.length === 0) {
      return [];
    }

    return this.prisma.$queryRaw<SearchRow[]>`
      SELECT id, title, icon, updated_at AS "updatedAt",
             ts_headline('english', title, plainto_tsquery('english', ${term})) AS snippet
      FROM documents
      WHERE org_id = ${orgId}
        AND is_archived = false
        AND (
          to_tsvector('english', title) @@ plainto_tsquery('english', ${term})
          OR title ILIKE '%' || ${term} || '%'
        )
      ORDER BY ts_rank(to_tsvector('english', title), plainto_tsquery('english', ${term})) DESC,
               updated_at DESC
      LIMIT 20
    `;
  }
}
