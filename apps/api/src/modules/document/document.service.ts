import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

interface DocumentFilters {
  parentId?: string | null;
  isArchived?: boolean;
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
}
