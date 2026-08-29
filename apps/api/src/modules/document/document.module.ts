import { Module } from '@nestjs/common';
import { DocumentResolver } from './document.resolver.js';
import { DocumentService } from './document.service.js';
import { ShareController } from './share.controller.js';
import { ShareResolver } from './share.resolver.js';
import { ShareService } from './share.service.js';
import { VersionService } from './version.service.js';

@Module({
  controllers: [ShareController],
  providers: [DocumentResolver, DocumentService, ShareResolver, ShareService, VersionService],
  exports: [DocumentService, VersionService],
})
export class DocumentModule {}
