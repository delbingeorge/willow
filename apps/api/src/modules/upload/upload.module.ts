import { Module } from '@nestjs/common';
import { S3StorageService } from './s3-storage.service.js';
import { StorageService } from './storage.service.js';
import { UploadController } from './upload.controller.js';
import { UploadService } from './upload.service.js';

@Module({
  controllers: [UploadController],
  providers: [UploadService, { provide: StorageService, useClass: S3StorageService }],
})
export class UploadModule {}
