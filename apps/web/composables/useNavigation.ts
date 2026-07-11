export interface NavigationTreeItem {
  id: string
  name: string
  url: string
  index: number
  parent_id?: string | null
  children: NavigationTreeItem[]
}

export interface NavLink {
  key: string
  path: string
  label?: string
  children?: { key: string; path: string; label?: string }[]
}

export function useNavigation() {
  const config = useRuntimeConfig()
  const { fetchMedusa } = useMedusaApi()

  const navigationId = config.public.medusaNavigationId

  const getStoreNavigation = async (): Promise<NavigationTreeItem[]> => {
    if (!navigationId) {
      return []
    }

    try {
      const tree = await fetchMedusa<NavigationTreeItem[]>(`/store/navigation/${navigationId}`, {
        method: 'GET',
      })
      return Array.isArray(tree) ? tree : []
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[navigation] Failed to load menu from Medusa:', error)
      }
      return []
    }
  }

  const mapNavigationToNavLinks = (items: NavigationTreeItem[]): NavLink[] => {
    return [...items]
      .sort((a, b) => a.index - b.index)
      .map((item) => {
        const link: NavLink = {
          key: item.id,
          path: item.url,
          label: item.name,
        }

        if (item.children && item.children.length > 0) {
          link.children = [...item.children]
            .sort((a, b) => a.index - b.index)
            .map((child) => ({
              key: child.id,
              path: child.url,
              label: child.name,
            }))
        }

        return link
      })
  }

  return {
    getStoreNavigation,
    mapNavigationToNavLinks,
    navigationId,
  }
}
