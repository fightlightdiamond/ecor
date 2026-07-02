"use server"

import { sdk } from "@lib/config"

export type CampaignPostContent = {
  blocks?: Array<{
    id?: string
    type: string
    data: Record<string, unknown>
  }>
}

export type CampaignPost = {
  id: string
  title: string
  slug: string
  content: CampaignPostContent
  is_active: boolean
  publish_at: string | null
  unpublish_at: string | null
  created_at: string
  updated_at: string
}

type CampaignPostsResponse = {
  campaign_posts: CampaignPost[]
  count: number
  limit: number
  offset: number
}

type CampaignPostResponse = {
  campaign_post: CampaignPost
}

export const listCampaignPosts = async ({
  limit = 20,
  offset = 0,
}: {
  limit?: number
  offset?: number
} = {}): Promise<CampaignPostsResponse> => {
  return sdk.client.fetch<CampaignPostsResponse>("/store/campaign-posts", {
    query: { limit, offset },
    next: { revalidate: 60 },
  })
}

export const getCampaignPostBySlug = async (
  slug: string
): Promise<CampaignPost | null> => {
  try {
    const { campaign_post } = await sdk.client.fetch<CampaignPostResponse>(
      `/store/campaign-posts/${slug}`,
      { next: { revalidate: 60 } }
    )

    return campaign_post
  } catch {
    return null
  }
}
