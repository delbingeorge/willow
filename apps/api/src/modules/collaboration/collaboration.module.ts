import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { HocuspocusService } from './hocuspocus.service.js';

@Module({
  imports: [AuthModule],
  providers: [HocuspocusService],
})
export class CollaborationModule {}
