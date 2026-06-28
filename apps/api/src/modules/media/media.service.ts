import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

/**
 * Resolve danh sách ảnh sản phẩm sang URL — tương đương
 * StorefrontController::resolveImageUrls + ProductPresenter của Laravel.
 *
 * Mỗi phần tử `images` (JSON) có thể là:
 *  - chuỗi URL http(s)://  → giữ nguyên
 *  - ID media (số)         → tra bảng `media` (gói awcodes/curator) và dựng URL
 *
 * URL media public dựng theo: `${MEDIA_PUBLIC_BASE_URL}/${path}`
 * (mặc định khớp Laravel public disk: `${APP_URL}/storage`). Việc chuyển media
 * sang S3 sẽ tinh chỉnh ở phase media-migration (xem docs).
 */
@Injectable()
export class MediaService {
  private readonly publicBaseUrl =
    process.env.MEDIA_PUBLIC_BASE_URL?.replace(/\/+$/, '') || 'http://localhost:8000/storage';

  constructor(private readonly prisma: PrismaService) {}

  async resolveImageUrls(images: unknown): Promise<string[]> {
    if (!Array.isArray(images) || images.length === 0) {
      return [];
    }

    const ids: number[] = [];
    for (const item of images) {
      if (typeof item === 'number' || (typeof item === 'string' && /^\d+$/.test(item))) {
        ids.push(Number(item));
      }
    }

    const mediaById = new Map<number, string>();
    if (ids.length > 0) {
      const rows = await this.prisma.media.findMany({
        where: { id: { in: ids } },
        select: { id: true, disk: true, path: true },
      });
      for (const row of rows) {
        mediaById.set(row.id, this.buildUrl(row.path));
      }
    }

    const urls: string[] = [];
    for (const item of images) {
      if (typeof item === 'string' && /^https?:\/\//i.test(item)) {
        urls.push(item);
      } else if (typeof item === 'number' || (typeof item === 'string' && /^\d+$/.test(item))) {
        const url = mediaById.get(Number(item));
        if (url) urls.push(url);
      }
    }
    return urls;
  }

  private buildUrl(path: string): string {
    return `${this.publicBaseUrl}/${path.replace(/^\/+/, '')}`;
  }
}
