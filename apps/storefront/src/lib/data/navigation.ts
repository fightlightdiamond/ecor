import { sdk } from "@lib/config"

export type NavigationTreeItem = {
  id: string
  name: string
  url: string
  index: number
  parent_id?: string | null
  children: NavigationTreeItem[]
}

/** Flatten menu for mobile / simple nav (top-level + one child level). */
export function flattenNavigationItems(
  items: NavigationTreeItem[],
): { label: string; href: string }[] {
  const flat: { label: string; href: string }[] = []

  for (const item of [...items].sort((a, b) => a.index - b.index)) {
    flat.push({ label: item.name, href: item.url })
    for (const child of [...(item.children ?? [])].sort(
      (a, b) => a.index - b.index,
    )) {
      flat.push({ label: child.name, href: child.url })
    }
  }

  return flat
}

export async function getStoreNavigation(): Promise<NavigationTreeItem[]> {
  const navigationId = process.env.NEXT_PUBLIC_MEDUSA_NAVIGATION_ID

  if (!navigationId) {
    return []
  }

  try {
    const tree = await sdk.client.fetch<NavigationTreeItem[]>(
      `/store/navigation/${navigationId}`,
      { method: "GET", cache: "no-store" },
    )
    return Array.isArray(tree) ? tree : []
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[navigation] Failed to load menu from Medusa:", error)
    }
    return []
  }
}
