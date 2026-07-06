import { MedusaService } from "@medusajs/framework/utils"
import Inquiry from "./models/inquiry"

export type BookingSlot = {
  time: string
  available: boolean
}

/** Bookable time slots per day (lunch break excluded). */
const DAILY_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
]

/** How many bookings a single slot can take before it closes. */
const SLOT_CAPACITY = Number(process.env.BOOKING_SLOT_CAPACITY || 3)

class InquiryModuleService extends MedusaService({
  Inquiry,
}) {
  /**
   * Availability for a given date: every daily slot with a flag telling
   * whether it still has capacity (cancelled bookings don't count).
   */
  async getAvailability(date: string): Promise<BookingSlot[]> {
    const bookings = await this.listInquiries(
      {
        type: "booking",
        preferred_date: date,
        status: ["new", "confirmed"],
      },
      { select: ["id", "preferred_time"], take: 1000 }
    )

    const counts = new Map<string, number>()
    for (const b of bookings) {
      if (!b.preferred_time) continue
      counts.set(b.preferred_time, (counts.get(b.preferred_time) ?? 0) + 1)
    }

    return DAILY_SLOTS.map((time) => ({
      time,
      available: (counts.get(time) ?? 0) < SLOT_CAPACITY,
    }))
  }
}

export default InquiryModuleService
