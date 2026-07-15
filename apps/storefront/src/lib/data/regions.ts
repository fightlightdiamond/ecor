"use server"

import { cache } from "react"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const listRegions = cache(async () => {
  const next = {
    ...(await getCacheOptions("regions")),
  }

  return await sdk.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ regions }) => regions)
})

export const retrieveRegion = cache(async (id: string) => {
  const next = {
    ...(await getCacheOptions(["regions", id].join("-"))),
  }

  return await sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ region }) => region)
})

export const getRegion = cache(async (countryCode: string) => {
  const regions = await listRegions()

  if (!regions) {
    return null
  }

  const regionMap = new Map<string, HttpTypes.StoreRegion>()

  regions.forEach((region) => {
    region.countries?.forEach((c) => {
      regionMap.set(c?.iso_2 ?? "", region)
    })
  })

  return countryCode ? regionMap.get(countryCode) : regionMap.get("us")
})
