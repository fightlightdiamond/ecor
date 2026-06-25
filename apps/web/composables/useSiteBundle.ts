import type { ApiEnvelope } from '~/utils/storefront'
import fallbackSettings from '~/content/settings.json'
import fallbackTeam from '~/content/team.json'
import fallbackServices from '~/content/services.json'
import fallbackGallery from '~/content/gallery.json'
import fallbackTestimonials from '~/content/testimonials.json'

export interface SiteBundle {
  settings: typeof fallbackSettings
  team: typeof fallbackTeam
  services: typeof fallbackServices
  gallery: typeof fallbackGallery
  testimonials: typeof fallbackTestimonials
}

const localFallback: SiteBundle = {
  settings: fallbackSettings,
  team: fallbackTeam,
  services: fallbackServices,
  gallery: fallbackGallery,
  testimonials: fallbackTestimonials,
}

export function useSiteBundle() {
  const { fetchApi } = useApi()

  const { data } = useAsyncData<SiteBundle>(
    'site-bundle',
    async () => {
      try {
        const res = await fetchApi<ApiEnvelope<SiteBundle>>('/site')
        if (res.success && res.data?.settings) {
          return res.data
        }
      } catch (e) {
        console.warn('Site bundle API unavailable, using local fallback', e)
      }
      return localFallback
    },
    { default: () => localFallback },
  )

  const bundle = computed(() => data.value ?? localFallback)

  return {
    bundle,
    settings: computed(() => bundle.value.settings),
    team: computed(() => bundle.value.team),
    services: computed(() => bundle.value.services),
    gallery: computed(() => bundle.value.gallery),
    testimonials: computed(() => bundle.value.testimonials),
  }
}
