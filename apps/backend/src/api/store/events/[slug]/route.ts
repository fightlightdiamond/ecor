import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { EVENT_MODULE } from "../../../../modules/event"
import type EventModuleService from "../../../../modules/event/service"

/**
 * GET /store/events/:slug
 *
 * Returns a single active event by slug with registered_seats/seats_left.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { slug } = req.params

  const eventModuleService: EventModuleService = req.scope.resolve(EVENT_MODULE)

  const events = await eventModuleService.listActiveEvents({ slug }, { take: 1 })

  if (!events.length) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Event with slug "${slug}" was not found`
    )
  }

  const event = events[0]
  const seatsByEvent = await eventModuleService.countRegisteredSeats([event.id])
  const registered = seatsByEvent.get(event.id) ?? 0

  res.json({
    event: {
      ...event,
      registered_seats: registered,
      seats_left:
        event.capacity === null ? null : Math.max(0, event.capacity - registered),
    },
  })
}
