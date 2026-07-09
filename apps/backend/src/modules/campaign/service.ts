import {
  InjectManager,
  MedusaContext,
  MedusaService,
} from "@medusajs/framework/utils"
import type { Context } from "@medusajs/framework/types"
import CampaignPost from "./models/campaign-post"
import CampaignTopic from "./models/campaign-topic"

type CampaignPostFilters = {
  id?: string | string[]
  slug?: string | string[]
  topic_id?: string | string[]
  is_active?: boolean
}

class CampaignModuleService extends MedusaService({
  CampaignPost,
  CampaignTopic,
}) {
  /**
   * Returns posts that are currently visible on the storefront:
   * is_active = true
   * AND (publish_at IS NULL OR publish_at <= now)
   * AND (unpublish_at IS NULL OR unpublish_at >= now)
   */
  @InjectManager()
  async listActiveCampaignPosts(
    filters: CampaignPostFilters = {},
    config: Record<string, unknown> = {},
    @MedusaContext() sharedContext: Context = {}
  ) {
    const now = new Date()

    const activeFilters = {
      ...filters,
      is_active: true,
      $and: [
        {
          $or: [{ publish_at: null }, { publish_at: { $lte: now } }],
        },
        {
          $or: [{ unpublish_at: null }, { unpublish_at: { $gte: now } }],
        },
      ],
    }

    return await this.listCampaignPosts(activeFilters, config, sharedContext)
  }

  @InjectManager()
  async listAndCountActiveCampaignPosts(
    filters: CampaignPostFilters = {},
    config: Record<string, unknown> = {},
    @MedusaContext() sharedContext: Context = {}
  ) {
    const now = new Date()

    const activeFilters = {
      ...filters,
      is_active: true,
      $and: [
        {
          $or: [{ publish_at: null }, { publish_at: { $lte: now } }],
        },
        {
          $or: [{ unpublish_at: null }, { unpublish_at: { $gte: now } }],
        },
      ],
    }

    return await this.listAndCountCampaignPosts(
      activeFilters,
      config,
      sharedContext
    )
  }
}

export default CampaignModuleService
