import type { AccentScale, StorefrontThemeConfig } from "./types"

/**
 * Storefront theme — change `accentScale` here to rebrand the entire site.
 * Supported values: jade | teal | sage | grass | olive | bronze
 */
export const STOREFRONT_THEME: StorefrontThemeConfig = {
  accentScale: "jade",
  appearance: "light",
}

export const ACCENT_SCALES: { value: AccentScale; label: string }[] = [
  { value: "jade", label: "Jade (trà xanh)" },
  { value: "teal", label: "Teal" },
  { value: "sage", label: "Sage" },
  { value: "grass", label: "Grass" },
  { value: "olive", label: "Olive" },
  { value: "bronze", label: "Bronze" },
]
