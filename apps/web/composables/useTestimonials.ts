import { localText } from '~/utils/storefront'

export function useTestimonials() {
  const { locale } = useI18n()
  const { testimonials: testimonialsData } = useSiteBundle()

  const testimonials = computed(() =>
    testimonialsData.value.map(item => ({
      id: item.id,
      quote: localText(item.quote, locale.value),
      author: localText(item.author, locale.value),
      role: localText(item.role, locale.value),
    })),
  )

  return { testimonials, testimonialsData }
}
