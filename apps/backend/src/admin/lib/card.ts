export function cardTitle(card: { title: Record<string, string> | null, type: string }, t: (key: string) => string) {
  if (card.title?.vi) return card.title.vi
  if (card.title?.en) return card.title.en
  return t(`cards.type.${card.type}`)
}
