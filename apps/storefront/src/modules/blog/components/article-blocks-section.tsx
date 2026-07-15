import { getRegion } from "@lib/data/regions"
import BlockManager from "@modules/landing/components/block-manager"
import { normalizeLandingBlocks } from "@modules/landing/lib/normalize-landing-blocks"
import type { StrapiPageBlock } from "@types/strapi-blocks"
import { notFound } from "next/navigation"

export default async function ArticleBlocksSection({
  blocks,
  countryCode,
}: {
  blocks: StrapiPageBlock[]
  countryCode: string
}) {
  const normalized = normalizeLandingBlocks(blocks)

  if (!normalized.length) {
    return null
  }

  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  return (
    <div className="mt-12 border-t border-ui-border-base pt-12">
      <BlockManager blocks={normalized} countryCode={countryCode} region={region} eagerBlockCount={0} />
    </div>
  )
}
