import { Injectable, Logger, OnApplicationBootstrap, OnModuleDestroy } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Hocuspocus } from '@hocuspocus/server';
import type { WebSocketLike } from '@hocuspocus/server';
import crossws from 'crossws/adapters/node';
import type { Server as HttpServer } from 'node:http';
import * as Y from 'yjs';
import { AuthService } from '../auth/auth.service.js';
import { DocumentService } from '../document/document.service.js';
import { VersionService } from '../document/version.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { YjsSyncService } from './yjs-sync.service.js';

interface CollabJwtPayload {
  sub: string;
}

const COLLAB_PATH = '/collaboration';

type ClientConnection = ReturnType<Hocuspocus['handleConnection']>;

@Injectable()
export class HocuspocusService implements OnApplicationBootstrap, OnModuleDestroy {
  private readonly logger = new Logger(HocuspocusService.name);
  private hocuspocus: Hocuspocus | undefined;

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly documentService: DocumentService,
    private readonly versionService: VersionService,
    private readonly yjsSync: YjsSyncService,
  ) {}

  onApplicationBootstrap() {
    this.hocuspocus = new Hocuspocus({
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

    this.yjsSync.register(this.hocuspocus);

    const hocuspocus = this.hocuspocus;
    const connections = new WeakMap<object, ClientConnection>();

    const ws = crossws({
      hooks: {
        open: (peer) => {
          connections.set(
            peer,
            hocuspocus.handleConnection(peer.websocket as WebSocketLike, peer.request),
          );
        },
        message: (peer, message) => {
          connections.get(peer)?.handleMessage(message.uint8Array());
        },
        close: (peer, event) => {
          connections.get(peer)?.handleClose({
            code: event.code ?? 1000,
            reason: event.reason ?? '',
          });
          connections.delete(peer);
        },
        error: (peer, error) => {
          this.logger.error(`WebSocket error for peer ${peer.id}`, error);
        },
      },
    });

    const httpServer = this.httpAdapterHost.httpAdapter.getHttpServer() as HttpServer;

    httpServer.on('upgrade', (request, socket, head) => {
      const path = new URL(request.url ?? '/', 'http://localhost').pathname;

      if (path !== COLLAB_PATH) {
        return;
      }

      ws.handleUpgrade(request, socket, head);
    });

    this.logger.log(`Hocuspocus mounted at ${COLLAB_PATH}`);
  }

  onModuleDestroy() {
    this.hocuspocus?.flushPendingStores();
    this.hocuspocus?.closeConnections();
  }
}
