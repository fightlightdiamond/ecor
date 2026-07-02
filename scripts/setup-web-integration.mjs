#!/usr/bin/env node
/**
 * Idempotent one-shot setup that lets apps/web (Nuxt) talk to this Medusa
 * backend's Store API without any manual dashboard clicking:
 *
 *   1. Waits for the backend to be healthy.
 *   2. Logs in as the admin user created by run-dev.sh/ps1 or docker-compose.
 *   3. Ensures a "Vietnam" region exists (VND, country vn, manual/system
 *      payment provider) — the seeded starter data only ships a Europe/EUR
 *      region, which is useless for a Vietnamese storefront.
 *   4. Ensures a VN shipping option exists on that region's fulfillment
 *      network (reuses the existing default warehouse's fulfillment set).
 *   5. Backfills a VND price (derived from the existing EUR price) onto
 *      every product variant that doesn't have one yet, so the demo catalog
 *      actually prices in VND. This does NOT replace real product data —
 *      it just makes the seeded demo products checkout-able in VND so the
 *      integration can be verified end-to-end.
 *   6. Fetches the (already-seeded) default publishable API key.
 *   7. Writes/updates apps/web/.env with the backend URL, publishable key,
 *      and Vietnam region id.
 *
 * Usage:  node scripts/setup-web-integration.mjs
 * Safe to re-run — every step checks for existing state first.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@medusa.local"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "supersecret123"
const WEB_ENV_PATH = path.join(__dirname, "..", "..", "web", ".env")
const VND_PER_EUR = 27000 // rough demo conversion, not a live FX rate

function log(msg) {
  console.log(`[setup-web-integration] ${msg}`)
}

async function waitForHealth() {
  log("Waiting for backend health...")
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`${BACKEND_URL}/health`)
      if (res.ok) {
        log("Backend is healthy.")
        return
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 2000))
  }
  throw new Error("Backend did not become healthy in time.")
}

async function adminLogin() {
  const res = await fetch(`${BACKEND_URL}/auth/user/emailpass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  if (!res.ok) throw new Error(`Admin login failed: ${res.status} ${await res.text()}`)
  const { token } = await res.json()
  return token
}

async function adminFetch(token, path, options = {}) {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  })
  if (!res.ok) throw new Error(`${options.method || "GET"} ${path} failed: ${res.status} ${await res.text()}`)
  return res.json()
}

async function ensureVietnamRegion(token) {
  log("Ensuring Vietnam region (VND) exists...")
  const { regions } = await adminFetch(token, "/admin/regions?limit=100")
  const existing = regions.find((r) => r.name === "Vietnam")
  if (existing) {
    log(`Vietnam region already exists (${existing.id}).`)
    return existing
  }
  const { region } = await adminFetch(token, "/admin/regions", {
    method: "POST",
    body: JSON.stringify({
      name: "Vietnam",
      currency_code: "vnd",
      countries: ["vn"],
      payment_providers: ["pp_system_default"],
    }),
  })
  log(`Created Vietnam region (${region.id}).`)
  return region
}

async function ensureVietnamShipping(token) {
  log("Ensuring Vietnam shipping option exists...")
  // There's no GET /admin/fulfillment-sets/:id route — fetch the nested
  // fulfillment set + service zones through the stock location instead.
  const { stock_locations } = await adminFetch(
    token,
    "/admin/stock-locations?limit=1&fields=*fulfillment_sets.service_zones",
  )
  const location = stock_locations[0]
  if (!location) throw new Error("No stock location found — cannot set up shipping.")

  const fulfillmentSet = location.fulfillment_sets?.[0]
  if (!fulfillmentSet) throw new Error("Stock location has no fulfillment set.")

  let serviceZone = fulfillmentSet.service_zones.find((z) => z.name === "Vietnam")
  if (!serviceZone) {
    const created = await adminFetch(
      token,
      `/admin/fulfillment-sets/${fulfillmentSet.id}/service-zones`,
      {
        method: "POST",
        body: JSON.stringify({
          name: "Vietnam",
          geo_zones: [{ country_code: "vn", type: "country" }],
        }),
      },
    )
    serviceZone = created.fulfillment_set.service_zones.find((z) => z.name === "Vietnam")
    log(`Created "Vietnam" service zone (${serviceZone.id}).`)
  } else {
    log(`"Vietnam" service zone already exists (${serviceZone.id}).`)
  }

  const { shipping_options } = await adminFetch(
    token,
    `/admin/shipping-options?service_zone_id=${serviceZone.id}`,
  )
  if (shipping_options.length) {
    log(`Vietnam shipping option already exists (${shipping_options[0].id}).`)
    return
  }

  // Reuse whatever default shipping profile the seeded data created.
  const { shipping_options: anyOptions } = await adminFetch(token, "/admin/shipping-options?limit=1")
  const shippingProfileId = anyOptions[0]?.shipping_profile_id
  if (!shippingProfileId) throw new Error("No shipping profile found to reuse.")

  await adminFetch(token, "/admin/shipping-options", {
    method: "POST",
    body: JSON.stringify({
      name: "Giao hàng tiêu chuẩn",
      service_zone_id: serviceZone.id,
      shipping_profile_id: shippingProfileId,
      provider_id: "manual_manual",
      price_type: "flat",
      type: { label: "Standard", description: "Giao trong 2-3 ngày", code: "standard" },
      prices: [{ currency_code: "vnd", amount: 30000 }],
      rules: [
        { attribute: "enabled_in_store", operator: "eq", value: "true" },
        { attribute: "is_return", operator: "eq", value: "false" },
      ],
    }),
  })
  log("Created Vietnam shipping option (30,000₫ flat).")
}

async function backfillVndPrices(token) {
  log("Backfilling VND prices on product variants missing one...")
  const { products } = await adminFetch(
    token,
    "/admin/products?limit=100&fields=id,*variants.prices",
  )
  let updated = 0
  for (const product of products) {
    for (const variant of product.variants || []) {
      const hasVnd = variant.prices?.some((p) => p.currency_code === "vnd")
      if (hasVnd) continue
      const eurPrice = variant.prices?.find((p) => p.currency_code === "eur")
      const amount = eurPrice ? Math.round(eurPrice.amount * VND_PER_EUR) : 100000
      // Dedicated variant-update route — the top-level POST /admin/products/:id
      // with a nested `variants` array requires a FULL variant payload (title
      // etc.) and 500s on a partial {id, prices} patch.
      await adminFetch(token, `/admin/products/${product.id}/variants/${variant.id}`, {
        method: "POST",
        body: JSON.stringify({ prices: [{ currency_code: "vnd", amount }] }),
      })
      updated++
    }
  }
  log(updated ? `Added VND price to ${updated} variant(s).` : "All variants already have VND prices.")
}

async function getPublishableKey(token) {
  const { api_keys } = await adminFetch(token, "/admin/api-keys?type=publishable&limit=1")
  if (!api_keys.length) throw new Error("No publishable API key found — expected the seeded default key.")
  return api_keys[0].token
}

function upsertEnvVars(filePath, vars) {
  let content = existsSync(filePath) ? readFileSync(filePath, "utf8") : ""
  for (const [key, value] of Object.entries(vars)) {
    const line = `${key}=${value}`
    const re = new RegExp(`^${key}=.*$`, "m")
    if (re.test(content)) {
      content = content.replace(re, line)
    } else {
      content = content.trimEnd() + `\n${line}\n`
    }
  }
  writeFileSync(filePath, content)
}

async function main() {
  await waitForHealth()
  const token = await adminLogin()
  const region = await ensureVietnamRegion(token)
  await ensureVietnamShipping(token)
  await backfillVndPrices(token)
  const publishableKey = await getPublishableKey(token)

  upsertEnvVars(WEB_ENV_PATH, {
    NUXT_PUBLIC_MEDUSA_BACKEND_URL: BACKEND_URL,
    NUXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY: publishableKey,
    NUXT_PUBLIC_MEDUSA_REGION_ID: region.id,
  })
  log(`Wrote Medusa env vars to ${WEB_ENV_PATH}`)
  log("Done. Restart the Nuxt dev server to pick up the new env vars.")
}

main().catch((err) => {
  console.error(`[setup-web-integration] FAILED: ${err.message}`)
  process.exit(1)
})
