export function useCustomerApi() {
  const { locale } = useAppI18n()

  const token = useCookie<string | null>('customer_token', {
    maxAge: 60 * 60 * 24 * 30,
  })

  const fetchCustomerApi = async <T>(path: string, options: Record<string, unknown> = {}) => {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> | undefined),
      Accept: 'application/json',
      'Accept-Language': locale.value,
    }

    if (token.value) {
      headers.Authorization = `Bearer ${token.value}`
    }

    return $fetch<T>(`/api/customer${path}`, {
      ...options,
      headers,
    })
  }

  return { fetchCustomerApi, token }
}
