import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CAMPAIGN_MODULE } from "../../../modules/campaign"
import type CampaignModuleService from "../../../modules/campaign/service"

/**
 * GET /store/campaign-topics
 *
 * Returns active topics ordered by rank then name, each with the number of
 * currently visible posts.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const campaignModuleService: CampaignModuleService =
    req.scope.resolve(CAMPAIGN_MODULE)

  const topics = await campaignModuleService.listCampaignTopics(
    { is_active: true },
    { order: { rank: "ASC", name: "ASC" } }
  )

  const activePosts = await campaignModuleService.listActiveCampaignPosts(
    {},
    { select: ["id", "topic_id"] }
  )

  const countByTopic = new Map<string, number>()
  for (const post of activePosts) {
    if (post.topic_id) {
      countByTopic.set(post.topic_id, (countByTopic.get(post.topic_id) ?? 0) + 1)
    }
  }

  res.json({
    campaign_topics: topics.map((topic) => ({
      ...topic,
      post_count: countByTopic.get(topic.id) ?? 0,
    })),
  })
}
