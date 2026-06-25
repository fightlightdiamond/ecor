import type { ApiEnvelope, BlogPost, RawPost } from '~/utils/storefront'
import { transformPost } from '~/utils/storefront'

export type { BlogPost } from '~/utils/storefront'

async function fetchAllPosts(fetchApi: ReturnType<typeof useApi>['fetchApi']) {
  const first = await fetchApi<ApiEnvelope<RawPost[]>>('/posts?per_page=50')
  const all = [...(first.data ?? [])]
  const lastPage = first.meta?.last_page ?? 1

  if (lastPage > 1) {
    const pages = await Promise.all(
      Array.from({ length: lastPage - 1 }, (_, i) =>
        fetchApi<ApiEnvelope<RawPost[]>>(`/posts?per_page=50&page=${i + 2}`),
      ),
    )
    for (const page of pages) {
      all.push(...(page.data ?? []))
    }
  }

  return { success: true, data: all, meta: first.meta }
}

export function useBlog() {
  const { fetchApi } = useApi()
  const { locale } = useI18n()

  const { data: postsData, pending } = useAsyncData(
    () => `posts-${locale.value}`,
    () => fetchAllPosts(fetchApi),
    { default: () => ({ success: true, data: [] as RawPost[] }) },
  )

  const posts = computed<BlogPost[]>(() => {
    const raw = postsData.value?.data ?? []
    return (Array.isArray(raw) ? raw : []).map(p => transformPost(p, locale.value))
  })

  const { data: latestData } = useAsyncData(
    () => `latest-posts-${locale.value}`,
    () => fetchApi<ApiEnvelope<RawPost[]>>('/posts/latest'),
    { default: () => ({ success: true, data: [] as RawPost[] }) },
  )

  const latestPosts = computed<BlogPost[]>(() => {
    const raw = latestData.value?.data ?? []
    return (Array.isArray(raw) ? raw : []).map(p => transformPost(p, locale.value))
  })

  const getBySlug = async (slug: string) => {
    const found = posts.value.find(p => p.slug === slug)
    if (found) return found

    try {
      const res = await fetchApi<ApiEnvelope<RawPost>>(`/posts/${slug}`)
      if (res.success && res.data) {
        return transformPost(res.data, locale.value)
      }
    } catch (e) {
      console.error(e)
    }
    return null
  }

  return { posts, latestPosts, pending, getBySlug }
}
