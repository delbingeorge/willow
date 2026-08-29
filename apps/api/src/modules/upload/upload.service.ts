import { randomUUID } from 'node:crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { StorageService } from './storage.service.js';

export const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_DIMENSION = 2000;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png'];
const JPEG_QUALITY = 82;

@Injectable()
export class UploadService {
  constructor(private readonly storageService: StorageService) {}

  async uploadImage(file: Express.Multer.File | undefined) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('Unsupported file type. Allowed: JPEG, PNG');
    }

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      throw new BadRequestException(`File too large (max ${MAX_UPLOAD_SIZE_BYTES / (1024 * 1024)}MB)`);
    }

    const isPng = file.mimetype === 'image/png';
    const processed = await sharp(file.buffer)
      .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
      .toFormat(isPng ? 'png' : 'jpeg', isPng ? {} : { quality: JPEG_QUALITY })
      .toBuffer();

    const key = `images/${randomUUID()}.${isPng ? 'png' : 'jpg'}`;
    const result = await this.storageService.upload(processed, key, file.mimetype);

    return { url: result.url };
  }
}
