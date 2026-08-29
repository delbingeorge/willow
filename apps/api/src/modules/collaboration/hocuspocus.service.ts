import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Server } from '@hocuspocus/server';
import * as Y from 'yjs';
import { AuthService } from '../auth/auth.service.js';
import { DocumentService } from '../document/document.service.js';
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
    private readonly documentService: DocumentService,
    private readonly versionService: VersionService,
  ) {}

  async onModuleInit() {
    this.server = new Server({
      port: Number(process.env.COLLAB_PORT ?? 1234),

      onAuthenticate: async ({ token, documentName, connectionConfig }) => {
        const payload = await this.jwtService.verifyAsync<CollabJwtPayload>(token);
        const user = await this.authService.resolveAuthenticatedUser(payload.sub);

        const { role } = await this.documentService.resolveAccess(user, documentName);
        connectionConfig.readOnly = role === 'viewer';

        return { user };
      },

      onLoadDocument: async ({ documentName, document }) => {
        const record = await this.prisma.documentYjsState.findUnique({
          where: { documentId: documentName },
        });

        if (record) {
          Y.applyUpdate(document, record.state);
        }

        try {
          const titleText = document.getText('title');
          if (titleText.length === 0) {
            const existingDocument = await this.prisma.document.findUnique({
              where: { id: documentName },
            });
            if (existingDocument) {
              titleText.insert(0, existingDocument.title);
            }
          }
        } catch (error) {
          this.logger.error(`Failed to seed title for ${documentName}`, error);
        }
      },

      onStoreDocument: async ({ documentName, document }) => {
        try {
          const state = Buffer.from(Y.encodeStateAsUpdate(document));

          await this.prisma.documentYjsState.upsert({
            where: { documentId: documentName },
            create: { documentId: documentName, state },
            update: { state },
          });

          await this.versionService.createAutoVersionIfDue(documentName);
        } catch (error) {
          this.logger.error(`onStoreDocument failed for ${documentName}`, error);
        }
      },

      onDisconnect: async ({ documentName, clientsCount }) => {
        if (clientsCount === 0) {
          try {
            await this.versionService.createAutoVersionOnDisconnect(documentName);
          } catch (error) {
            this.logger.error(`onDisconnect version snapshot failed for ${documentName}`, error);
          }
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
