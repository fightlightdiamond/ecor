import { parseApiError } from '~/utils/storefront'

export interface ContactFormData {
  name: string
  phone: string
  email?: string
  service?: string
  message?: string
  source?: string
}

/**
 * Contact requests are stored in the Medusa backend
 * (custom route: POST /store/contact, module: apps/backend/src/modules/inquiry).
 */
export function useContact() {
  const { fetchMedusa } = useMedusaApi()
  const { t } = useI18n()

  const submitContact = async (data: ContactFormData) => {
    try {
      const res = await fetchMedusa<{ success: boolean }>('/store/contact', {
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
        return { success: true, message: t('contact.form.success') }
      }
    } catch (err) {
      return { success: false, message: parseApiError(err, t('contact.form.error')) }
    }

    return { success: false, message: t('contact.form.error') }
  }

  return { submitContact }
}
