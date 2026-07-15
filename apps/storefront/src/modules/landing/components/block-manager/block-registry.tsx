import dynamic from "next/dynamic"
import type { ComponentType } from "react"

import CtaBannerBlock from "@modules/landing/blocks/cta-banner-block"
import FaqBlock from "@modules/landing/blocks/faq-block"
import FeatureListBlock from "@modules/landing/blocks/feature-list-block"
import HeroBlock from "@modules/landing/blocks/hero-block"
import ProductGridBlock from "@modules/landing/blocks/product-grid-block"
import RichTextBlock from "@modules/landing/blocks/rich-text-block"
import TestimonialsBlock from "@modules/landing/blocks/testimonials-block"
import {
  BLOCK_COMPONENT_IDS,
  type BlockComponentId,
} from "@modules/landing/components/block-manager/block-constants"
import BlockSkeleton from "@modules/landing/components/block-manager/block-skeleton"

type AnyBlockComponent = ComponentType<Record<string, unknown>>

/**
 * Single registry mapping Strapi `__component` → React component.
 * Add new blocks here when extending the CMS library.
 */
export const BLOCK_COMPONENT_REGISTRY: Record<BlockComponentId, AnyBlockComponent> =
  {
    [BLOCK_COMPONENT_IDS.HERO]: HeroBlock,
    [BLOCK_COMPONENT_IDS.FEATURE_LIST]: FeatureListBlock,
    [BLOCK_COMPONENT_IDS.PRODUCT_GRID]: ProductGridBlock,
    [BLOCK_COMPONENT_IDS.TESTIMONIALS]: TestimonialsBlock,
    [BLOCK_COMPONENT_IDS.CTA_BANNER]: CtaBannerBlock,
    [BLOCK_COMPONENT_IDS.FAQ]: FaqBlock,
    [BLOCK_COMPONENT_IDS.RICH_TEXT]: RichTextBlock,
  }

/** Code-split below-fold blocks (SRS §5.3 — next/dynamic). */
export const LAZY_BLOCK_COMPONENT_REGISTRY: Record<
  Exclude<BlockComponentId, typeof BLOCK_COMPONENT_IDS.HERO>,
  AnyBlockComponent
> = {
  [BLOCK_COMPONENT_IDS.FEATURE_LIST]: dynamic(
    () => import("@modules/landing/blocks/feature-list-block"),
    { loading: () => <BlockSkeleton /> }
  ),
  [BLOCK_COMPONENT_IDS.PRODUCT_GRID]: dynamic(
    () => import("@modules/landing/blocks/product-grid-block"),
    { loading: () => <BlockSkeleton /> }
  ),
  [BLOCK_COMPONENT_IDS.TESTIMONIALS]: dynamic(
    () => import("@modules/landing/blocks/testimonials-block"),
    { loading: () => <BlockSkeleton /> }
  ),
  [BLOCK_COMPONENT_IDS.CTA_BANNER]: dynamic(
    () => import("@modules/landing/blocks/cta-banner-block"),
    { loading: () => <BlockSkeleton /> }
  ),
  [BLOCK_COMPONENT_IDS.FAQ]: dynamic(
    () => import("@modules/landing/blocks/faq-block"),
    { loading: () => <BlockSkeleton /> }
  ),
  [BLOCK_COMPONENT_IDS.RICH_TEXT]: dynamic(
    () => import("@modules/landing/blocks/rich-text-block"),
    { loading: () => <BlockSkeleton /> }
  ),
}

export function resolveBlockComponent(
  componentId: BlockComponentId,
  lazy: boolean
): AnyBlockComponent | null {
  if (componentId === BLOCK_COMPONENT_IDS.HERO) {
    return HeroBlock
  }

  if (lazy) {
    return LAZY_BLOCK_COMPONENT_REGISTRY[componentId] ?? null
  }

  return BLOCK_COMPONENT_REGISTRY[componentId] ?? null
}
