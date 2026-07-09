import type { ExecArgs } from "@medusajs/framework/types"
import { CARD_MODULE } from "../modules/card"
import type CardModuleService from "../modules/card/service"
import { CAMPAIGN_MODULE } from "../modules/campaign"
import type CampaignModuleService from "../modules/campaign/service"
import { normalizeTiptapImageUrls, toRelativeMediaUrl } from "../api/utils/media-url"

/**
 * One-off, idempotent fix for image URLs that got saved as absolute
 * (e.g. "http://localhost:8080/static/xxx.jpg") back when MEDUSA_BACKEND_URL
 * pointed at a dev/local domain. Rewrites every stored reference to the
 * host-independent "/static/..." form, matching what new writes save after
 * the toRelativeMediaUrl() normalization was added to the write routes.
 * Safe to re-run: rows that are already relative (or genuinely external,
 * e.g. a pasted Unsplash URL) are left untouched and simply skipped.
 *
 * Run with: npx medusa exec ./src/scripts/fix-media-urls.ts
 */
export default async function fixMediaUrls({ container }: ExecArgs) {
  const cardModuleService: CardModuleService = container.resolve(CARD_MODULE)
  const campaignModuleService: CampaignModuleService =
    container.resolve(CAMPAIGN_MODULE)

  // --- cards -----------------------------------------------------------------
  const cards = await cardModuleService.listCards({})
  const cardUpdates = cards
    .map((card) => ({ id: card.id, image: toRelativeMediaUrl(card.image) }))
    .filter((update, i) => update.image !== cards[i].image)

  if (cardUpdates.length) {
    await cardModuleService.updateCards(cardUpdates)
  }
  console.log(`cards: fixed ${cardUpdates.length}/${cards.length}`)

  // --- media library -----------------------------------------------------
  const medias = await cardModuleService.listCardMedias({})
  const mediaUpdates = medias
    .map((media) => ({ id: media.id, url: toRelativeMediaUrl(media.url)! }))
    .filter((update, i) => update.url !== medias[i].url)

  if (mediaUpdates.length) {
    await cardModuleService.updateCardMedias(mediaUpdates)
  }
  console.log(`card_media: fixed ${mediaUpdates.length}/${medias.length}`)

  // --- campaign topics -----------------------------------------------------
  const topics = await campaignModuleService.listCampaignTopics({})
  const topicUpdates = topics
    .map((topic) => ({ id: topic.id, image: toRelativeMediaUrl(topic.image) }))
    .filter((update, i) => update.image !== topics[i].image)

  if (topicUpdates.length) {
    await campaignModuleService.updateCampaignTopics(topicUpdates)
  }
  console.log(`campaign_topic: fixed ${topicUpdates.length}/${topics.length}`)

  // --- campaign posts (thumbnail + embedded TipTap images) -----------------
  const posts = await campaignModuleService.listCampaignPosts({})
  const postUpdates: {
    id: string
    thumbnail?: string | null
    content?: Record<string, unknown>
  }[] = []

  for (const post of posts) {
    const update: {
      id: string
      thumbnail?: string | null
      content?: Record<string, unknown>
    } = { id: post.id }
    let changed = false

    const thumbnail = toRelativeMediaUrl(post.thumbnail)
    if (thumbnail !== post.thumbnail) {
      update.thumbnail = thumbnail
      changed = true
    }

    const originalContent = JSON.stringify(post.content)
    const normalizedContent = normalizeTiptapImageUrls(
      JSON.parse(originalContent)
    )
    if (JSON.stringify(normalizedContent) !== originalContent) {
      update.content = normalizedContent
      changed = true
    }

    if (changed) postUpdates.push(update)
  }

  if (postUpdates.length) {
    await campaignModuleService.updateCampaignPosts(postUpdates)
  }
  console.log(`campaign_post: fixed ${postUpdates.length}/${posts.length}`)
}
