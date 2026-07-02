import { getRequestConfig } from "next-intl/server"
import { cookies } from "next/headers"

const LOCALE_COOKIE_NAME = "_medusa_locale"
const SUPPORTED_LOCALES = ["en", "vi"]
const DEFAULT_LOCALE = "en"

function normalizeLocale(raw: string | null | undefined): string {
  if (!raw) return DEFAULT_LOCALE
  // Handle full locale codes like "vi-VN", "en-US"
  const base = raw.split(/[-_]/)[0].toLowerCase()
  return SUPPORTED_LOCALES.includes(base) ? base : DEFAULT_LOCALE
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const rawLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value
  const locale = normalizeLocale(rawLocale)

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
