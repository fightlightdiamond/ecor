import type { ApiEnvelope, Product, ProductCategory, RawProduct } from '~/utils/storefront'
import { categoryLabel, transformProduct } from '~/utils/storefront'

export type { Product } from '~/utils/storefront'

async function fetchAllProducts(fetchApi: ReturnType<typeof useApi>['fetchApi']) {
  const first = await fetchApi<ApiEnvelope<RawProduct[]>>('/products?per_page=100')
  const all = [...(first.data ?? [])]
  const lastPage = first.meta?.last_page ?? 1

  if (lastPage > 1) {
    const pages = await Promise.all(
      Array.from({ length: lastPage - 1 }, (_, i) =>
        fetchApi<ApiEnvelope<RawProduct[]>>(`/products?per_page=100&page=${i + 2}`),
      ),
    )
    for (const page of pages) {
      all.push(...(page.data ?? []))
    }
  }

  return { success: true, data: all, meta: first.meta }
}

export function useProducts() {
  const { locale } = useI18n()
  const { fetchApi } = useApi()

  const { data: productsData, pending } = useAsyncData(
    () => `products-${locale.value}`,
    () => fetchAllProducts(fetchApi),
    { default: () => ({ success: true, data: [] as RawProduct[] }) },
  )

  const products = computed<Product[]>(() => {
    const raw = productsData.value?.data ?? []
    return (Array.isArray(raw) ? raw : []).map(p => transformProduct(p, locale.value))
  })

  const { data: featuredData } = useAsyncData(
    () => `featured-products-${locale.value}`,
    () => fetchApi<ApiEnvelope<RawProduct[]>>('/products/featured'),
    { default: () => ({ success: true, data: [] as RawProduct[] }) },
  )

  const featuredProducts = computed<Product[]>(() => {
    const raw = featuredData.value?.data ?? []
    return (Array.isArray(raw) ? raw : []).map(p => transformProduct(p, locale.value))
  })

  const { data: categoriesData } = useAsyncData(
    'product-categories',
    () => fetchApi<ApiEnvelope<ProductCategory[]>>('/categories'),
    { default: () => ({ success: true, data: [] as ProductCategory[] }) },
  )

  const categories = computed(() => {
    const raw = categoriesData.value?.data ?? []
    return (Array.isArray(raw) ? raw : []).map(c => ({
      id: c.id,
      slug: c.slug,
      label: categoryLabel(c.name, locale.value),
    }))
  })

  const getBySlug = async (slug: string) => {
    try {
      const res = await fetchApi<ApiEnvelope<RawProduct> & { related?: RawProduct[] }>(`/products/${slug}`)
      if (res.success && res.data) {
        const product = transformProduct(res.data, locale.value)
        const relatedFromApi = (res.related ?? []).map(p => transformProduct(p, locale.value))
        return { product, relatedFromApi }
      }
    } catch (e) {
      console.error(e)
    }

    const found = products.value.find(p => p.slug === slug)
    if (found) {
      return {
        product: found,
        relatedFromApi: related(found.slug, found.categoryId, 3),
      }
    }

    return { product: null, relatedFromApi: [] as Product[] }
  }

  const related = (slug: string, categoryId: number | null, count = 3) => {
    const pool = categoryId
      ? products.value.filter(p => p.categoryId === categoryId && p.slug !== slug)
      : products.value.filter(p => p.slug !== slug)
    return pool.slice(0, count)
  }

  const byCategory = (categoryId: number | null) => {
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
