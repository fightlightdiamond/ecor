import LandingHero, { buildLandingHeroProps } from "@modules/landing/components/hero"

import {
  getStrapiMediaUrl,
  isExternalUrl,
  isStrapiVideo,
  mapHeroAlignment,
} from "@lib/strapi-media"
import type { HeroBlock } from "@types/strapi-blocks"

type HeroBlockProps = {
  block: HeroBlock
  countryCode: string
}

function mapCtaStyle(style?: "primary" | "outline") {
  return style === "outline" ? "outline" : "primary"
}

export default function HeroBlock({ block, countryCode }: HeroBlockProps) {
  const ctas = block.cta_buttons ?? []
  const primary = ctas[0]
  const secondary = ctas[1]
  const media = block.background_image
  const mediaUrl = getStrapiMediaUrl(media)
  const isVideo = isStrapiVideo(media)

  const props = buildLandingHeroProps(countryCode, {
    brandName: "Thăng Long Chè Việt",
    title: block.heading,
    subtitle: block.subheading || "",
    imageSrc: !isVideo ? mediaUrl : undefined,
    videoSrc: isVideo ? mediaUrl : undefined,
    imageAlt: media?.alternativeText || block.heading,
    align: mapHeroAlignment(block.alignment),
    overlay: "dark",
    size: "tall",
    primaryCta: primary
      ? {
          label: primary.label,
          href: primary.url,
          external: isExternalUrl(primary.url),
          variant: mapCtaStyle(primary.style),
        }
      : undefined,
    secondaryCta: secondary
      ? {
          label: secondary.label,
          href: secondary.url,
          external: isExternalUrl(secondary.url),
          variant: mapCtaStyle(secondary.style),
        }
      : undefined,
  })

  return <LandingHero {...props} />
}
