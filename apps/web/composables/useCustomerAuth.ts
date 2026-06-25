import { parseApiError } from '~/utils/storefront'
import type { OrderLookup } from '~/composables/useOrder'

export interface CustomerProfile {
  id: number
  name: string
  phone: string
  email: string | null
}

export interface CustomerAppointment {
  id: number
  service: string | null
  status: string
  scheduled_at: string | null
  notes: string | null
  created_at: string
}

export function useCustomerAuth() {
  const { fetchCustomerApi, token } = useCustomerApi()
  const { t } = useAppI18n()

  const customer = useState<CustomerProfile | null>('customer_profile', () => null)

  const isLoggedIn = computed(() => Boolean(token.value))

  const register = async (data: { name: string; phone: string; password: string; email?: string }) => {
    try {
      const res = await fetchCustomerApi<{
        success: boolean
        data: { token: string; customer: CustomerProfile }
      }>('/register', { method: 'POST', body: data })

      if (res.success) {
        token.value = res.data.token
        customer.value = res.data.customer
        return { success: true }
      }
    } catch (err) {
      return { success: false, message: parseApiError(err, t('account.registerError')) }
    }
    return { success: false, message: t('account.registerError') }
  }

  const login = async (phone: string, password: string) => {
    try {
      const res = await fetchCustomerApi<{
        success: boolean
        data: { token: string; customer: CustomerProfile }
      }>('/login', { method: 'POST', body: { phone, password } })

      if (res.success) {
        token.value = res.data.token
        customer.value = res.data.customer
        return { success: true }
      }
    } catch (err) {
      return { success: false, message: parseApiError(err, t('account.loginError')) }
    }
    return { success: false, message: t('account.loginError') }
  }

  const logout = async () => {
    try {
      if (token.value) {
        await fetchCustomerApi('/logout', { method: 'POST' })
      }
    } catch {
      // ignore
    }
    token.value = null
    customer.value = null
  }

  const fetchProfile = async () => {
    if (!token.value) return
    try {
      const res = await fetchCustomerApi<{ success: boolean; data: CustomerProfile }>('/profile')
      if (res.success) customer.value = res.data
    } catch {
      token.value = null
      customer.value = null
    }
  }

  const fetchAppointments = async () => {
    const res = await fetchCustomerApi<{ success: boolean; data: CustomerAppointment[] }>('/appointments')
    return res.success ? res.data : []
  }

  const cancelAppointment = async (id: number) => {
    try {
      const res = await fetchCustomerApi<{ success: boolean; message?: string }>(`/appointments/${id}`, {
        method: 'DELETE',
      })
      return { success: res.success, message: res.message }
    } catch (err) {
      return { success: false, message: parseApiError(err, t('account.cancelError')) }
    }
  }

  const fetchOrders = async () => {
    const res = await fetchCustomerApi<{ success: boolean; data: OrderLookup[] }>('/orders')
    return res.success ? res.data : []
  }

  return {
    customer,
    isLoggedIn,
    register,
    login,
    logout,
    fetchProfile,
    fetchAppointments,
    cancelAppointment,
    fetchOrders,
  }
}
