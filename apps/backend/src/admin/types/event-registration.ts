export type EventRegistrationStatus =
  | "new"
  | "contacted"
  | "confirmed"
  | "cancelled"

export type EventRegistration = {
  id: string
  event_id: string
  name: string
  phone: string
  email: string | null
  quantity: number
  message: string | null
  staff_note: string | null
  status: EventRegistrationStatus
  source: string | null
  created_at?: string
  event?: { id: string; title: string; slug: string } | null
}

export type EventRegistrationsResponse = {
  event_registrations: EventRegistration[]
  count: number
  limit: number
  offset: number
}

export type EventRegistrationResponse = {
  event_registration: EventRegistration
}
