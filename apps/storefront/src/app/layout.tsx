import { getBaseURL } from "@lib/util/env"
import { fontDisplay, fontSans } from "@lib/fonts"
import { STOREFRONT_THEME } from "@lib/theme"
import { Metadata } from "next"
import { clx } from "@modules/common/components/ui"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import "styles/globals.css"
import "styles/theme.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const isDark = STOREFRONT_THEME.appearance === "dark"
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      data-mode={STOREFRONT_THEME.appearance}
      data-accent={STOREFRONT_THEME.accentScale}
      className={clx(
        fontSans.variable,
        fontDisplay.variable,
        isDark && "dark"
      )}
    >
      <body className={clx(fontSans.className, "bg-store-atmosphere text-ui-fg-base antialiased")}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <main className="relative">{props.children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
