export interface ApiEnvelope<T> {
  success: boolean
  data: T
  meta?: {
    current_page: number
    last_page: number
    total: number
    per_page?: number
  }
  message?: string
}

export interface Product {
  id: string
  /** Default variant id — required by Medusa's cart line-item API (add to cart). */
  variantId: string
  slug: string
  price: number
  image: string
  gallery: string[]
  title: string
  shortDesc: string
  description: string
  features: string[]
  categoryId: string | null
  inStock: boolean
}

export interface RawPost {
  id: number
  slug: string
  title: unknown
  short_description?: unknown
  body?: unknown
  image?: string | null
  published_at?: string
  created_at?: string
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  image: string
  date: string
  author: string
}

export interface ProductCategory {
  id: string
  slug: string
  name: Record<string, string> | string
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export function localText(field: unknown, locale: string): string {
  if (!field) return ''
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field)
      if (typeof parsed === 'object' && parsed !== null) {
        return (parsed as Record<string, string>)[locale] ?? (parsed as Record<string, string>).vi ?? ''
      }
    } catch {
      return field
    }
    return field
  }
  if (typeof field === 'object' && field !== null) {
    const obj = field as Record<string, string>
    return obj[locale] ?? obj.vi ?? ''
  }
  return String(field)
}

export const FALLBACK_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1594631252845-29fc4cc8c011?q=80&w=800'
const FALLBACK_POST_IMAGE = 'https://images.unsplash.com/photo-1544787219-7f47ccb7fae6?q=80&w=800'

export function parseApiError(err: unknown, fallback: string): string {
  if (err && typeof err === 'object') {
    const data = (err as { data?: { message?: string } }).data
    if (data?.message) return data.message
  }
  return fallback
}

export function transformPost(p: RawPost, locale = 'vi'): BlogPost {
  const content = localText(p.body, locale)
  const excerptRaw = localText(p.short_description, locale) || stripHtml(content).slice(0, 200)

  return {
    slug: p.slug,
    title: localText(p.title, locale),
    excerpt: excerptRaw,
    content,
    image: p.image || FALLBACK_POST_IMAGE,
    date: p.published_at || p.created_at || '',
    author: 'Admin',
  }
}

export function categoryLabel(name: ProductCategory['name'], locale: string): string {
  return localText(name, locale)
}
