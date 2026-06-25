import { parseApiError } from '~/utils/storefront'

export interface ContactFormData {
  name: string
  phone: string
  email?: string
  service?: string
  message?: string
  source?: string
}

export function useContact() {
  const { fetchApi } = useApi()
  const { t } = useI18n()

  const submitContact = async (data: ContactFormData) => {
    try {
      const res = await fetchApi<{ success: boolean; message: string }>('/contact', {
        method: 'POST',
        body: {
          name: data.name,
          phone: data.phone,
          email: data.email || undefined,
          service: data.service || undefined,
          message: data.message || undefined,
          source: data.source || 'website',
        },
      })

      if (res.success) {
        return { success: true, message: res.message }
      }
    } catch (err) {
      return { success: false, message: parseApiError(err, t('contact.form.error')) }
    }

    return { success: false, message: t('contact.form.error') }
  }

  return { submitContact }
}
