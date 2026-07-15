import { Be_Vietnam_Pro, Literata } from "next/font/google"

/** Body UI — strong Vietnamese glyph support */
export const fontSans = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "600"],
  variable: "--font-sans",
  display: "swap",
})

/** Display / brand / section titles — literary, tea-heritage feel */
export const fontDisplay = Literata({
  subsets: ["vietnamese", "latin"],
  weight: ["500", "600"],
  variable: "--font-display",
  display: "swap",
})
