import { Module } from '@nestjs/common';
import { DocumentResolver } from './document.resolver.js';
import { DocumentService } from './document.service.js';

@Module({
  providers: [DocumentResolver, DocumentService],
})
export class DocumentModule {}
