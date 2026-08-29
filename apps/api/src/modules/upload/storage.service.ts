export interface UploadResult {
  url: string;
  key: string;
}

export abstract class StorageService {
  abstract upload(buffer: Buffer, key: string, contentType: string): Promise<UploadResult>;
}
