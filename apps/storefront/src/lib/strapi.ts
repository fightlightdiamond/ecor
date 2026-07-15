/**
 * Strapi fetch utilities for the Next.js storefront (ISR + deep block populate).
 */

import { unstable_cache } from "next/cache"
import { cache } from "react"
import qs from "qs"

import type {
  StrapiArticle,
  StrapiLandingPage,
  StrapiListResponse,
} from "@types/strapi-blocks"

const STRAPI_API_URL =
  process.env.STRAPI_API_URL_SERVER ||
  process.env.NEXT_PUBLIC_STRAPI_API_URL ||
  "http://127.0.0.1:1337"

const STRAPI_REVALIDATE_SECONDS = 60

const BLOCKS_POPULATE = {
  on: {
    "page-blocks.hero": {
      populate: ["background_image", "cta_buttons"],
    },
    "page-blocks.feature-list": {
      populate: {
        features: { populate: ["icon"] },
      },
    },
    "page-blocks.product-grid": true,
    "page-blocks.testimonials": {
      populate: {
        reviews: { populate: ["avatar"] },
      },
    },
    "page-blocks.cta-banner": true,
    "page-blocks.faq": {
      populate: {
        questions: true,
      },
    },
    "page-blocks.rich-text": true,
  },
}

const LANDING_BLOCKS_POPULATE = {
  seo: { populate: ["ogImage"] },
  blocks: BLOCKS_POPULATE,
}

interface FetchStrapiParams {
  endpoint: string
  query?: Record<string, unknown>
  options?: RequestInit
  revalidate?: number
}

export async function fetchStrapi<T>({
  endpoint,
  query = {},
  options = {},
  revalidate = STRAPI_REVALIDATE_SECONDS,
}: FetchStrapiParams): Promise<T> {
  const queryString = qs.stringify(query, { encodeValuesOnly: true })
  const url = `${STRAPI_API_URL}/api/${endpoint}${queryString ? `?${queryString}` : ""}`

  const res = await fetch(url, {
    next: { revalidate },
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!res.ok) {
    throw new Error(`Strapi API error [${endpoint}]: ${res.status} ${res.statusText}`)
  }

  return res.json() as Promise<T>
}

export async function getArticles() {
  return fetchStrapi({
    endpoint: "articles",
    query: { populate: "*", status: "published" },
  })
}

export async function getArticleBySlug(slug: string): Promise<StrapiArticle | null> {
  const response = await fetchStrapi<StrapiListResponse<StrapiArticle>>({
    endpoint: "articles",
    query: {
      filters: { slug: { $eq: slug } },
      populate: {
        category: true,
        blocks: BLOCKS_POPULATE,
      },
      status: "published",
    },
  }).catch(() => null)

  return response?.data?.[0] ?? null
}

async function fetchLandingPageBySlug(
  slug: string
): Promise<StrapiLandingPage | null> {
  const response = await fetchStrapi<StrapiListResponse<StrapiLandingPage>>({
    endpoint: "landing-pages",
    query: {
      filters: { slug: { $eq: slug } },
      populate: LANDING_BLOCKS_POPULATE,
      status: "published",
    },
  }).catch(() => null)

  return response?.data?.[0] ?? null
}

const getLandingPageBySlugCached = (slug: string) =>
  unstable_cache(
    () => fetchLandingPageBySlug(slug),
    ["strapi-landing-page", slug],
    {
      revalidate: STRAPI_REVALIDATE_SECONDS,
      tags: [`strapi-landing-${slug}`],
    }
  )()

/** Dedupes within a request; caches across requests via unstable_cache. */
export const getLandingPageBySlug = cache((slug: string) =>
  getLandingPageBySlugCached(slug)
)

export async function listLandingPages(): Promise<StrapiLandingPage[]> {
  const response = await fetchStrapi<StrapiListResponse<StrapiLandingPage>>({
    endpoint: "landing-pages",
    query: {
      fields: ["title", "slug", "seoDescription"],
      status: "published",
    },
  }).catch(() => null)

  return response?.data ?? []
}

/** @deprecated Use getLandingPageBySlug */
export async function getLandingPage(slug: string) {
  return getLandingPageBySlug(slug)
}

export function getLandingPageMetadata(page: StrapiLandingPage) {
  return {
    title: page.seo?.metaTitle || page.title,
    description:
      page.seo?.metaDescription || page.seoDescription || undefined,
  }
}
