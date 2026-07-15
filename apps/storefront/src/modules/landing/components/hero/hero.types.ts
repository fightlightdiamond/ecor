export type LandingHeroCta = {
  label: string
  /** Path or full URL. Internal paths omit country code — page adds it. */
  href: string
  external?: boolean
  variant?: "primary" | "outline"
}

export type LandingHeroAlign = "left" | "center" | "right"

export type LandingHeroOverlay = "light" | "medium" | "dark"

export type LandingHeroSize = "compact" | "default" | "tall"

export type LandingHeroProps = {
  /** Large brand lockup above the marketing headline */
  brandName?: string
  eyebrow?: string
  title: string
  subtitle: string
  imageSrc?: string
  videoSrc?: string
  imageAlt?: string
  primaryCta?: LandingHeroCta
  secondaryCta?: LandingHeroCta
  /** Text and CTA alignment. Default: left */
  align?: LandingHeroAlign
  /** Background overlay when media is set. Default: dark */
  overlay?: LandingHeroOverlay
  /** Vertical height of the hero block. Default: tall */
  size?: LandingHeroSize
}
