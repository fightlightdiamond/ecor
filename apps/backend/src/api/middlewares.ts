import {
  authenticate,
  defineMiddlewares,
  validateAndTransformQuery,
} from "@medusajs/framework/http"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"

export const GetCampaignPostsSchema = createFindParams()
export const GetEventsSchema = createFindParams()

/** Medusa file routes don't register `/` reliably on Windows — catch it here. */
function redirectBareRootToAdmin(
  req: { path?: string; originalUrl?: string; url?: string },
  res: { headersSent?: boolean; redirect: (code: number, url: string) => void },
  next: () => void
) {
  const path =
    req.path ||
    (req.originalUrl || req.url || "").split("?")[0] ||
    ""

  if (path === "/" || path === "") {
    res.redirect(302, "/app")
    return
  }

  next()
}

export default defineMiddlewares({
  routes: [
    {
      // Broad matcher so this middleware is installed; handler no-ops unless path is `/`
      matcher: "/*",
      method: "GET",
      middlewares: [redirectBareRootToAdmin],
    },
    {
      matcher: "/admin/events",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(GetEventsSchema, {
          defaults: [
            "id",
            "title",
            "slug",
            "thumbnail",
            "location",
            "start_at",
            "end_at",
            "capacity",
            "registration_open",
            "is_active",
            "created_at",
          ],
          isList: true,
        }),
      ],
    },
    {
      matcher: "/admin/events",
      method: ["POST"],
      bodyParser: { sizeLimit: "10mb" },
    },
    {
      matcher: "/admin/events/*",
      method: ["PATCH"],
      bodyParser: { sizeLimit: "10mb" },
    },
    {
      matcher: "/store/my-bookings*",
      middlewares: [authenticate("customer", ["bearer", "session"])],
    },
    {
      matcher: "/admin/campaign-posts",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(GetCampaignPostsSchema, {
          defaults: [
            "id",
            "title",
            "slug",
            "thumbnail",
            "topic_id",
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
