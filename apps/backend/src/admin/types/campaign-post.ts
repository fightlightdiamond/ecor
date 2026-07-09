import type { JSONContent } from "@tiptap/core"

export type CampaignPostContent = JSONContent

export type CampaignPost = {
  id: string
  title: string
  slug: string
  content: CampaignPostContent
  thumbnail: string | null
  topic_id: string | null
  is_active: boolean
  publish_at: string | null
  unpublish_at: string | null
  created_at?: string
}

export type CampaignPostsResponse = {
  campaign_posts: CampaignPost[]
  count: number
  limit: number
  offset: number
}

export type CampaignPostResponse = {
  campaign_post: CampaignPost
}

export type CampaignPostFormValues = {
  title: string
  slug: string
  thumbnail: string | null
  topic_id: string | null
  is_active: boolean
  publish_at: string | null
  unpublish_at: string | null
  content: CampaignPostContent
}
