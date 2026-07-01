import { Metadata } from "next"

import { listCampaignPosts } from "@lib/data/campaign-posts"
import CampaignPostsListTemplate from "@modules/campaign/templates/campaign-posts-list"

export const metadata: Metadata = {
  title: "Articles",
  description: "Read our latest articles and updates.",
}

export default async function CampaignPostsPage() {
  const { campaign_posts, count } = await listCampaignPosts()

  return <CampaignPostsListTemplate posts={campaign_posts} count={count} />
}
