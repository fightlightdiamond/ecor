import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getLandingPageMetadata, getLandingPageBySlug } from "@lib/strapi"
import { getRegion } from "@lib/data/regions"
import HeroBlock from "@modules/landing/blocks/hero-block"
import LandingBlocksRest from "@modules/landing/components/landing-blocks-rest"
import BlockManager from "@modules/landing/components/block-manager"
import {
  asHeroBlock,
  normalizeLandingBlocks,
} from "@modules/landing/lib/normalize-landing-blocks"
import type { StrapiLandingPage } from "@types/strapi-blocks"

type LandingPageTemplateProps = {
  page: StrapiLandingPage
  countryCode: string
}

export async function buildLandingMetadata(
  slug: string
): Promise<Metadata | null> {
  const page = await getLandingPageBySlug(slug)

  if (!page) {
    return null
  }

  const meta = getLandingPageMetadata(page)

  return {
    title: meta.title,
    description: meta.description,
  }
}

export default async function LandingPageTemplate({
  page,
  countryCode,
}: LandingPageTemplateProps) {
  const blocks = normalizeLandingBlocks(page.blocks)
  const firstBlock = blocks[0]
  const heroBlock = firstBlock ? asHeroBlock(firstBlock) : null

  if (heroBlock && blocks.length > 0) {
    const restBlocks = blocks.slice(1)

    return (
      <>
        <HeroBlock block={heroBlock} countryCode={countryCode} />
        <LandingBlocksRest blocks={restBlocks} countryCode={countryCode} />
      </>
    )
  }

  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  if (blocks.length) {
    return (
      <BlockManager
        blocks={blocks}
        countryCode={countryCode}
        region={region}
        eagerBlockCount={1}
      />
    )
  }

  if (page.content) {
    return (
      <article className="content-container py-12 prose max-w-3xl mx-auto">
        <h1>{page.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
      </article>
    )
  }

  return (
    <div className="content-container py-20 text-center text-ui-fg-subtle">
      <p>Trang này chưa có nội dung.</p>
    </div>
  )
}
