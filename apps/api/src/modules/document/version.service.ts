import { Injectable } from '@nestjs/common';
import type { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { DocumentService } from './document.service.js';
import { snapshotYjsContent } from './yjs-snapshot.js';

const DEFAULT_LIMIT = 20;
const AUTO_VERSION_INTERVAL_MS = 30 * 60 * 1000;

@Injectable()
export class VersionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly documentService: DocumentService,
  ) {}

  async create(orgId: string, userId: string, documentId: string) {
    const document = await this.documentService.findOne(orgId, documentId);
    const content = await snapshotYjsContent(this.prisma, documentId);
    return this.insertVersion(documentId, document.title, userId, content);
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
    const latest = await this.findLatest(documentId);
    return latest?.version ?? 0;
  }

  async createAutoVersionIfDue(documentId: string) {
    const latest = await this.findLatest(documentId);

    if (latest && Date.now() - latest.createdAt.getTime() < AUTO_VERSION_INTERVAL_MS) {
      return null;
    }

    return this.createSystemVersionIfChanged(documentId, latest);
  }

  async createAutoVersionOnDisconnect(documentId: string) {
    const latest = await this.findLatest(documentId);
    return this.createSystemVersionIfChanged(documentId, latest);
  }

  private async createSystemVersionIfChanged(documentId: string, latest: { content: Prisma.JsonValue } | null) {
    const document = await this.prisma.document.findUnique({ where: { id: documentId } });
    if (!document) {
      return null;
    }

    const content = await snapshotYjsContent(this.prisma, documentId);

    if (latest && JSON.stringify(latest.content) === JSON.stringify(content)) {
      return null;
    }

    return this.insertVersion(documentId, document.title, document.createdBy, content);
  }

  private async insertVersion(documentId: string, title: string, createdBy: string, content: Prisma.InputJsonValue) {
    const latest = await this.findLatest(documentId);

    return this.prisma.documentVersion.create({
      data: {
        documentId,
        version: (latest?.version ?? 0) + 1,
        title,
        content,
        createdBy,
      },
      include: { creator: true },
    });
  }

  private findLatest(documentId: string) {
    return this.prisma.documentVersion.findFirst({
      where: { documentId },
      orderBy: { version: 'desc' },
    });
  }
}
