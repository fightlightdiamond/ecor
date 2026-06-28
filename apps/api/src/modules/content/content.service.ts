import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Post } from '@prisma/client';
import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { PrismaService } from '../database/prisma.service';
import { presentPost } from './post.presenter';
import { ListPostsDto } from './dto/list-posts.dto';
import { isVnpayConfigured } from '../../config/payment.config';

const SECTION_KEYS = ['settings', 'team', 'services', 'gallery', 'testimonials'] as const;

@Injectable()
export class ContentService {
  private readonly logger = new Logger(ContentService.name);
  private readonly dataDir =
    process.env.STOREFRONT_DATA_DIR || resolve(process.cwd(), 'resources', 'storefront');
  private readonly fileCache = new Map<string, unknown>();

  constructor(private readonly prisma: PrismaService) {}

  /** GET /storefront/site — khớp StorefrontContent::all() */
  async getSite() {
    const data: Record<string, unknown> = {};
    for (const key of SECTION_KEYS) {
      data[key] = await this.loadSection(key);
    }
    return { success: true, data };
  }

  /** Khớp StorefrontContent::load(): DB section trước, fallback file JSON. */
  private async loadSection(key: string): Promise<unknown> {
    const section = await this.prisma.storefrontSection.findUnique({ where: { key } });
    if (section && this.isNonEmpty(section.content)) {
      return section.content;
    }
    return this.loadFile(key);
  }

  private isNonEmpty(content: unknown): boolean {
    if (Array.isArray(content)) return content.length > 0;
    if (content && typeof content === 'object') return Object.keys(content).length > 0;
    return false;
  }

  private loadFile(key: string): unknown {
    if (this.fileCache.has(key)) return this.fileCache.get(key);
    const path = join(this.dataDir, `${key}.json`);
    let value: unknown = [];
    if (existsSync(path)) {
      try {
        value = JSON.parse(readFileSync(path, 'utf-8'));
      } catch (e) {
        this.logger.warn(`Không đọc được ${path}: ${(e as Error).message}`);
      }
    }
    this.fileCache.set(key, value);
    return value;
  }

  /** GET /storefront/sitemap */
  async getSitemap() {
    const [products, posts] = await Promise.all([
      this.prisma.product.findMany({
        where: { status: 'published' },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.post.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: 'desc' },
      }),
    ]);

    return {
      success: true,
      data: {
        products: products.map((p) => ({ slug: p.slug, updated_at: p.updatedAt })),
        posts: posts.map((p) => ({ slug: p.slug, updated_at: p.updatedAt })),
      },
    };
  }

  /** GET /storefront/posts */
  async listPosts(locale: string, dto: ListPostsDto) {
    const perPage = Math.min(dto.per_page ?? 9, 50);
    const page = dto.page ?? 1;
    const where = { isPublished: true };

    const [total, posts] = await this.prisma.$transaction([
      this.prisma.post.count({ where }),
      this.prisma.post.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
    ]);

    return {
      success: true,
      data: posts.map((p: Post) => presentPost(p, locale)),
      meta: {
        current_page: page,
        last_page: Math.max(1, Math.ceil(total / perPage)),
        total,
        per_page: perPage,
      },
    };
  }

  /** GET /storefront/posts/latest */
  async getLatestPosts(locale: string) {
    const posts = await this.prisma.post.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      take: 4,
    });
    return { success: true, data: posts.map((p) => presentPost(p, locale)) };
  }

  /** GET /storefront/posts/:slug */
  async getPostBySlug(locale: string, slug: string) {
    const post = await this.prisma.post.findFirst({ where: { slug, isPublished: true } });
    if (!post) {
      throw new NotFoundException('Not found');
    }
    return { success: true, data: presentPost(post, locale) };
  }

  /** GET /storefront/payment-methods */
  getPaymentMethods() {
    const methods = [{ id: 'cod', label: 'Thanh toán khi nhận hàng (COD)' }];
    if (isVnpayConfigured()) {
      methods.push({ id: 'vnpay', label: 'VNPay (ATM / QR / Thẻ)' });
    }
    return { success: true, data: { methods } };
  }
}
