import {
  defineMiddlewares,
  validateAndTransformQuery,
} from "@medusajs/framework/http"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"

export const GetCampaignPostsSchema = createFindParams()

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/campaign-posts",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(GetCampaignPostsSchema, {
          defaults: [
            "id",
            "title",
            "slug",
            "is_active",
            "publish_at",
            "unpublish_at",
            "created_at",
          ],
          isList: true,
        }),
      ],
    },
    {
      matcher: "/admin/campaign-posts",
      method: ["POST"],
      bodyParser: { sizeLimit: "10mb" },
    },
    {
      matcher: "/admin/campaign-posts/*",
      method: ["PATCH"],
      bodyParser: { sizeLimit: "10mb" },
    },
  ],
})
