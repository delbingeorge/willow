import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { StorageService, type UploadResult } from './storage.service.js';

@Injectable()
export class S3StorageService extends StorageService {
  private readonly client: S3Client;

  constructor() {
    super();
    this.client = new S3Client({
      region: process.env.STORAGE_REGION ?? 'auto',
      endpoint: process.env.STORAGE_ENDPOINT,
      credentials: {
        accessKeyId: process.env.STORAGE_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY ?? '',
      },
    });
  }

  async upload(buffer: Buffer, key: string, contentType: string): Promise<UploadResult> {
    const bucket = process.env.STORAGE_BUCKET;
    const publicUrlBase = process.env.STORAGE_PUBLIC_URL_BASE;

    if (!bucket || !publicUrlBase) {
      throw new Error('STORAGE_BUCKET and STORAGE_PUBLIC_URL_BASE must be configured');
    }

    await this.client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      }),
    );

    return { url: `${publicUrlBase.replace(/\/$/, '')}/${key}`, key };
  }
}
