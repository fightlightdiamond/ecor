import { model } from "@medusajs/framework/utils"

const CampaignPost = model.define("campaign_post", {
  id: model.id({ prefix: "post" }).primaryKey(),
  title: model.text(),
  slug: model.text().searchable(),
  content: model.json(),
  is_active: model.boolean().default(true),
  publish_at: model.dateTime().nullable(),
  unpublish_at: model.dateTime().nullable(),
})

export default CampaignPost
