/** Strapi dynamic-zone `__component` identifiers — keep in sync with `strapi/src/components/page-blocks/`. */
export const BLOCK_COMPONENT_IDS = {
  HERO: "page-blocks.hero",
  FEATURE_LIST: "page-blocks.feature-list",
  PRODUCT_GRID: "page-blocks.product-grid",
  TESTIMONIALS: "page-blocks.testimonials",
  CTA_BANNER: "page-blocks.cta-banner",
  FAQ: "page-blocks.faq",
  RICH_TEXT: "page-blocks.rich-text",
} as const

export type BlockComponentId =
  (typeof BLOCK_COMPONENT_IDS)[keyof typeof BLOCK_COMPONENT_IDS]

export const KNOWN_BLOCK_COMPONENT_IDS: readonly BlockComponentId[] =
  Object.values(BLOCK_COMPONENT_IDS)

export function isKnownBlockComponentId(
  value: unknown
): value is BlockComponentId {
  return (
    typeof value === "string" &&
    (KNOWN_BLOCK_COMPONENT_IDS as readonly string[]).includes(value)
  )
}
