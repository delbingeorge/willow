import { Module } from '@nestjs/common';
import { YjsSyncService } from './yjs-sync.service.js';

@Module({
  providers: [YjsSyncService],
  exports: [YjsSyncService],
})
export class YjsSyncModule {}
