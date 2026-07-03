import type { LandingHeroCta, LandingHeroProps } from "./hero.types"

/** Prefix internal CTA paths with the active storefront country code. */
export function withCountryCodeCta(
  countryCode: string,
  cta: LandingHeroCta
): LandingHeroCta {
  if (cta.external || cta.href.startsWith("http")) {
    return cta
  }

  const path = cta.href.startsWith("/") ? cta.href : `/${cta.href}`

  return {
    ...cta,
    href: `/${countryCode}${path}`,
  }
}

export function buildLandingHeroProps(
  countryCode: string,
  content: LandingHeroProps
): LandingHeroProps {
  return {
    ...content,
    primaryCta: withCountryCodeCta(countryCode, content.primaryCta),
    secondaryCta: content.secondaryCta
      ? withCountryCodeCta(countryCode, content.secondaryCta)
      : undefined,
  }
}
