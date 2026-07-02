import type { MedusaCategory, MedusaProduct } from '~/utils/medusa'
import type { Product } from '~/utils/storefront'
import { transformMedusaCategory, transformMedusaProduct } from '~/utils/medusa'
import { categoryLabel } from '~/utils/storefront'

export type { Product } from '~/utils/storefront'

const PRODUCT_FIELDS = 'id,title,handle,description,thumbnail,*images,*categories,*variants.calculated_price'

export function useProducts() {
  const { locale } = useI18n()
  const { fetchMedusa, regionId } = useMedusaApi()

  const { data: productsData, pending } = useAsyncData(
    'medusa-products',
    () => fetchMedusa<{ products: MedusaProduct[] }>(
      `/store/products?limit=100&region_id=${regionId}&fields=${PRODUCT_FIELDS}`,
    ),
    { default: () => ({ products: [] as MedusaProduct[] }) },
  )

  const products = computed<Product[]>(() =>
    (productsData.value?.products ?? []).map(transformMedusaProduct),
  )

  // Medusa has no built-in "featured" flag out of the box — surface the
  // first few products instead. Curate via a real flag (e.g. metadata.featured)
  // once real product data replaces the seeded demo catalog.
  const featuredProducts = computed<Product[]>(() => products.value.slice(0, 6))

  const { data: categoriesData } = useAsyncData(
    'medusa-product-categories',
    () => fetchMedusa<{ product_categories: MedusaCategory[] }>('/store/product-categories?limit=100'),
    { default: () => ({ product_categories: [] as MedusaCategory[] }) },
  )

  const categories = computed<{ id: string, slug: string, label: string }[]>(() =>
    (categoriesData.value?.product_categories ?? []).map((c) => {
      const cat = transformMedusaCategory(c)
      return { id: cat.id, slug: cat.slug, label: categoryLabel(cat.name, locale.value) }
    }),
  )

  const getBySlug = async (slug: string) => {
    try {
      const res = await fetchMedusa<{ products: MedusaProduct[] }>(
        `/store/products?handle=${encodeURIComponent(slug)}&region_id=${regionId}&fields=${PRODUCT_FIELDS}`,
      )
      const raw = res.products?.[0]
      if (raw) {
        const product = transformMedusaProduct(raw)
        return { product, relatedFromApi: related(product.slug, product.categoryId, 3) }
      }
    } catch (e) {
      console.error(e)
    }

    return { product: null, relatedFromApi: [] as Product[] }
  }

  const related = (slug: string, categoryId: string | null, count = 3) => {
    const pool = categoryId
      ? products.value.filter(p => p.categoryId === categoryId && p.slug !== slug)
      : products.value.filter(p => p.slug !== slug)
    return pool.slice(0, count)
  }

  const byCategory = (categoryId: string | null) => {
    if (!categoryId) return products.value
    return products.value.filter(p => p.categoryId === categoryId)
  }

  return {
    products,
    featuredProducts,
    categories,
    pending,
    getBySlug,
    related,
    byCategory,
  }
}
