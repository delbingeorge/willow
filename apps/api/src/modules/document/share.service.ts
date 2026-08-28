import { randomBytes } from 'node:crypto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { DocumentService } from './document.service.js';
import { snapshotYjsContent } from './yjs-snapshot.js';

const VALID_ROLES = ['viewer', 'editor'];

@Injectable()
export class ShareService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly documentService: DocumentService,
  ) {}

  async share(orgId: string, documentId: string, userId: string, role: string) {
    this.assertValidRole(role);
    await this.documentService.findOne(orgId, documentId);

    const targetUser = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.documentShare.upsert({
      where: { documentId_userId: { documentId, userId } },
      create: { documentId, userId, role },
      update: { role },
      include: { user: true },
    });
  }

  async updateRole(orgId: string, shareId: string, role: string) {
    this.assertValidRole(role);
    await this.findOwnedShare(orgId, shareId);

    return this.prisma.documentShare.update({
      where: { id: shareId },
      data: { role },
      include: { user: true },
    });
  }

  async remove(orgId: string, shareId: string) {
    await this.findOwnedShare(orgId, shareId);
    await this.prisma.documentShare.delete({ where: { id: shareId } });
    return true;
  }

  findByDocument(documentId: string) {
    return this.prisma.documentShare.findMany({
      where: { documentId },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  findPublicShare(documentId: string) {
    return this.prisma.documentShare.findFirst({
      where: { documentId, userId: null },
    });
  }

  async publish(orgId: string, documentId: string) {
    await this.documentService.findOne(orgId, documentId);

    const existing = await this.findPublicShare(documentId);
    if (!existing) {
      await this.prisma.documentShare.create({
        data: {
          documentId,
          userId: null,
          role: 'viewer',
          token: randomBytes(24).toString('base64url'),
        },
      });
    }

    return this.prisma.document.update({
      where: { id: documentId },
      data: { isPublished: true },
      include: { creator: true },
    });
  }

  async unpublish(orgId: string, documentId: string) {
    await this.documentService.findOne(orgId, documentId);

    await this.prisma.documentShare.deleteMany({
      where: { documentId, userId: null },
    });

    return this.prisma.document.update({
      where: { id: documentId },
      data: { isPublished: false },
      include: { creator: true },
    });
  }

  async findByToken(token: string) {
    const share = await this.prisma.documentShare.findUnique({
      where: { token },
      include: { document: true },
    });

    if (!share || !share.document.isPublished) {
      throw new NotFoundException('Shared document not found');
    }

    const content = await snapshotYjsContent(this.prisma, share.document.id);

    return {
      id: share.document.id,
      title: share.document.title,
      icon: share.document.icon,
      coverUrl: share.document.coverUrl,
      content,
      updatedAt: share.document.updatedAt,
    };
  }

  private async findOwnedShare(orgId: string, shareId: string) {
    const share = await this.prisma.documentShare.findFirst({
      where: { id: shareId, document: { orgId } },
    });

    if (!share) {
      throw new NotFoundException('Share not found');
    }

    return share;
  }

  private assertValidRole(role: string) {
    if (!VALID_ROLES.includes(role)) {
      throw new BadRequestException(`Role must be one of: ${VALID_ROLES.join(', ')}`);
    }
  }
}
