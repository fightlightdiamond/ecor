import Image from "next/image"

import { Button, Heading, clx } from "@modules/common/components/ui"

import type {
  LandingHeroAlign,
  LandingHeroCta,
  LandingHeroOverlay,
  LandingHeroProps,
  LandingHeroSize,
} from "./hero.types"

const SIZE_CLASSES: Record<LandingHeroSize, string> = {
  compact: "min-h-[60vh] sm:min-h-[65vh]",
  default: "min-h-[78vh] sm:min-h-[85vh]",
  tall: "min-h-[88vh] sm:min-h-[92vh]",
}

const OVERLAY_CLASSES: Record<LandingHeroOverlay, string> = {
  light:
    "bg-gradient-to-t from-black/55 via-black/25 to-black/10",
  medium:
    "bg-gradient-to-t from-[#1a2210]/90 via-[#1a2210]/55 to-[#1a2210]/20",
  dark: "bg-gradient-to-t from-[#0f140a]/95 via-[#0f140a]/60 to-[#0f140a]/30",
}

function HeroCtaLink({
  cta,
  onMedia,
}: {
  cta: LandingHeroCta
  onMedia: boolean
}) {
  const isOutline = cta.variant === "outline"
  const buttonVariant = isOutline ? "secondary" : "primary"
  const className = clx(
    "w-full sm:w-auto min-h-[48px] px-7 text-sm tracking-wide",
    !isOutline && "shadow-md",
    onMedia &&
      isOutline &&
      "bg-transparent text-white border-white/70 hover:bg-white/10 hover:text-white"
  )

  const button = (
    <Button variant={buttonVariant} className={className}>
      {cta.label}
    </Button>
  )

  if (cta.external) {
    return (
      <a
        href={cta.href}
        target="_blank"
        rel="noreferrer"
        className="inline-flex w-full sm:w-auto"
      >
        {button}
      </a>
    )
  }

  return (
    <a href={cta.href} className="inline-flex w-full sm:w-auto">
      {button}
    </a>
  )
}

function contentAlignClasses(align: LandingHeroAlign) {
  if (align === "center") {
    return {
      section: "items-center text-center",
      cta: "items-center sm:justify-center",
      vertical: "justify-end sm:justify-center",
    }
  }

  if (align === "right") {
    return {
      section: "items-end text-right ml-auto",
      cta: "items-stretch sm:items-end sm:justify-end",
      vertical: "justify-end sm:justify-center",
    }
  }

  return {
    section: "items-start text-left",
    cta: "items-stretch sm:items-center sm:justify-start",
    vertical: "justify-end",
  }
}

const LandingHero = ({
  eyebrow,
  title,
  subtitle,
  imageSrc,
  videoSrc,
  imageAlt = "",
  primaryCta,
  secondaryCta,
  align = "left",
  overlay = "dark",
  size = "tall",
  brandName,
}: LandingHeroProps) => {
  const hasImage = Boolean(imageSrc)
  const hasVideo = Boolean(videoSrc)
  const hasMedia = hasImage || hasVideo
  const alignClasses = contentAlignClasses(align)
  const heightClass = SIZE_CLASSES[size]
  const brand = brandName || eyebrow

  return (
    <section
      className={clx(
        "relative w-full overflow-hidden",
        heightClass
      )}
      aria-label="Hero"
    >
      {hasVideo ? (
        <>
          <video
            src={videoSrc}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          <div className={clx("absolute inset-0", OVERLAY_CLASSES[overlay])} aria-hidden />
        </>
      ) : hasImage ? (
        <>
          <Image
            src={imageSrc!}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            quality={65}
            className="object-cover object-center"
          />
          <div className={clx("absolute inset-0", OVERLAY_CLASSES[overlay])} aria-hidden />
        </>
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#2c3518] via-[#3d4a22] to-[#1a2210]"
          aria-hidden
        />
      )}

      <div
        className={clx(
          "content-container relative z-10 flex flex-col py-12 sm:py-16 lg:py-24",
          heightClass,
          alignClasses.vertical
        )}
      >
        <div
          className={clx(
            "flex w-full max-w-3xl flex-col gap-5 sm:gap-7",
            alignClasses.section,
            (align === "center" || align === "right") && "mx-auto"
          )}
        >
          {brand ? (
            <p
              className={clx(
                "font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight animate-rise-fade",
                hasMedia ? "text-white" : "text-ui-fg-base"
              )}
            >
              {brand}
            </p>
          ) : null}

          <Heading
            level="h1"
            className={clx(
              "font-display text-xl sm:text-2xl lg:text-3xl leading-snug font-medium tracking-wide animate-rise-fade [animation-delay:120ms]",
              hasMedia ? "text-white/95" : "text-ui-fg-base"
            )}
          >
            {title}
          </Heading>

          <p
            className={clx(
              "text-base sm:text-lg leading-relaxed max-w-xl animate-rise-fade [animation-delay:220ms]",
              hasMedia ? "text-white/80" : "text-ui-fg-subtle"
            )}
          >
            {subtitle}
          </p>

          {primaryCta || secondaryCta ? (
            <div
              className={clx(
                "flex w-full flex-col sm:flex-row gap-3 sm:gap-4 pt-1 sm:pt-2 animate-rise-fade [animation-delay:320ms]",
                alignClasses.cta
              )}
            >
              {primaryCta ? (
                <HeroCtaLink cta={primaryCta} onMedia={hasMedia} />
              ) : null}
              {secondaryCta ? (
                <HeroCtaLink cta={secondaryCta} onMedia={hasMedia} />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default LandingHero
export type { LandingHeroProps, LandingHeroCta } from "./hero.types"
export { DEFAULT_LANDING_HERO_CONTENT, HERO_CONTENT_PRESETS, HERO_IMAGE_PRESETS } from "./hero-content"
export { buildLandingHeroProps } from "./hero-utils"
