import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { Lang } from '../../common/decorators/lang.decorator';
import { ContentService } from './content.service';
import { ListPostsDto } from './dto/list-posts.dto';

/**
 * Port các endpoint Content/Site của Laravel StorefrontController.
 * Giữ path + envelope cho apps/web. Route tĩnh `posts/latest` khai báo
 * TRƯỚC `posts/:slug`.
 */
@ApiTags('Storefront / Content')
@Controller('storefront')
export class ContentController {
  constructor(private readonly content: ContentService) {}

  @Public()
  @Get('site')
  @ApiOperation({ summary: 'Bundle nội dung site (settings/team/services/gallery/testimonials)' })
  getSite() {
    return this.content.getSite();
  }

  @Public()
  @Get('sitemap')
  @ApiOperation({ summary: 'Slug sản phẩm + bài viết cho sitemap' })
  getSitemap() {
    return this.content.getSitemap();
  }

  @Public()
  @Get('payment-methods')
  @ApiOperation({ summary: 'Phương thức thanh toán khả dụng' })
  getPaymentMethods() {
    return this.content.getPaymentMethods();
  }

  @Public()
  @Get('posts/latest')
  @ApiOperation({ summary: 'Bài viết mới nhất (4)' })
  getLatest(@Lang() lang: string) {
    return this.content.getLatestPosts(lang);
  }

  @Public()
  @Get('posts')
  @ApiOperation({ summary: 'Danh sách bài viết (phân trang)' })
  listPosts(@Lang() lang: string, @Query() query: ListPostsDto) {
    return this.content.listPosts(lang, query);
  }

  @Public()
  @Get('posts/:slug')
  @ApiOperation({ summary: 'Chi tiết bài viết' })
  getBySlug(@Lang() lang: string, @Param('slug') slug: string) {
    return this.content.getPostBySlug(lang, slug);
  }
}
