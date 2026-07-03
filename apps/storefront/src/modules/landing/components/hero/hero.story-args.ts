import type {
  LandingHeroAlign,
  LandingHeroOverlay,
  LandingHeroProps,
  LandingHeroSize,
} from "./hero.types"
import {
  DEFAULT_LANDING_HERO_CONTENT,
  HERO_CONTENT_PRESETS,
  HERO_IMAGE_PRESETS,
  type HeroContentPresetKey,
  type HeroImagePresetKey,
} from "./hero-content"

/**
 * Flat args for Storybook Controls — easier than editing nested `primaryCta` objects.
 * Mapped to `LandingHeroProps` via `storyArgsToHeroProps`.
 */
export type LandingHeroStoryArgs = {
  /** Switch entire copy + layout preset */
  contentPreset: HeroContentPresetKey | "custom"
  eyebrow: string
  showEyebrow: boolean
  title: string
  subtitle: string
  showBackgroundImage: boolean
  imagePreset: HeroImagePresetKey | "custom"
  imageSrc: string
  imageAlt: string
  overlay: LandingHeroOverlay
  showSecondaryCta: boolean
  primaryCtaLabel: string
  primaryCtaHref: string
  primaryCtaExternal: boolean
  secondaryCtaLabel: string
  secondaryCtaHref: string
  secondaryCtaExternal: boolean
  align: LandingHeroAlign
  size: LandingHeroSize
}

export function heroPropsToStoryArgs(
  props: LandingHeroProps
): LandingHeroStoryArgs {
  const matchedImagePreset = (
    Object.entries(HERO_IMAGE_PRESETS) as [
      HeroImagePresetKey,
      (typeof HERO_IMAGE_PRESETS)[HeroImagePresetKey],
    ][]
  ).find(([, preset]) => preset.src === props.imageSrc)

  return {
    contentPreset: "custom",
    eyebrow: props.eyebrow ?? "",
    showEyebrow: Boolean(props.eyebrow),
    title: props.title,
    subtitle: props.subtitle,
    showBackgroundImage: Boolean(props.imageSrc),
    imagePreset: matchedImagePreset?.[0] ?? "custom",
    imageSrc: props.imageSrc ?? "",
    imageAlt: props.imageAlt ?? "",
    overlay: props.overlay ?? "medium",
    showSecondaryCta: Boolean(props.secondaryCta),
    primaryCtaLabel: props.primaryCta.label,
    primaryCtaHref: props.primaryCta.href,
    primaryCtaExternal: Boolean(props.primaryCta.external),
    secondaryCtaLabel: props.secondaryCta?.label ?? "",
    secondaryCtaHref: props.secondaryCta?.href ?? "",
    secondaryCtaExternal: Boolean(props.secondaryCta?.external),
    align: props.align ?? "left",
    size: props.size ?? "default",
  }
}

export function storyArgsToHeroProps(
  args: Partial<LandingHeroStoryArgs>
): LandingHeroProps {
  const resolved: LandingHeroStoryArgs = {
    ...DEFAULT_HERO_STORY_ARGS,
    ...args,
  }

  const contentPreset = resolved.contentPreset ?? "custom"

  if (
    contentPreset !== "custom" &&
    contentPreset in HERO_CONTENT_PRESETS
  ) {
    const preset = HERO_CONTENT_PRESETS[contentPreset as HeroContentPresetKey].content

    const imagePreset =
      resolved.imagePreset in HERO_IMAGE_PRESETS
        ? (resolved.imagePreset as HeroImagePresetKey)
        : "custom"

    return {
      ...preset,
      align: resolved.align,
      overlay: resolved.overlay,
      size: resolved.size,
      eyebrow: resolved.showEyebrow ? preset.eyebrow : undefined,
      secondaryCta: resolved.showSecondaryCta ? preset.secondaryCta : undefined,
      imageSrc: resolved.showBackgroundImage
        ? imagePreset !== "custom"
          ? HERO_IMAGE_PRESETS[imagePreset].src
          : resolved.imageSrc || preset.imageSrc
        : undefined,
      imageAlt:
        imagePreset !== "custom"
          ? HERO_IMAGE_PRESETS[imagePreset].alt
          : resolved.imageAlt || preset.imageAlt,
    }
  }

  const imagePreset =
    resolved.imagePreset in HERO_IMAGE_PRESETS
      ? (resolved.imagePreset as HeroImagePresetKey)
      : "custom"

  return {
    eyebrow: resolved.showEyebrow ? resolved.eyebrow : undefined,
    title: resolved.title,
    subtitle: resolved.subtitle,
    imageSrc: resolved.showBackgroundImage
      ? imagePreset !== "custom"
        ? HERO_IMAGE_PRESETS[imagePreset].src
        : resolved.imageSrc
      : undefined,
    imageAlt:
      imagePreset !== "custom"
        ? HERO_IMAGE_PRESETS[imagePreset].alt
        : resolved.imageAlt,
    primaryCta: {
      label: resolved.primaryCtaLabel,
      href: resolved.primaryCtaHref,
      external: resolved.primaryCtaExternal || undefined,
    },
    secondaryCta: resolved.showSecondaryCta
      ? {
          label: resolved.secondaryCtaLabel,
          href: resolved.secondaryCtaHref,
          external: resolved.secondaryCtaExternal || undefined,
        }
      : undefined,
    align: resolved.align,
    overlay: resolved.overlay,
    size: resolved.size,
  }
}

export const DEFAULT_HERO_STORY_ARGS: LandingHeroStoryArgs =
  heroPropsToStoryArgs(DEFAULT_LANDING_HERO_CONTENT)

export const HERO_CONTENT_PRESET_OPTIONS = Object.entries(HERO_CONTENT_PRESETS).map(
  ([value, preset]) => ({
    value,
    title: preset.label,
  })
)

export const HERO_IMAGE_PRESET_OPTIONS = Object.entries(HERO_IMAGE_PRESETS).map(
  ([value, preset]) => ({
    value,
    title: preset.label,
  })
)

export const HERO_CONTENT_PRESET_LABELS: Record<
  HeroContentPresetKey | "custom",
  string
> = {
  custom: "Tùy chỉnh",
  ...Object.fromEntries(
    HERO_CONTENT_PRESET_OPTIONS.map((o) => [o.value, o.title])
  ),
}

export const HERO_IMAGE_PRESET_LABELS: Record<
  HeroImagePresetKey | "custom",
  string
> = {
  custom: "URL tùy chỉnh",
  ...Object.fromEntries(
    HERO_IMAGE_PRESET_OPTIONS.map((o) => [o.value, o.title])
  ),
}
