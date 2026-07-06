import { parseApiError } from '~/utils/storefront'

export interface OrderLookupItem {
  product_name: string | null
  quantity: number
  price: number | string
}

export interface OrderLookup {
  number: string
  status: string
  payment_status?: string
  payment_method?: string
  can_retry_payment?: boolean
  total_price: number | string
  customer_name: string
  shipping_address: string
  created_at: string
  items: OrderLookupItem[]
}

/**
 * Guest order tracking against the Medusa backend
 * (custom route: GET /store/order-lookup, apps/backend/src/api/store/order-lookup).
 */
export function useOrder() {
  const { fetchMedusa } = useMedusaApi()
  const { t } = useAppI18n()

  const lookupOrder = async (number: string, phone: string) => {
    try {
      const res = await fetchMedusa<{ order: OrderLookup }>(
        `/store/order-lookup?number=${encodeURIComponent(number)}&phone=${encodeURIComponent(phone)}`,
      )
      if (res.order) {
        return { success: true as const, data: res.order }
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
