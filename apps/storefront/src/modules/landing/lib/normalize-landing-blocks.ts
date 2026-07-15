import {
  BLOCK_COMPONENT_IDS,
  isKnownBlockComponentId,
} from "@modules/landing/components/block-manager/block-constants"
import type { HeroBlock, StrapiPageBlock } from "@types/strapi-blocks"

/**
 * Strapi v5 returns dynamic-zone blocks as a flat array with `__component` on each item.
 * Unknown or malformed entries are dropped so a bad CMS entry cannot break the page.
 */
export function normalizeLandingBlocks(raw: unknown): StrapiPageBlock[] {
  if (!Array.isArray(raw)) {
    return []
  }

  return raw.filter((item): item is StrapiPageBlock => {
    if (!item || typeof item !== "object") {
      return false
    }

    const component = (item as { __component?: unknown }).__component

    return isKnownBlockComponentId(component)
  })
}

export function getBlockKey(block: StrapiPageBlock, index: number): string {
  const id = block.id != null ? block.id : index
  return `${block.__component}-${id}`
}

export function asHeroBlock(block: StrapiPageBlock): HeroBlock | null {
  return block.__component === BLOCK_COMPONENT_IDS.HERO
    ? (block as HeroBlock)
    : null
}
