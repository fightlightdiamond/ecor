/** Radix accent scales available on the storefront theme. */
export type AccentScale =
  | "jade"
  | "teal"
  | "sage"
  | "grass"
  | "olive"
  | "bronze"

export type ThemeAppearance = "light" | "dark"

export type StorefrontThemeConfig = {
  /** Brand accent — maps to Radix Colors scale (step 9 = solid, 11 = text). */
  accentScale: AccentScale
  appearance: ThemeAppearance
}
