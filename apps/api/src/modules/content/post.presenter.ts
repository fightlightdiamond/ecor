import { Post } from '@prisma/client';
import { translate } from '../../common/i18n/locale.util';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1544787219-7f47ccb7fae6?q=80&w=800';

/**
 * Khớp StorefrontController::formatPost.
 * title/short_description/body là JSON dịch → translate theo locale.
 * image lấy từ meta.image, fallback ảnh mặc định.
 */
export function presentPost(post: Post, locale: string): Record<string, unknown> {
  const meta = (post.meta as Record<string, unknown> | null) ?? {};
  const image = (typeof meta.image === 'string' && meta.image) || FALLBACK_IMAGE;

  return {
    id: post.id,
    slug: post.slug,
    title: translate(post.title, locale),
    short_description: translate(post.shortDescription, locale),
    body: translate(post.body, locale),
    is_published: post.isPublished,
    published_at: post.publishedAt,
    created_at: post.createdAt,
    image,
  };
}
