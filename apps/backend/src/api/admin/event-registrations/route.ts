import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { EVENT_MODULE } from "../../../modules/event"
import type EventModuleService from "../../../modules/event/service"

/**
 * GET /admin/event-registrations?event_id=&status=new&limit=&offset=
 *
 * Lists storefront event registrations for back office, each with its
 * event attached ({id, title, slug} or null).
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const eventModuleService: EventModuleService = req.scope.resolve(EVENT_MODULE)

  const limit = Math.min(Number(req.query.limit) || 50, 200)
  const offset = Number(req.query.offset) || 0

  const filters: Record<string, unknown> = {}
  if (req.query.event_id) filters.event_id = String(req.query.event_id)
  if (req.query.status) filters.status = String(req.query.status)

  const [registrations, count] =
    await eventModuleService.listAndCountEventRegistrations(filters, {
      take: limit,
      skip: offset,
      order: { created_at: "DESC" },
    })

  // Manually resolve event_id -> {id,title,slug} (no module link)
  const eventIds = [...new Set(registrations.map((r) => r.event_id).filter(Boolean))]
  const events = eventIds.length
    ? await eventModuleService.listEvents({ id: eventIds })
    : []
  const eventById = new Map(
    events.map((e) => [e.id, { id: e.id, title: e.title, slug: e.slug }])
  )

  res.json({
    event_registrations: registrations.map((registration) => ({
      ...registration,
      event: eventById.get(registration.event_id) ?? null,
    })),
    count,
    limit,
    offset,
  })
}
