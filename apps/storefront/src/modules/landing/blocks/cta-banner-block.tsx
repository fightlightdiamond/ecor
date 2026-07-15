import { Button, Heading, Text, clx } from "@modules/common/components/ui"

import { isExternalUrl, withCountryPath } from "@lib/strapi-media"
import type { CtaBannerBlock } from "@types/strapi-blocks"

const BG_CLASSES: Record<NonNullable<CtaBannerBlock["background_color"]>, string> = {
  brand: "bg-brand-solid text-white",
  dark: "bg-[#1a2210] text-[#f2f4ed]",
  green: "bg-[#3d5a2a] text-white",
  amber: "bg-[#8a6a2f] text-white",
}

type CtaBannerBlockProps = {
  block: CtaBannerBlock
  countryCode: string
}

export default function CtaBannerBlock({ block, countryCode }: CtaBannerBlockProps) {
  const href = withCountryPath(countryCode, block.button_link)
  const external = isExternalUrl(block.button_link)
  const bg = BG_CLASSES[block.background_color ?? "brand"]

  const button = (
    <Button
      variant="secondary"
      className="min-h-[48px] px-7 tracking-wide bg-white/95 text-[#1a2210] border-transparent hover:bg-white"
    >
      {block.button_label}
    </Button>
  )

  return (
    <section className={clx("relative w-full overflow-hidden py-16 sm:py-20", bg)}>
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18), transparent 40%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.18), transparent 45%)",
        }}
        aria-hidden
      />
      <div className="content-container relative flex flex-col items-center text-center gap-5 max-w-3xl mx-auto animate-rise-fade">
        <Heading level="h2" className="font-display text-3xl sm:text-4xl font-medium tracking-tight">
          {block.title}
        </Heading>
        {block.description ? (
          <Text className="text-base sm:text-lg leading-relaxed opacity-90 max-w-2xl">
            {block.description}
          </Text>
        ) : null}
        {external ? (
          <a href={href} target="_blank" rel="noreferrer">
            {button}
          </a>
        ) : (
          <a href={href}>{button}</a>
        )}
      </div>
    </section>
  )
}
