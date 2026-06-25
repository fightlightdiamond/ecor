import { useCookie } from '#app'

export function useApi() {
  const { locale } = useAppI18n()

  const sessionId = useCookie('api_session_id', {
    maxAge: 60 * 60 * 24 * 30,
  })

  if (!sessionId.value) {
    sessionId.value = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 15)
  }

  const fetchApi = async <T>(url: string, options: Record<string, unknown> = {}) => {
    const separator = url.includes('?') ? '&' : '?'
    const apiUrl = `/api/storefront${url}${separator}lang=${locale.value}`

    const customerToken = useCookie<string | null>('customer_token')

    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> | undefined),
      'X-Session-ID': sessionId.value!,
      Accept: 'application/json',
      'Accept-Language': locale.value,
    }

    if (customerToken.value) {
      headers.Authorization = `Bearer ${customerToken.value}`
    }

    return $fetch<T>(apiUrl, {
      ...options,
      headers,
    })
  }

  return { fetchApi, sessionId }
}
