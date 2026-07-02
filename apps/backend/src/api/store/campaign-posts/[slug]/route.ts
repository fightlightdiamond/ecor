import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { CAMPAIGN_MODULE } from "../../../../modules/campaign"
import type CampaignModuleService from "../../../../modules/campaign/service"

/**
 * GET /store/campaign-posts/:slug
 *
 * Returns a single active campaign post by slug.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { slug } = req.params

  const campaignModuleService: CampaignModuleService =
    req.scope.resolve(CAMPAIGN_MODULE)

  const posts = await campaignModuleService.listActiveCampaignPosts(
    { slug },
    { take: 1 }
  )

  if (!posts.length) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Campaign post with slug "${slug}" was not found`
    )
  }

  res.json({ campaign_post: posts[0] })
}
