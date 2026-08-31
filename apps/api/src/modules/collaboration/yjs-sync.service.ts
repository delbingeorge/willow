import { Injectable, Logger } from '@nestjs/common';
import type { Document, Hocuspocus } from '@hocuspocus/server';

@Injectable()
export class YjsSyncService {
  private readonly logger = new Logger(YjsSyncService.name);
  private hocuspocus: Hocuspocus | undefined;

  register(hocuspocus: Hocuspocus) {
    this.hocuspocus = hocuspocus;
  }

  async setTitle(documentId: string, title: string) {
    if (!this.hocuspocus) {
      return;
    }

    try {
      const connection = await this.hocuspocus.openDirectConnection(documentId);
      try {
        await connection.transact((document: Document) => {
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
