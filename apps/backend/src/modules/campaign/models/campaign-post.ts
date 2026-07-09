import { model } from "@medusajs/framework/utils"

const CampaignPost = model.define("campaign_post", {
  id: model.id({ prefix: "post" }).primaryKey(),
  title: model.text(),
  slug: model.text().searchable(),
  content: model.json(),
  // Card/hero image; falls back to the first image inside content on the storefront
  thumbnail: model.text().nullable(),
  // Plain-column reference to campaign_topic (resolved manually in API routes)
  topic_id: model.text().nullable(),
  is_active: model.boolean().default(true),
  publish_at: model.dateTime().nullable(),
  unpublish_at: model.dateTime().nullable(),
})

export default CampaignPost
