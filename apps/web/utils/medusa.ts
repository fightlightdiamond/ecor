import type { Product, ProductCategory } from '~/utils/storefront'
import { FALLBACK_PRODUCT_IMAGE, stripHtml } from '~/utils/storefront'

export interface MedusaVariant {
  id: string
  calculated_price?: { calculated_amount: number | null; currency_code: string } | null
}

export interface MedusaCategory {
  id: string
  name: string
  handle: string
}

export interface MedusaProduct {
  id: string
  title: string
  handle: string
  description?: string | null
  thumbnail?: string | null
  images?: { url: string }[]
  categories?: MedusaCategory[]
  variants?: MedusaVariant[]
}

export function transformMedusaCategory(c: MedusaCategory): ProductCategory {
  return { id: c.id, slug: c.handle, name: c.name }
}

export function transformMedusaProduct(p: MedusaProduct): Product {
  const gallery = (p.images?.map(i => i.url) ?? []).filter(Boolean)
  const description = p.description ?? ''
  const plain = stripHtml(description)
  const variant = p.variants?.[0]

  return {
    id: p.id,
    variantId: variant?.id ?? '',
    slug: p.handle,
    price: variant?.calculated_price?.calculated_amount ?? 0,
    image: p.thumbnail || gallery[0] || FALLBACK_PRODUCT_IMAGE,
    gallery: gallery.length ? gallery : [p.thumbnail || FALLBACK_PRODUCT_IMAGE],
    title: p.title,
    shortDesc: plain.slice(0, 160) + (plain.length > 160 ? '…' : ''),
    description,
    features: [],
    categoryId: p.categories?.[0]?.id ?? null,
    // Medusa v2's real stock level requires resolving inventory reservations
    // per location — out of scope here; treat all listed products as
    // available and let checkout surface any genuine backorder error.
    inStock: true,
  }
}
