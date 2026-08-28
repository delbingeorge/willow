import { Module } from '@nestjs/common';
import { DocumentResolver } from './document.resolver.js';
import { DocumentService } from './document.service.js';
import { ShareResolver } from './share.resolver.js';
import { ShareService } from './share.service.js';
import { VersionService } from './version.service.js';

@Module({
  providers: [DocumentResolver, DocumentService, ShareResolver, ShareService, VersionService],
})
export class DocumentModule {}
