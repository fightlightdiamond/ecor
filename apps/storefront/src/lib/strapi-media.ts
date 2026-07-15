import type { StrapiMedia } from "@/types/strapi-blocks"

const STRAPI_PUBLIC_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337"

/** Resolve a Strapi v5 flat media object to an absolute URL. */
export function getStrapiMediaUrl(media?: StrapiMedia | null): string | undefined {
  if (!media?.url) {
    return undefined
  }

  if (media.url.startsWith("http")) {
    return media.url
  }

  return `${STRAPI_PUBLIC_URL}${media.url}`
}

/** Prefix internal storefront paths with the active country code segment. */
export function withCountryPath(countryCode: string, href: string): string {
  if (!href) {
    return `/${countryCode}`
  }

  if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#")) {
    return href
  }

  let path = href.startsWith("/") ? href : `/${href}`

  // Guard against double country prefix (e.g. /vn/vn/store)
  const countryPrefix = `/${countryCode}`
  while (path.startsWith(`${countryPrefix}${countryPrefix}`)) {
    path = path.slice(countryPrefix.length)
  }

  if (path.startsWith(`${countryPrefix}/`) || path === countryPrefix) {
    return path
  }

  return `${countryPrefix}${path}`
}

export function isExternalUrl(href: string): boolean {
  return href.startsWith("http") || href.startsWith("mailto:")
}

export function isStrapiVideo(media?: StrapiMedia | null): boolean {
  if (!media?.url) {
    return false
  }

  if (media.mime?.startsWith("video/")) {
    return true
  }

  return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(media.url)
}

/** Map Strapi hero alignment enum to the landing hero component prop. */
export function mapHeroAlignment(
  alignment?: "Left" | "Center" | "Right" | null
): "left" | "center" | "right" {
  switch (alignment) {
    case "Center":
      return "center"
    case "Right":
      return "right"
    default:
      return "left"
  }
}
