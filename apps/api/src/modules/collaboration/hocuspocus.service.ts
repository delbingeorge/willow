import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server } from '@hocuspocus/server';
import * as Y from 'yjs';
import { AuthService } from '../auth/auth.service.js';
import { VersionService } from '../document/version.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';

interface CollabJwtPayload {
  sub: string;
}

@Injectable()
export class HocuspocusService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(HocuspocusService.name);
  private server: Server | undefined;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly versionService: VersionService,
  ) {}

  async onModuleInit() {
    this.server = new Server({
      port: Number(process.env.COLLAB_PORT ?? 1234),

      onAuthenticate: async ({ token, documentName }) => {
        const payload = await this.jwtService.verifyAsync<CollabJwtPayload>(token);
        const user = await this.authService.resolveAuthenticatedUser(payload.sub);

        const document = await this.prisma.document.findFirst({
          where: { id: documentName, orgId: user.orgId },
        });

        if (!document) {
          throw new Error('Document not found or access denied');
        }

        return { user };
      },

      onLoadDocument: async ({ documentName, document }) => {
        const record = await this.prisma.documentYjsState.findUnique({
          where: { documentId: documentName },
        });

        if (record) {
          Y.applyUpdate(document, record.state);
        }
      },

      onStoreDocument: async ({ documentName, document }) => {
        const state = Buffer.from(Y.encodeStateAsUpdate(document));

        await this.prisma.documentYjsState.upsert({
          where: { documentId: documentName },
          create: { documentId: documentName, state },
          update: { state },
        });

        await this.versionService.createAutoVersionIfDue(documentName);
      },

      onDisconnect: async ({ documentName, clientsCount }) => {
        if (clientsCount === 0) {
          await this.versionService.createAutoVersionOnDisconnect(documentName);
        }
      },
    });

    await this.server.listen();
    this.logger.log(`Hocuspocus listening on port ${this.server.configuration.port}`);
  }

  async onModuleDestroy() {
    await this.server?.destroy();
  }
}
