import { withCountryPath } from "@lib/strapi-media"

import type { LandingHeroCta, LandingHeroProps } from "./hero.types"

/** Prefix internal CTA paths with the active storefront country code. */
export function withCountryCodeCta(
  countryCode: string,
  cta: LandingHeroCta
): LandingHeroCta {
  if (cta.external || cta.href.startsWith("http")) {
    return cta
  }

  return {
    ...cta,
    href: withCountryPath(countryCode, cta.href),
  }
}

export function buildLandingHeroProps(
  countryCode: string,
  content: LandingHeroProps
): LandingHeroProps {
  return {
    ...content,
    primaryCta: content.primaryCta
      ? withCountryCodeCta(countryCode, content.primaryCta)
      : undefined,
    secondaryCta: content.secondaryCta
      ? withCountryCodeCta(countryCode, content.secondaryCta)
      : undefined,
  }
}
