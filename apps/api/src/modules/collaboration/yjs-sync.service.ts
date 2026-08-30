import { Injectable, Logger } from '@nestjs/common';
import type { Server } from '@hocuspocus/server';

@Injectable()
export class YjsSyncService {
  private readonly logger = new Logger(YjsSyncService.name);
  private server: Server | undefined;

  register(server: Server) {
    this.server = server;
  }

  async setTitle(documentId: string, title: string) {
    if (!this.server) {
      return;
    }

    try {
      const connection = await this.server.openDirectConnection(documentId);
      try {
        await connection.transact((document) => {
          const text = document.getText('title');
          if (text.toString() === title) {
            return;
          }
          text.delete(0, text.length);
          text.insert(0, title);
        });
      } finally {
        await connection.disconnect();
      }
    } catch (error) {
      this.logger.error(`Failed to sync Yjs title for ${documentId}`, error);
    }
  }
}
