import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { MediaService } from '../media/media.service';
import { translate } from '../../common/i18n/locale.util';
import { presentProduct } from './product.presenter';
import { ListProductsDto, ListReviewsDto } from './dto/list-products.dto';

@Injectable()
export class CatalogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly media: MediaService,
  ) {}

  /** GET /storefront/categories */
  async getCategories(locale: string) {
    const categories = await this.prisma.category.findMany({
      where: { for: 'products', isActive: true },
      orderBy: { id: 'asc' },
    });

    return {
      success: true,
      data: categories.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: translate(c.name, locale),
      })),
    };
  }

  /** GET /storefront/products */
  async listProducts(locale: string, dto: ListProductsDto) {
    const perPage = Math.min(dto.per_page ?? 12, 100);
    const page = dto.page ?? 1;

    const where: Prisma.ProductWhereInput = { status: 'published' };
    if (dto.search) {
      where.OR = [
        { name: { contains: dto.search, mode: 'insensitive' } },
        { translations: { path: ['vi', 'name'], string_contains: dto.search } },
        { translations: { path: ['en', 'name'], string_contains: dto.search } },
      ];
    }
    if (dto.category_id) {
      where.categoryId = dto.category_id;
    }

    const [total, products] = await this.prisma.$transaction([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
    ]);

    return {
      success: true,
      data: await this.presentMany(products, locale),
      meta: {
        current_page: page,
        last_page: Math.max(1, Math.ceil(total / perPage)),
        total,
        per_page: perPage,
      },
    };
  }

  /** GET /storefront/products/featured */
  async getFeaturedProducts(locale: string) {
    const products = await this.prisma.product.findMany({
      where: { status: 'published' },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    return { success: true, data: await this.presentMany(products, locale) };
  }

  /** GET /storefront/products/:slug */
  async getProductBySlug(locale: string, slug: string) {
    const product = await this.prisma.product.findFirst({
      where: { slug, status: 'published' },
    });
    if (!product) {
      throw new NotFoundException('Not found');
    }

    const related = await this.prisma.product.findMany({
      where: {
        status: 'published',
        slug: { not: slug },
        ...(product.categoryId ? { categoryId: product.categoryId } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    return {
      success: true,
      data: await this.present(product, locale),
      related: await this.presentMany(related, locale),
    };
  }

  /** GET /storefront/products/:slug/reviews */
  async getProductReviews(slug: string, dto: ListReviewsDto) {
    const product = await this.prisma.product.findFirst({
      where: { slug, status: 'published' },
      select: { id: true },
    });
    if (!product) {
      throw new NotFoundException('Not found');
    }

    const perPage = Math.min(dto.per_page ?? 10, 50);
    const page = dto.page ?? 1;
    const where = { productId: product.id, isApproved: true };

    const [total, reviews, agg] = await this.prisma.$transaction([
      this.prisma.review.count({ where }),
      this.prisma.review.findMany({
        where,
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.review.aggregate({ where, _avg: { rating: true } }),
    ]);

    return {
      success: true,
      data: reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        author: r.user?.name ?? 'Khách hàng',
        created_at: r.createdAt,
      })),
      meta: {
        current_page: page,
        last_page: Math.max(1, Math.ceil(total / perPage)),
        total,
        per_page: perPage,
        average_rating: Math.round((agg._avg.rating ?? 0) * 10) / 10,
      },
    };
  }

  // ── helpers ──────────────────────────────────────────────────────────────

  private async present(product: Product, locale: string) {
    const imageUrls = await this.media.resolveImageUrls(product.images);
    return presentProduct(product, locale, imageUrls);
  }

  private async presentMany(products: Product[], locale: string) {
    return Promise.all(products.map((p) => this.present(p, locale)));
  }
}
