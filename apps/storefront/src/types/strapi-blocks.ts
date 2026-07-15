export type StrapiMedia = {
  id?: number
  url?: string
  alternativeText?: string | null
  width?: number
  height?: number
  mime?: string | null
}

export type StrapiCtaButton = {
  id?: number
  label: string
  url: string
  style?: "primary" | "outline"
}

export type StrapiSeo = {
  metaTitle?: string | null
  metaDescription?: string | null
  ogImage?: StrapiMedia | null
}

export type HeroBlock = {
  __component: "page-blocks.hero"
  id?: number
  heading: string
  subheading?: string | null
  background_image?: StrapiMedia | null
  cta_buttons?: StrapiCtaButton[]
  alignment?: "Left" | "Center" | "Right"
}

export type FeatureListBlock = {
  __component: "page-blocks.feature-list"
  id?: number
  section_title?: string | null
  features?: {
    id?: number
    title: string
    description?: string | null
    icon?: StrapiMedia | null
    icon_name?: "shipping" | "gift" | "refresh" | "leaf" | "star" | "heart" | null
  }[]
}

export type ProductGridBlock = {
  __component: "page-blocks.product-grid"
  id?: number
  heading?: string | null
  medusa_collection_handle: string
  limit?: number | null
  layout?: "Grid" | "Slider"
}

export type TestimonialsBlock = {
  __component: "page-blocks.testimonials"
  id?: number
  heading?: string | null
  reviews?: {
    id?: number
    name: string
    role?: string | null
    content: string
    rating?: number | null
    avatar?: StrapiMedia | null
  }[]
}

export type CtaBannerBlock = {
  __component: "page-blocks.cta-banner"
  id?: number
  title: string
  description?: string | null
  button_label: string
  button_link: string
  background_color?: "brand" | "dark" | "green" | "amber"
}

export type FaqBlock = {
  __component: "page-blocks.faq"
  id?: number
  title?: string | null
  questions?: {
    id?: number
    question: string
    answer: string
  }[]
}

export type RichTextBlock = {
  __component: "page-blocks.rich-text"
  id?: number
  content: string
  container_width?: "Narrow" | "Full"
}

export type StrapiPageBlock =
  | HeroBlock
  | FeatureListBlock
  | ProductGridBlock
  | TestimonialsBlock
  | CtaBannerBlock
  | FaqBlock
  | RichTextBlock

export type StrapiLandingPage = {
  id: number
  documentId?: string
  title: string
  slug: string
  seoDescription?: string | null
  seo?: StrapiSeo | null
  blocks?: StrapiPageBlock[]
  content?: string | null
  publishedAt?: string | null
  createdAt?: string
  updatedAt?: string
}

export type StrapiArticle = {
  id: number
  documentId?: string
  title: string
  slug: string
  seoDescription?: string | null
  content?: string | null
  coverUrl?: string | null
  category?: {
    id: number
    name?: string
    slug?: string
  } | null
  blocks?: StrapiPageBlock[]
  publishedAt?: string | null
  createdAt?: string
  updatedAt?: string
}

export type StrapiListResponse<T> = {
  data: T[]
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export type StrapiSingleResponse<T> = {
  data: T[]
  meta?: Record<string, unknown>
}
