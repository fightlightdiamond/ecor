import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

/** Các khối nội dung site (khớp StorefrontSection / FE /storefront/site). */
export const SITE_SECTIONS = [
  { key: 'settings', label: 'Cài đặt chung' },
  { key: 'team', label: 'Đội ngũ' },
  { key: 'services', label: 'Dịch vụ' },
  { key: 'gallery', label: 'Thư viện ảnh' },
  { key: 'testimonials', label: 'Đánh giá' },
  // Ưu đãi trong tháng: danh sách sản phẩm ưu đãi { title, productIds: number[] }
  { key: 'promotions', label: 'Ưu đãi trong tháng' },
];

@Injectable()
export class SiteSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    const rows = await this.prisma.storefrontSection.findMany({
      where: { key: { in: SITE_SECTIONS.map((s) => s.key) } },
    });
    const byKey = new Map(rows.map((r) => [r.key, r]));
    return SITE_SECTIONS.map((s) => ({
      key: s.key,
      label: s.label,
      content: byKey.get(s.key)?.content ?? null,
    }));
  }

  async put(key: string, content: any) {
    const def = SITE_SECTIONS.find((s) => s.key === key);
    if (!def) throw new NotFoundException(`Section không hợp lệ: ${key}`);
    const now = new Date();
    const row = await this.prisma.storefrontSection.upsert({
      where: { key },
      update: { label: def.label, content, updatedAt: now },
      create: { key, label: def.label, content, createdAt: now, updatedAt: now },
    });
    return { key: row.key, label: row.label, content: row.content };
  }
}
