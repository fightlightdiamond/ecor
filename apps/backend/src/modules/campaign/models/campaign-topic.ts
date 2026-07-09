import { model } from "@medusajs/framework/utils"

const CampaignTopic = model.define("campaign_topic", {
  id: model.id({ prefix: "ctopic" }).primaryKey(),
  name: model.text(),
  slug: model.text().searchable(),
  description: model.text().nullable(),
  // Banner/hero image shown on the storefront topic listing page
  image: model.text().nullable(),
  is_active: model.boolean().default(true),
  rank: model.number().default(0),
})

export default CampaignTopic
