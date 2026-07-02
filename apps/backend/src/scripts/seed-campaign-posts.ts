import type { ExecArgs } from "@medusajs/framework/types"
import { CAMPAIGN_MODULE } from "../modules/campaign"
import type CampaignModuleService from "../modules/campaign/service"

export default async function seedCampaignPosts({ container }: ExecArgs) {
  const campaignModuleService: CampaignModuleService =
    container.resolve(CAMPAIGN_MODULE)

  const existing = await campaignModuleService.listCampaignPosts({
    slug: "welcome-to-our-store",
  })

  if (existing.length) {
    console.log("Sample campaign post already exists, skipping.")
    return
  }

  await campaignModuleService.createCampaignPosts({
    title: "Welcome to Our Store",
    slug: "welcome-to-our-store",
    is_active: true,
    publish_at: new Date(),
    unpublish_at: null,
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Welcome to Our Store" }],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "This is a sample campaign post created by the seed script. You can edit or delete it from the Medusa Admin under Campaign Posts.",
            },
          ],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Create posts in Admin → Campaign Posts",
                    },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Schedule publish and unpublish times",
                    },
                  ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: "Content appears on the storefront automatically",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  })

  console.log("Sample campaign post created: welcome-to-our-store")
}
