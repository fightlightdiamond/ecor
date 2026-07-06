import type { BlogPost } from '~/utils/storefront'
import { FALLBACK_POST_IMAGE } from '~/utils/storefront'
import { tiptapFirstImage, tiptapToHtml, tiptapToText } from '~/utils/tiptap'
import fallbackPosts from '~/content/blog.json'

export type { BlogPost } from '~/utils/storefront'

interface CampaignPost {
  id: string
  title: string
  slug: string
  content: unknown
  publish_at: string | null
  created_at?: string
}

function transformCampaignPost(p: CampaignPost): BlogPost {
  const content = tiptapToHtml(p.content)
  const plain = tiptapToText(p.content)
  return {
    slug: p.slug,
    title: p.title,
    excerpt: plain.slice(0, 200) + (plain.length > 200 ? '…' : ''),
    content,
    image: tiptapFirstImage(p.content) || FALLBACK_POST_IMAGE,
    date: p.publish_at || p.created_at || '',
    author: 'Thăng Long Chè Việt',
  }
}

/**
 * Blog posts come from the Medusa backend's campaign-posts module
 * (GET /store/campaign-posts, content authored with TipTap in the admin).
 * Falls back to the bundled ~/content/blog.json when the API is unreachable
 * or has no published posts yet.
 */
export function useBlog() {
  const { fetchMedusa } = useMedusaApi()
  const { locale } = useI18n()

  const localFallback = computed<BlogPost[]>(() =>
    (fallbackPosts as any[]).map(p => ({
      slug: p.slug,
      title: p.title?.[locale.value] ?? p.title?.vi ?? '',
      excerpt: p.excerpt?.[locale.value] ?? p.excerpt?.vi ?? '',
      content: '',
      image: FALLBACK_POST_IMAGE,
      date: p.date ?? '',
      author: 'Thăng Long Chè Việt',
    })),
  )

  const { data: postsData, pending } = useAsyncData(
    'campaign-posts',
    async () => {
      try {
        const res = await fetchMedusa<{ campaign_posts: CampaignPost[] }>(
          '/store/campaign-posts?limit=50',
        )
        return res.campaign_posts ?? []
      } catch (e) {
        console.warn('Campaign posts API unavailable, using local fallback', e)
        return [] as CampaignPost[]
      }
    },
    { default: () => [] as CampaignPost[] },
  )

  const posts = computed<BlogPost[]>(() => {
    const fromApi = (postsData.value ?? []).map(transformCampaignPost)
    return fromApi.length ? fromApi : localFallback.value
  })

  const latestPosts = computed<BlogPost[]>(() => posts.value.slice(0, 4))

  const getBySlug = async (slug: string): Promise<BlogPost | null> => {
    const found = posts.value.find(p => p.slug === slug)
    if (found) return found

    try {
      const res = await fetchMedusa<{ campaign_post: CampaignPost }>(
        `/store/campaign-posts/${encodeURIComponent(slug)}`,
      )
      if (res.campaign_post) return transformCampaignPost(res.campaign_post)
    } catch (e) {
      console.error(e)
    }
    return null
  }

  return { posts, latestPosts, pending, getBySlug }
}
