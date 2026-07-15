import { Suspense } from "react"

import type { HttpTypes } from "@medusajs/types"
import type { StrapiPageBlock } from "@types/strapi-blocks"

import BlockRenderer from "@modules/landing/components/block-manager/block-renderer"
import BlockSkeleton from "@modules/landing/components/block-manager/block-skeleton"
import { getBlockKey } from "@modules/landing/lib/normalize-landing-blocks"

type BlockManagerProps = {
  blocks: StrapiPageBlock[]
  countryCode: string
  region: HttpTypes.StoreRegion
  /**
   * Number of leading blocks to render eagerly (LCP / above-the-fold).
   * Use `0` when the hero is already rendered outside BlockManager.
   */
  eagerBlockCount?: number
}

/**
 * Maps Strapi dynamic-zone `blocks[]` to React components via `__component` (SRS §5.2).
 * Below-fold blocks use next/dynamic via BlockRenderer (SRS §5.3).
 */
export default function BlockManager({
  blocks,
  countryCode,
  region,
  eagerBlockCount = 1,
}: BlockManagerProps) {
  if (!blocks.length) {
    return null
  }

  return (
    <>
      {blocks.map((block, index) => {
        const lazy = index >= eagerBlockCount
        const renderer = (
          <BlockRenderer
            block={block}
            countryCode={countryCode}
            region={region}
            lazy={lazy}
          />
        )

        if (!lazy) {
          return <div key={getBlockKey(block, index)}>{renderer}</div>
        }

        return (
          <Suspense key={getBlockKey(block, index)} fallback={<BlockSkeleton />}>
            {renderer}
          </Suspense>
        )
      })}
    </>
  )
}
