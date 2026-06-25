import type { ApiEnvelope } from '~/utils/storefront'
import { parseApiError } from '~/utils/storefront'

export interface CouponValidation {
  valid: boolean
  code?: string
  type?: string
  value?: number
  discount?: number
  message?: string
}

export function useCoupon() {
  const { fetchApi } = useApi()
  const { t } = useAppI18n()

  const applied = useState<CouponValidation | null>('applied_coupon', () => null)

  const validateCoupon = async (code: string, cartTotal: number) => {
    try {
      const res = await fetchApi<ApiEnvelope<CouponValidation>>('/coupons/validate', {
        method: 'POST',
        body: { code, cart_total: cartTotal },
      })
      if (res.success) {
        if (res.data.valid) {
          applied.value = res.data
        }
        return { success: true, data: res.data }
      }
    } catch (err) {
      return { success: false, message: parseApiError(err, t('cart.couponError')) }
    }

    return { success: false, message: t('cart.couponError') }
  }

  const clearCoupon = () => {
    applied.value = null
  }

  return { applied, validateCoupon, clearCoupon }
}
