import { Suspense } from "react"
import { notFound } from "next/navigation"

import { getRegion } from "@lib/data/regions"
import BlockManager from "@modules/landing/components/block-manager"
import BlockSkeleton from "@modules/landing/components/block-manager/block-skeleton"
import type { StrapiPageBlock } from "@types/strapi-blocks"

export default async function LandingBlocksRest({
  blocks,
  countryCode,
}: {
  blocks: StrapiPageBlock[]
  countryCode: string
}) {
  if (!blocks.length) {
    return null
  }

  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  return (
    <Suspense fallback={<BlockSkeleton />}>
      <BlockManager
        blocks={blocks}
        countryCode={countryCode}
        region={region}
        eagerBlockCount={0}
      />
    </Suspense>
  )
}
