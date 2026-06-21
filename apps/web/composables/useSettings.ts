import settingsData from '~/content/settings.json'

export function useSettings() {
  const { locale } = useI18n()

  const settings = computed(() => settingsData)

  const localizedText = (field: Record<string, string> | undefined) => {
    if (!field) return ''
    return field[locale.value] ?? field['vi'] ?? ''
  }

  const salon = computed(() => ({
    name: localizedText(settingsData.salon.name),
    tagline: localizedText(settingsData.salon.tagline),
    description: localizedText(settingsData.salon.description),
  }))

  const contact = computed(() => settingsData.contact)

  const hours = computed(() =>
    settingsData.hours.map(h => ({
      days: localizedText(h.days),
      time: h.time,
    })),
  )

  const social = computed(() => settingsData.social)

  const heroSlides = computed(() =>
    settingsData.hero.slides.map(slide => ({
      ...slide,
      imageAlt: localizedText(slide.imageAlt),
      heading: localizedText(slide.heading),
      subheading: localizedText(slide.subheading),
    })),
  )

  const heroMeta = computed(() => ({
    eyebrow: localizedText(settingsData.hero.eyebrow),
    commitment: localizedText(settingsData.hero.commitment),
  }))

  const skills = computed(() =>
    settingsData.skills.map(s => ({
      ...s,
      label: localizedText(s.label),
    })),
  )

  const discoverServices = computed(() =>
    settingsData.discoverServices.map(s => ({
      ...s,
      label: localizedText(s.label),
    })),
  )

  const promo = computed(() => ({
    ...settingsData.promo,
    badge: localizedText(settingsData.promo.badge),
    heading: localizedText(settingsData.promo.heading),
    subheading: localizedText(settingsData.promo.subheading),
  }))

  return { settings, salon, contact, hours, social, heroSlides, heroMeta, skills, discoverServices, promo }
}
