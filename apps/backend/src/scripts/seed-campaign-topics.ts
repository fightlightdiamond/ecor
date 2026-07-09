import type { ExecArgs } from "@medusajs/framework/types"
import { CAMPAIGN_MODULE } from "../modules/campaign"
import type CampaignModuleService from "../modules/campaign/service"

/**
 * Seeds the four editorial topics the site already uses in its blog menu.
 * Idempotent: topics whose slug already exists are skipped.
 *
 * Run with: npx medusa exec ./src/scripts/seed-campaign-topics.ts
 */
export default async function seedCampaignTopics({ container }: ExecArgs) {
  const campaignModuleService: CampaignModuleService =
    container.resolve(CAMPAIGN_MODULE)

  const topics = [
    {
      name: "Nếp trà Việt",
      slug: "nep-tra-viet",
      description:
        "Câu chuyện về thói quen thưởng trà, phong vị và nếp sống trà của người Việt.",
      rank: 0,
    },
    {
      name: "Văn hóa Việt & làng nghề truyền thống",
      slug: "van-hoa-viet-lang-nghe",
      description:
        "Hành trình khám phá văn hóa Việt và những làng nghề truyền thống gắn với cây chè.",
      rank: 1,
    },
    {
      name: "Di sản trà cụ",
      slug: "di-san-tra-cu",
      description:
        "Bộ sưu tập và kiến thức về ấm, chén và các trà cụ qua các thời kỳ.",
      rank: 2,
    },
    {
      name: "Vườn Ân Quang",
      slug: "vuon-an-quang",
      description:
        "Tin tức và hoạt động tại không gian Vườn Ân Quang.",
      rank: 3,
    },
  ]

  for (const topic of topics) {
    const existing = await campaignModuleService.listCampaignTopics({
      slug: topic.slug,
    })

    if (existing.length) {
      console.log(`Topic "${topic.slug}" already exists, skipping.`)
      continue
    }

    await campaignModuleService.createCampaignTopics({
      ...topic,
      image: null,
      is_active: true,
    })
    console.log(`Topic created: ${topic.slug}`)
  }
}
