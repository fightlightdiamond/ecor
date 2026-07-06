import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { INQUIRY_MODULE } from "../../../modules/inquiry"
import type InquiryModuleService from "../../../modules/inquiry/service"
import { normalizePhone } from "../../utils/phone"

/**
 * GET /store/my-bookings
 *
 * Bookings belonging to the logged-in customer, matched by the phone number
 * (and email) on their customer profile. Requires customer authentication
 * (see src/api/middlewares.ts).
 */
export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const customerId = req.auth_context.actor_id

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: customers } = await query.graph({
    entity: "customer",
    fields: ["id", "phone", "email"],
    filters: { id: customerId },
  })
  const customer = customers[0]
  if (!customer) {
    res.json({ bookings: [] })
    return
  }

  const inquiryService: InquiryModuleService = req.scope.resolve(INQUIRY_MODULE)
  const all = await inquiryService.listInquiries(
    { type: "booking" },
    { order: { created_at: "DESC" }, take: 200 }
  )

  const customerPhone = normalizePhone(customer.phone ?? "")
  const bookings = all.filter((b) => {
    if (customerPhone && normalizePhone(b.phone) === customerPhone) return true
    return Boolean(customer.email && b.email === customer.email)
  })

  res.json({
    bookings: bookings.map((b) => ({
      id: b.id,
      service: b.service,
      status: b.status,
      preferred_date: b.preferred_date,
      preferred_time: b.preferred_time,
      note: b.message,
      created_at: b.created_at,
    })),
  })
}
