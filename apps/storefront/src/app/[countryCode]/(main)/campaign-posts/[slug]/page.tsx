import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCampaignPostBySlug } from "@lib/data/campaign-posts"
import CampaignPostDetailTemplate from "@modules/campaign/templates/campaign-post-detail"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params
  const post = await getCampaignPostBySlug(slug)

  if (!post) {
    return { title: "Article not found" }
  }

  return {
    title: post.title,
    description: post.title,
  }
}

export default async function CampaignPostPage(props: Props) {
  const { slug } = await props.params
  const post = await getCampaignPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return <CampaignPostDetailTemplate post={post} />
}
