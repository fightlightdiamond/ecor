export type CardType = 'link' | 'contact' | 'map' | 'promotions'

export interface CardItem {
  id: string
  type: CardType
  title: Record<string, string> | null
  image: string | null
  path: string | null
  rank: number
  is_active: boolean
  locked: boolean
}

/**
 * Homepage pillar/card list — managed in Medusa admin (Cards). Order and
 * active/inactive state come straight from the backend; type="link" cards
 * are freely editable, the other 3 types back fixed storefront widgets.
 */
export function useCards() {
  const { fetchMedusa } = useMedusaApi()

  const { data, pending } = useAsyncData(
    'storefront-cards',
    () => fetchMedusa<{ cards: CardItem[] }>('/store/cards'),
    { default: () => ({ cards: [] as CardItem[] }) },
  )

  const cards = computed<CardItem[]>(() => data.value?.cards ?? [])

  return { cards, pending }
}
