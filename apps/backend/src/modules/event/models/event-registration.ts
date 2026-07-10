import { model } from "@medusajs/framework/utils"

const EventRegistration = model.define("event_registration", {
  id: model.id({ prefix: "evreg" }).primaryKey(),
  // Plain-column reference to event (resolved manually in API routes)
  event_id: model.text(),
  name: model.text(),
  phone: model.text().searchable(),
  email: model.text().nullable(),
  // Number of seats this registration reserves
  quantity: model.number().default(1),
  // Message left by the visitor when registering
  message: model.text().nullable(),
  // Internal note staff attach after contacting the registrant
  staff_note: model.text().nullable(),
  status: model
    .enum(["new", "contacted", "confirmed", "cancelled"])
    .default("new"),
  source: model.text().nullable(),
})

export default EventRegistration
