import type { ApiEnvelope } from '~/utils/storefront'
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
  staff_id?: number
  preferred_date?: string
  preferred_time?: string
  note?: string
}

export function useBooking() {
  const { fetchApi } = useApi()
  const { t } = useAppI18n()

  const slots = ref<BookingSlot[]>([])
  const slotsLoading = ref(false)

  const fetchAvailability = async (date: string) => {
    slotsLoading.value = true
    slots.value = []
    try {
      const res = await fetchApi<ApiEnvelope<{ date: string; slots: BookingSlot[] }>>(
        `/booking/availability?date=${encodeURIComponent(date)}`,
      )
      if (res.success) {
        slots.value = res.data.slots.filter(s => s.available)
        return { success: true, slots: slots.value }
      }
    } catch (err) {
      return { success: false, message: parseApiError(err, t('booking.error')) }
    } finally {
      slotsLoading.value = false
    }
    return { success: false, message: t('booking.error') }
  }

  const submitBooking = async (data: BookingFormData) => {
    try {
      const res = await fetchApi<{ success: boolean; message: string }>('/booking', {
        method: 'POST',
        body: data,
      })
      if (res.success) {
        return { success: true, message: res.message }
      }
    } catch (err) {
      return { success: false, message: parseApiError(err, t('booking.error')) }
    }
    return { success: false, message: t('booking.error') }
  }

  return { slots, slotsLoading, fetchAvailability, submitBooking }
}
