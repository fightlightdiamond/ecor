import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { GeneratePresignedUrlDto, PresignedUrlResponse } from './dto/presigned-url.dto';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly region: string;
  private readonly presignedUrlExpiration: number;

  constructor(private readonly configService: ConfigService) {
    const endpoint = this.configService.get<string>('s3.endpoint');
    const forcePathStyle = this.configService.get<boolean>('s3.forcePathStyle');
    this.bucket = this.configService.get<string>('s3.bucket') || '';
    this.region = this.configService.get<string>('s3.region') || 'ap-southeast-1';
    this.presignedUrlExpiration =
      this.configService.get<number>('s3.presignedUrlExpiration') || 3600;

    const s3Config: S3ClientConfig = {
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>('s3.accessKeyId') || '',
        secretAccessKey: this.configService.get<string>('s3.secretAccessKey') || '',
      },
    };
    if (endpoint) {
      s3Config.endpoint = endpoint;
      s3Config.forcePathStyle = forcePathStyle;
    }
    this.s3Client = new S3Client(s3Config);
    this.logger.log(`S3 Service initialized (bucket: ${this.bucket}, region: ${this.region})`);
  }

  async generatePresignedUrl(dto: GeneratePresignedUrlDto): Promise<PresignedUrlResponse> {
    const fileKey = this.generateFileKey(dto.fileName, dto.fileType);
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
      ContentType: dto.contentType,
    });
    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: this.presignedUrlExpiration,
    });
    return {
      uploadUrl,
      fileKey,
      publicUrl: this.getPublicUrl(fileKey),
      expiresIn: this.presignedUrlExpiration,
    };
  }

  private generateFileKey(fileName: string, fileType: string): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const sanitized = fileName.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
    return `${fileType}/${year}/${month}/${randomUUID()}-${sanitized}`;
  }

  getPublicUrl(fileKey: string): string {
    const endpoint = this.configService.get<string>('s3.endpoint');
    if (endpoint) {
      return `${endpoint}/${this.bucket}/${fileKey}`;
    }
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${fileKey}`;
  }
}
