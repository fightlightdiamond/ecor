import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { CAMPAIGN_MODULE } from "../../../../modules/campaign"
import type CampaignModuleService from "../../../../modules/campaign/service"

/**
 * GET /store/campaign-topics/:slug
 *
 * Returns a single active topic by slug.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { slug } = req.params

  const campaignModuleService: CampaignModuleService =
    req.scope.resolve(CAMPAIGN_MODULE)

  const topics = await campaignModuleService.listCampaignTopics(
    { slug, is_active: true },
    { take: 1 }
  )

  if (!topics.length) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Campaign topic with slug "${slug}" was not found`
    )
  }

  res.json({ campaign_topic: topics[0] })
}
