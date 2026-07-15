import type { HttpTypes } from "@medusajs/types"
import type { StrapiPageBlock } from "@types/strapi-blocks"

import BlockErrorBoundary from "@modules/landing/blocks/block-error-boundary"
import { resolveBlockComponent } from "@modules/landing/components/block-manager/block-registry"

type BlockRendererProps = {
  block: StrapiPageBlock
  countryCode: string
  region: HttpTypes.StoreRegion
  lazy: boolean
}

export default function BlockRenderer({
  block,
  countryCode,
  region,
  lazy,
}: BlockRendererProps) {
  const Component = resolveBlockComponent(block.__component, lazy)

  if (!Component) {
    return null
  }

  const props: Record<string, unknown> = { block, countryCode }

  if (block.__component === "page-blocks.product-grid") {
    props.region = region
  }

  return (
    <BlockErrorBoundary blockType={block.__component}>
      <Component {...props} />
    </BlockErrorBoundary>
  )
}
