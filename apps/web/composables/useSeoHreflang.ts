export function useSeoHreflang() {
  const switchLocalePath = useSwitchLocalePath()
  const { locales } = useI18n()
  const config = useRuntimeConfig()

  const siteUrl = computed(() => (config.public.siteUrl as string).replace(/\/$/, ''))

  useHead({
    link: computed(() => {
      const links = locales.value.map((loc) => ({
        rel: 'alternate',
        hreflang: loc.code,
        href: `${siteUrl.value}${switchLocalePath(loc.code)}`,
      }))

      links.push({
        rel: 'alternate',
        hreflang: 'x-default',
        href: `${siteUrl.value}${switchLocalePath('vi')}`,
      })

      return links
    }),
  })
}
