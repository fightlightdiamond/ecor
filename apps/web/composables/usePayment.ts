export interface PaymentMethod {
  id: string
  label: string
}

export function usePayment() {
  const { fetchApi } = useApi()

  const methods = useState<PaymentMethod[]>('payment_methods', () => [])
  const loaded = useState('payment_methods_loaded', () => false)

  const fetchPaymentMethods = async () => {
    if (loaded.value) return methods.value
    try {
      const res = await fetchApi<{ success: boolean; data: { methods: PaymentMethod[] } }>('/payment-methods')
      if (res.success) {
        methods.value = res.data.methods ?? []
        loaded.value = true
      }
    } catch {
      methods.value = [{ id: 'cod', label: 'COD' }]
    }
    return methods.value
  }

  return { methods, fetchPaymentMethods }
}
