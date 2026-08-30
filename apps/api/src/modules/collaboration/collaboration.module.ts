import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { DocumentModule } from '../document/document.module.js';
import { HocuspocusService } from './hocuspocus.service.js';
import { YjsSyncModule } from './yjs-sync.module.js';

@Module({
  imports: [AuthModule, DocumentModule, YjsSyncModule],
  providers: [HocuspocusService],
})
export class CollaborationModule {}
