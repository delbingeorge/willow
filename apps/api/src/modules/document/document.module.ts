import { Module } from '@nestjs/common';
import { YjsSyncModule } from '../collaboration/yjs-sync.module.js';
import { DocumentResolver } from './document.resolver.js';
import { DocumentService } from './document.service.js';
import { ShareController } from './share.controller.js';
import { ShareResolver } from './share.resolver.js';
import { ShareService } from './share.service.js';
import { VersionService } from './version.service.js';

@Module({
  imports: [YjsSyncModule],
  controllers: [ShareController],
  providers: [DocumentResolver, DocumentService, ShareResolver, ShareService, VersionService],
  exports: [DocumentService, VersionService],
})
export class DocumentModule {}
