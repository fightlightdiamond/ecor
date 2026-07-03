import { Button, Heading, clx } from "@modules/common/components/ui"

import type {
  LandingHeroAlign,
  LandingHeroCta,
  LandingHeroOverlay,
  LandingHeroProps,
  LandingHeroSize,
} from "./hero.types"

const SIZE_CLASSES: Record<LandingHeroSize, string> = {
  compact: "min-h-[55vh] sm:min-h-[60vh]",
  default: "min-h-[70vh] sm:min-h-[75vh]",
  tall: "min-h-[85vh] sm:min-h-[90vh]",
}

const OVERLAY_CLASSES: Record<LandingHeroOverlay, string> = {
  light: "bg-gradient-to-t from-ui-bg-base/70 via-ui-bg-base/40 to-ui-bg-base/10",
  medium: "bg-gradient-to-t from-ui-bg-base/95 via-ui-bg-base/70 to-ui-bg-base/30",
  dark: "bg-gradient-to-t from-black/90 via-black/55 to-black/25",
}

function HeroCtaLink({
  cta,
  variant,
}: {
  cta: LandingHeroCta
  variant: "primary" | "secondary"
}) {
  const className = clx(
    "w-full sm:w-auto min-h-[44px]",
    variant === "primary" && "shadow-elevation-card-rest"
  )

  if (cta.external) {
    return (
      <a
        href={cta.href}
        target="_blank"
        rel="noreferrer"
        className="inline-flex w-full sm:w-auto"
      >
        <Button variant={variant === "primary" ? "primary" : "secondary"} className={className}>
          {cta.label}
        </Button>
      </a>
    )
  }

  return (
    <a href={cta.href} className="inline-flex w-full sm:w-auto">
      <Button variant={variant === "primary" ? "primary" : "secondary"} className={className}>
        {cta.label}
      </Button>
    </a>
  )
}

function contentAlignClasses(align: LandingHeroAlign) {
  return align === "center"
    ? {
        section: "items-center text-center",
        cta: "items-center sm:justify-center",
        vertical: "justify-center",
      }
    : {
        section: "items-start text-left",
        cta: "items-stretch sm:items-center sm:justify-start",
        vertical: "justify-end sm:justify-center",
      }
}

const LandingHero = ({
  eyebrow,
  title,
  subtitle,
  imageSrc,
  imageAlt = "",
  primaryCta,
  secondaryCta,
  align = "left",
  overlay = "medium",
  size = "default",
}: LandingHeroProps) => {
  const hasImage = Boolean(imageSrc)
  const alignClasses = contentAlignClasses(align)
  const heightClass = SIZE_CLASSES[size]

  return (
    <section
      className={clx(
        "relative w-full border-b border-ui-border-base overflow-hidden",
        heightClass
      )}
      aria-label="Hero"
    >
      {hasImage ? (
        <>
          <div
            className="absolute inset-0 bg-ui-bg-subtle bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${imageSrc})` }}
            role="img"
            aria-label={imageAlt}
          />
          <div className={clx("absolute inset-0", OVERLAY_CLASSES[overlay])} aria-hidden />
        </>
      ) : (
        <div className="absolute inset-0 bg-ui-bg-subtle" aria-hidden />
      )}

      <div
        className={clx(
          "content-container relative z-10 flex flex-col py-10 sm:py-16 lg:py-24",
          heightClass,
          alignClasses.vertical
        )}
      >
        <div
          className={clx(
            "flex w-full max-w-3xl flex-col gap-4 sm:gap-6",
            alignClasses.section,
            align === "center" && "mx-auto"
          )}
        >
          {eyebrow ? (
            <p className="text-small-semi uppercase tracking-[0.2em] text-ui-fg-subtle">
              {eyebrow}
            </p>
          ) : null}

          <Heading
            level="h1"
            className="text-2xl sm:text-3xl lg:text-4xl leading-tight text-ui-fg-base font-normal"
          >
            {title}
          </Heading>

          <p className="text-base-regular sm:text-large-regular text-ui-fg-subtle max-w-2xl">
            {subtitle}
          </p>

          <div
            className={clx(
              "flex w-full flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4",
              alignClasses.cta
            )}
          >
            <HeroCtaLink cta={primaryCta} variant="primary" />
            {secondaryCta ? (
              <HeroCtaLink cta={secondaryCta} variant="secondary" />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

export default LandingHero
export type { LandingHeroProps, LandingHeroCta } from "./hero.types"
export { DEFAULT_LANDING_HERO_CONTENT, HERO_CONTENT_PRESETS, HERO_IMAGE_PRESETS } from "./hero-content"
export { buildLandingHeroProps } from "./hero-utils"
