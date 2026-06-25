import { localText } from '~/utils/storefront'

export function useGallery() {
  const { locale } = useI18n()
  const { gallery: galleryData } = useSiteBundle()

  const items = computed(() =>
    galleryData.value.map(item => ({
      ...item,
      label: localText(item.label, locale.value),
    })),
  )

  const imageUrls = computed(() => galleryData.value.map(item => item.src))

  return { items, imageUrls, galleryData }
}
