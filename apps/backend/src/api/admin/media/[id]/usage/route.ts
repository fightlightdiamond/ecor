import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CARD_MODULE } from "../../../../../modules/card"
import type CardModuleService from "../../../../../modules/card/service"
import { CAMPAIGN_MODULE } from "../../../../../modules/campaign"
import type CampaignModuleService from "../../../../../modules/campaign/service"

type UsageEntry = {
  kind: "card" | "campaign_post"
  id: string
  label: string
}

/**
 * GET /admin/media/:id/usage
 *
 * Lists everything that currently references this image, so the admin UI can
 * warn before deletion. Matches both the exact stored URL and its /static/
 * basename (host-independent: dev/prod record the same file under different
 * origins).
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const cardModuleService: CardModuleService = req.scope.resolve(CARD_MODULE)
  const campaignModuleService: CampaignModuleService = req.scope.resolve(CAMPAIGN_MODULE)

  const media = await cardModuleService.retrieveCardMedia(req.params.id)

  const url = media.url
  const basename = url.split("/static/")[1] ?? null
  const matches = (value: string | null | undefined) => {
    if (!value) return false
    if (value === url) return true
    return basename ? value.includes(basename) : false
  }

  const usage: UsageEntry[] = []

  const cards = await cardModuleService.listCards({})
  for (const card of cards) {
    if (matches(card.image)) {
      const title = card.title as { vi?: string, en?: string } | null
      usage.push({
        kind: "card",
        id: card.id,
        label: title?.vi || title?.en || card.type,
      })
    }
  }

  const posts = await campaignModuleService.listCampaignPosts({})
  for (const post of posts) {
    const contentStr = post.content ? JSON.stringify(post.content) : ""
    if (contentStr.includes(url) || (basename && contentStr.includes(basename))) {
      usage.push({ kind: "campaign_post", id: post.id, label: post.title })
    }
  }

  res.json({ usage, count: usage.length })
}
