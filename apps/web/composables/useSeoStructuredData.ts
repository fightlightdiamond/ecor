import type { BlogPost, Product } from '~/utils/storefront'

export function useProductStructuredData(product: Ref<Product | null>) {
  const config = useRuntimeConfig()
  const route = useRoute()

  useHead({
    script: computed(() => {
      if (!product.value) return []

      const baseUrl = String(config.public.siteUrl || '').replace(/\/$/, '')
      const pageUrl = baseUrl ? `${baseUrl}${route.path}` : route.path

      return [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.value.title,
          description: product.value.shortDesc || product.value.description,
          image: product.value.image,
          sku: product.value.id,
          offers: {
            '@type': 'Offer',
            price: product.value.price,
            priceCurrency: (product.value.currencyCode || 'VND').toUpperCase(),
            availability: product.value.inStock
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            url: pageUrl,
          },
        }),
      }]
    }),
  })
}

export function useArticleStructuredData(post: Ref<BlogPost | null | undefined>) {
  const config = useRuntimeConfig()
  const route = useRoute()
  const { site } = useSettings()

  useHead({
    script: computed(() => {
      if (!post.value) return []

      const baseUrl = String(config.public.siteUrl || '').replace(/\/$/, '')
      const pageUrl = baseUrl ? `${baseUrl}${route.path}` : route.path

      return [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.value.seoTitle || post.value.title,
          description: post.value.seoDescription || post.value.excerpt,
          image: post.value.image || undefined,
          datePublished: post.value.date,
          author: {
            '@type': 'Organization',
            name: site.value.name,
          },
          mainEntityOfPage: pageUrl,
        }),
      }]
    }),
  })
}
