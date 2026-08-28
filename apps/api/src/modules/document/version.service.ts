import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { DocumentService } from './document.service.js';
import { snapshotYjsContent } from './yjs-snapshot.js';

const DEFAULT_LIMIT = 20;

@Injectable()
export class VersionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly documentService: DocumentService,
  ) {}

  async create(orgId: string, userId: string, documentId: string) {
    const document = await this.documentService.findOne(orgId, documentId);
    const content = await snapshotYjsContent(this.prisma, documentId);
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

  private async nextVersionNumber(documentId: string): Promise<number> {
    const latest = await this.prisma.documentVersion.findFirst({
      where: { documentId },
      orderBy: { version: 'desc' },
      select: { version: true },
    });

    return (latest?.version ?? 0) + 1;
  }
}
