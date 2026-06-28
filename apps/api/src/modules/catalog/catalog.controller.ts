import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { Lang } from '../../common/decorators/lang.decorator';
import { CatalogService } from './catalog.service';
import { ListProductsDto, ListReviewsDto } from './dto/list-products.dto';

/**
 * Port các endpoint catalog của Laravel StorefrontController.
 * Giữ nguyên path, envelope { success, data, meta?, related? } cho apps/web.
 *
 * Lưu ý thứ tự: route tĩnh (`products/featured`, `products/:slug/reviews`)
 * khai báo TRƯỚC `products/:slug` để không bị nuốt bởi param.
 */
@ApiTags('Storefront / Catalog')
@Controller('storefront')
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Danh mục sản phẩm' })
  getCategories(@Lang() lang: string) {
    return this.catalog.getCategories(lang);
  }

  @Public()
  @Get('products')
  @ApiOperation({ summary: 'Danh sách sản phẩm (phân trang, lọc)' })
  listProducts(@Lang() lang: string, @Query() query: ListProductsDto) {
    return this.catalog.listProducts(lang, query);
  }

  @Public()
  @Get('products/featured')
  @ApiOperation({ summary: 'Sản phẩm nổi bật (5 mới nhất)' })
  getFeatured(@Lang() lang: string) {
    return this.catalog.getFeaturedProducts(lang);
  }

  @Public()
  @Get('products/:slug/reviews')
  @ApiOperation({ summary: 'Đánh giá đã duyệt của sản phẩm' })
  getReviews(@Param('slug') slug: string, @Query() query: ListReviewsDto) {
    return this.catalog.getProductReviews(slug, query);
  }

  @Public()
  @Get('products/:slug')
  @ApiOperation({ summary: 'Chi tiết sản phẩm + sản phẩm liên quan' })
  getBySlug(@Lang() lang: string, @Param('slug') slug: string) {
    return this.catalog.getProductBySlug(lang, slug);
  }
}
