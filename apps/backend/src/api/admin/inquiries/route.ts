import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { INQUIRY_MODULE } from "../../../modules/inquiry"
import type InquiryModuleService from "../../../modules/inquiry/service"

/**
 * GET /admin/inquiries?type=contact|booking&status=new&limit=&offset=
 *
 * Lists storefront inquiries (contact requests + bookings) for back office.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const inquiryService: InquiryModuleService = req.scope.resolve(INQUIRY_MODULE)

  const limit = Math.min(Number(req.query.limit) || 50, 200)
  const offset = Number(req.query.offset) || 0

  const filters: Record<string, unknown> = {}
  if (req.query.type) filters.type = String(req.query.type)
  if (req.query.status) filters.status = String(req.query.status)

  const [inquiries, count] = await inquiryService.listAndCountInquiries(
    filters,
    {
      take: limit,
      skip: offset,
      order: { created_at: "DESC" },
    }
  )

  res.json({ inquiries, count, limit, offset })
}
