import { Product } from '@prisma/client';
import { localizedField } from '../../common/i18n/locale.util';

/**
 * Khớp App\Support\ProductPresenter::forStorefront + formatProduct.
 * Giữ NGUYÊN key snake_case và kiểu dữ liệu để tương thích apps/web (Nuxt):
 *  - price: chuỗi 2 chữ số (Laravel cast decimal:2 → string)
 *  - images: mảng URL đã resolve, image = phần tử đầu
 */
export function presentProduct(
  product: Product,
  locale: string,
  imageUrls: string[],
): Record<string, unknown> {
  const customFields = (product.customFields as Record<string, unknown> | null) ?? {};
  const features = (customFields as { features?: unknown }).features ?? [];

  return {
    id: product.id,
    name: localizedField(product.translations, 'name', locale, product.name),
    slug: product.slug,
    description: localizedField(product.translations, 'description', locale, product.description),
    price: product.price.toFixed(2),
    stock: product.stock,
    in_stock: product.stock > 0,
    sku: product.sku,
    status: product.status,
    category_id: product.categoryId,
    custom_fields: product.customFields ?? [],
    features,
    images: imageUrls,
    image: imageUrls[0] ?? null,
  };
}
