"use server"

import { unstable_cache } from "next/cache"

import { sdk } from "@lib/config"

export type Locale = {
  code: string
  name: string
}

/**
 * Fetches available locales from the backend.
 * Returns null if the endpoint returns 404 (locales not configured).
 * Cached aggressively — a 404 every nav request was wasting ~150ms+.
 */
export const listLocales = unstable_cache(
  async (): Promise<Locale[] | null> => {
    return sdk.client
      .fetch<{ locales: Locale[] }>(`/store/locales`, {
        method: "GET",
        cache: "force-cache",
      })
      .then(({ locales }) => locales)
      .catch(() => null)
  },
  ["medusa-store-locales"],
  { revalidate: 3600, tags: ["locales"] }
)
