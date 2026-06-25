import type { ApiEnvelope } from '~/utils/storefront'
import { parseApiError } from '~/utils/storefront'

export interface OrderLookupItem {
  product_name: string | null
  quantity: number
  price: number | string
}

export interface OrderLookup {
  number: string
  status: string
  total_price: number | string
  customer_name: string
  shipping_address: string
  created_at: string
  items: OrderLookupItem[]
}

export function useOrder() {
  const { fetchApi } = useApi()
  const { t } = useI18n()

  const lookupOrder = async (number: string, phone: string) => {
    try {
      const res = await fetchApi<ApiEnvelope<OrderLookup>>(
        `/orders/lookup?number=${encodeURIComponent(number)}&phone=${encodeURIComponent(phone)}`,
      )
      if (res.success) {
        return { success: true as const, data: res.data }
      }
    } catch (err) {
      return {
        success: false as const,
        message: parseApiError(err, t('cart.lookupError')),
      }
    }

    return { success: false as const, message: t('cart.lookupError') }
  }

  return { lookupOrder }
}
