export type LandingHeroCta = {
  label: string
  /** Path or full URL. Internal paths omit country code — page adds it. */
  href: string
  external?: boolean
}

export type LandingHeroAlign = "left" | "center"

export type LandingHeroOverlay = "light" | "medium" | "dark"

export type LandingHeroSize = "compact" | "default" | "tall"

export type LandingHeroProps = {
  eyebrow?: string
  title: string
  subtitle: string
  imageSrc?: string
  imageAlt?: string
  primaryCta: LandingHeroCta
  secondaryCta?: LandingHeroCta
  /** Text and CTA alignment. Default: left */
  align?: LandingHeroAlign
  /** Background overlay when `imageSrc` is set. Default: medium */
  overlay?: LandingHeroOverlay
  /** Vertical height of the hero block. Default: default */
  size?: LandingHeroSize
}
