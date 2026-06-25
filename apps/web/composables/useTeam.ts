import { localText } from '~/utils/storefront'

export function useTeam() {
  const { locale } = useI18n()
  const { team: teamData } = useSiteBundle()

  const localizeMember = (m: (typeof teamData.value)[number]) => ({
    ...m,
    name: localText(m.name, locale.value),
    role: localText(m.role, locale.value),
    bio: localText(m.bio, locale.value),
    specialties: m.specialties.map(s => localText(s, locale.value)),
  })

  const team = computed(() => teamData.value.map(localizeMember))

  const featuredTeam = computed(() =>
    teamData.value.filter(m => m.featured).map(localizeMember),
  )

  return { team, featuredTeam, teamData }
}
