import { Injectable } from '@nestjs/common';
import * as Y from 'yjs';
import type { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { DocumentService } from './document.service.js';

const DEFAULT_LIMIT = 20;

@Injectable()
export class VersionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly documentService: DocumentService,
  ) {}

  async create(orgId: string, userId: string, documentId: string) {
    const document = await this.documentService.findOne(orgId, documentId);
    const content = await this.snapshotContent(documentId);
    const nextVersion = await this.nextVersionNumber(documentId);

    return this.prisma.documentVersion.create({
      data: {
        documentId,
        version: nextVersion,
        title: document.title,
        content,
        createdBy: userId,
      },
      include: { creator: true },
    });
  }

  findMany(documentId: string, limit?: number, offset?: number) {
    return this.prisma.documentVersion.findMany({
      where: { documentId },
      include: { creator: true },
      orderBy: { version: 'desc' },
      take: limit ?? DEFAULT_LIMIT,
      skip: offset ?? 0,
    });
  }

  async currentVersion(documentId: string): Promise<number> {
    const latest = await this.prisma.documentVersion.findFirst({
      where: { documentId },
      orderBy: { version: 'desc' },
      select: { version: true },
    });

    return latest?.version ?? 0;
  }

  private async snapshotContent(documentId: string): Promise<Prisma.InputJsonValue> {
    const yjsState = await this.prisma.documentYjsState.findUnique({
      where: { documentId },
    });

    if (!yjsState) {
      return {};
    }

    const ydoc = new Y.Doc();
    Y.applyUpdate(ydoc, yjsState.state);
    return ydoc.toJSON() as Prisma.InputJsonValue;
  }

  private async nextVersionNumber(documentId: string): Promise<number> {
    const latest = await this.prisma.documentVersion.findFirst({
      where: { documentId },
      orderBy: { version: 'desc' },
      select: { version: true },
    });

    return (latest?.version ?? 0) + 1;
  }
}
