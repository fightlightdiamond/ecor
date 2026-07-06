import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { INQUIRY_MODULE } from "../../../modules/inquiry"
import type InquiryModuleService from "../../../modules/inquiry/service"

type ContactBody = {
  name?: string
  phone?: string
  email?: string
  service?: string
  message?: string
  source?: string
}

/**
 * POST /store/contact
 *
 * Stores a contact request from the storefront contact form.
 */
export async function POST(
  req: MedusaRequest<ContactBody>,
  res: MedusaResponse
) {
  const { name, phone, email, service, message, source } = req.body ?? {}

  if (!name?.trim() || !phone?.trim()) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "name and phone are required"
    )
  }

  const inquiryService: InquiryModuleService = req.scope.resolve(INQUIRY_MODULE)

  const inquiry = await inquiryService.createInquiries({
    type: "contact",
    name: name.trim().slice(0, 200),
    phone: phone.trim().slice(0, 30),
    email: email?.trim().slice(0, 200) || null,
    service: service?.trim().slice(0, 200) || null,
    message: message?.trim().slice(0, 4000) || null,
    source: source?.trim().slice(0, 100) || "website",
  })

  res.status(201).json({ success: true, inquiry_id: inquiry.id })
}
