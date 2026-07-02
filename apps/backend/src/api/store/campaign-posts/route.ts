import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CAMPAIGN_MODULE } from "../../../modules/campaign"
import type CampaignModuleService from "../../../modules/campaign/service"

/**
 * GET /store/campaign-posts
 *
 * Returns campaign posts that pass the auto-publish visibility filter:
 * is_active=true AND publish_at<=now AND (unpublish_at IS NULL OR unpublish_at>=now)
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const campaignModuleService: CampaignModuleService =
    req.scope.resolve(CAMPAIGN_MODULE)

  const limit = Math.min(Number(req.query.limit) || 20, 100)
  const offset = Number(req.query.offset) || 0

  const [posts, count] =
    await campaignModuleService.listAndCountActiveCampaignPosts(
      {},
      {
        take: limit,
        skip: offset,
        order: { publish_at: "DESC" },
      }
    )

  res.json({
    campaign_posts: posts,
    count,
    limit,
    offset,
  })
}
