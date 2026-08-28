import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as Y from 'yjs';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { CreateDocumentInput } from './dto/create-document.input.js';
import type { UpdateDocumentInput } from './dto/update-document.input.js';

interface DocumentFilters {
  parentId?: string | null;
  isArchived?: boolean;
}

export interface SearchRow {
  id: string;
  title: string;
  icon: string | null;
  updatedAt: Date;
  snippet: string | null;
}

@Injectable()
export class DocumentService {
  constructor(private readonly prisma: PrismaService) {}

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

  async findOne(orgId: string, id: string) {
    const document = await this.prisma.document.findFirst({
      where: { id, orgId },
      include: { creator: true },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
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

  async update(orgId: string, id: string, input: UpdateDocumentInput) {
    await this.findOne(orgId, id);

    return this.prisma.document.update({
      where: { id },
      data: input,
      include: { creator: true },
    });
  }

  async setArchived(orgId: string, id: string, isArchived: boolean) {
    await this.findOne(orgId, id);

    return this.prisma.document.update({
      where: { id },
      data: { isArchived },
      include: { creator: true },
    });
  }

  async remove(orgId: string, id: string) {
    await this.findOne(orgId, id);
    await this.prisma.document.delete({ where: { id } });
    return true;
  }

  async duplicate(orgId: string, userId: string, id: string) {
    const original = await this.findOne(orgId, id);
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
    await this.findOne(orgId, id);
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

  async importState(orgId: string, id: string, base64State: string) {
    await this.findOne(orgId, id);

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

  search(orgId: string, query: string) {
    return this.prisma.$queryRaw<SearchRow[]>`
      SELECT id, title, icon, updated_at AS "updatedAt",
             ts_headline('english', title, plainto_tsquery('english', ${query})) AS snippet
      FROM documents
      WHERE org_id = ${orgId}
        AND is_archived = false
        AND to_tsvector('english', title) @@ plainto_tsquery('english', ${query})
      ORDER BY ts_rank(to_tsvector('english', title), plainto_tsquery('english', ${query})) DESC
      LIMIT 20
    `;
  }
}
