import type { Ref } from 'vue'

type NuxtI18n = {
  locale: Ref<string>
  t: (key: string, ...args: unknown[]) => string
  locales?: Ref<Array<{ code: string }>>
}

/** i18n accessor safe in setup, plugins, and middleware (not only `useI18n()`). */
export function useAppI18n() {
  const nuxtApp = useNuxtApp()
  const i18n = nuxtApp.$i18n as NuxtI18n | undefined

  const locale = i18n?.locale ?? ref('vi')
  const t = i18n?.t?.bind(i18n) ?? ((key: string) => key)
  const locales = i18n?.locales ?? ref([])

  return { locale, t, locales }
}
