import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { INQUIRY_MODULE } from "../../../../modules/inquiry"
import type InquiryModuleService from "../../../../modules/inquiry/service"

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

/**
 * GET /store/bookings/availability?date=YYYY-MM-DD
 *
 * Lists booking slots for a date with availability flags.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const date = String(req.query.date || "")

  if (!DATE_RE.test(date)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "date must be YYYY-MM-DD"
    )
  }

  const inquiryService: InquiryModuleService = req.scope.resolve(INQUIRY_MODULE)
  const slots = await inquiryService.getAvailability(date)

  res.json({ date, slots })
}
