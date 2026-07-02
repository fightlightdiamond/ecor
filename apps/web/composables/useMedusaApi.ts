/**
 * Low-level fetch wrapper for Medusa's Store API. Every request is scoped by
 * the publishable API key + Vietnam region, both auto-provisioned by
 * apps/admin-medusa/scripts/setup-web-integration.mjs — nothing to configure
 * by hand.
 */
export function useMedusaApi() {
  const config = useRuntimeConfig()

  const fetchMedusa = async <T>(path: string, options: Record<string, unknown> = {}) => {
    return $fetch<T>(`${config.public.medusaBackendUrl}${path}`, {
      ...options,
      headers: {
        ...(options.headers as Record<string, string> | undefined),
        'x-publishable-api-key': config.public.medusaPublishableKey,
      },
    })
  }

  return {
    fetchMedusa,
    regionId: config.public.medusaRegionId,
  }
}
