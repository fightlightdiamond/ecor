import { parseApiError } from '~/utils/storefront'

export interface BookingSlot {
  time: string
  available: boolean
}

export interface BookingFormData {
  name: string
  phone: string
  email?: string
  service?: string
  preferred_date?: string
  preferred_time?: string
  note?: string
}

/**
 * Visit/tasting bookings stored in the Medusa backend
 * (custom routes: /store/bookings + /store/bookings/availability,
 * module: apps/backend/src/modules/inquiry).
 */
export function useBooking() {
  const { fetchMedusa } = useMedusaApi()
  const { t } = useAppI18n()

  const slots = ref<BookingSlot[]>([])
  const slotsLoading = ref(false)

  const fetchAvailability = async (date: string) => {
    slotsLoading.value = true
    slots.value = []
    try {
      const res = await fetchMedusa<{ date: string, slots: BookingSlot[] }>(
        `/store/bookings/availability?date=${encodeURIComponent(date)}`,
      )
      slots.value = (res.slots ?? []).filter(s => s.available)
      return { success: true, slots: slots.value }
    } catch (err) {
      return { success: false, message: parseApiError(err, t('booking.error')) }
    } finally {
      slotsLoading.value = false
    }
  }

  const submitBooking = async (data: BookingFormData) => {
    try {
      const res = await fetchMedusa<{ success: boolean }>('/store/bookings', {
        method: 'POST',
        body: data,
      })
      if (res.success) {
        return { success: true, message: t('booking.success') }
      }
    } catch (err) {
      // Slot filled between availability check and submit.
      const type = (err as { data?: { type?: string } })?.data?.type
      if (type === 'not_allowed') {
        return { success: false, message: t('booking.noSlots') }
      }
      return { success: false, message: parseApiError(err, t('booking.error')) }
    }
    return { success: false, message: t('booking.error') }
  }

  return { slots, slotsLoading, fetchAvailability, submitBooking }
}
