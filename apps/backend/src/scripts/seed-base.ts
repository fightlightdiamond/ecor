import type { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  createApiKeysWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"

/**
 * Seeds the BASE commerce data an EMPTY database needs before the Store API
 * can answer a single request. `medusa db:migrate` creates the schema plus a
 * bare store record — but NO publishable API key, sales channel link, region,
 * stock location or shipping. Without those, every /store call fails with
 * "A valid publishable key is required" (create-medusa-app's starter seed
 * normally provides them, but this repo never runs that seed).
 *
 * Runs on every backend boot (see infra/docker-compose*.yml) right before
 * seed-cards. Every step checks existing state first, so re-runs are no-ops.
 * scripts/setup-web-integration.mjs afterwards reads the key/region and
 * writes them into the repo-root compose env file for apps/web.
 */
export default async function seedBase({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const storeModule = container.resolve(Modules.STORE)
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL)
  const regionModule = container.resolve(Modules.REGION)
  const stockLocationModule = container.resolve(Modules.STOCK_LOCATION)
  const fulfillmentModule = container.resolve(Modules.FULFILLMENT)
  const apiKeyModule = container.resolve(Modules.API_KEY)
  const taxModule = container.resolve(Modules.TAX)

  // --- 1. Default sales channel (db:migrate creates it on recent Medusa
  // versions, but don't rely on that) --------------------------------------
  let [salesChannel] = await salesChannelModule.listSalesChannels({
    name: "Default Sales Channel",
  })
  if (!salesChannel) {
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: { salesChannelsData: [{ name: "Default Sales Channel" }] },
    })
    salesChannel = result[0]
    logger.info("seed-base: created Default Sales Channel")
  }

  // --- 2. Store: VND must be a supported currency (a VND region can't be
  // created otherwise) + point the store at the default sales channel -------
  const [store] = await storeModule.listStores(
    {},
    { relations: ["supported_currencies"] }
  )
  if (!store) throw new Error("No store found — run `medusa db:migrate` first.")
  const supported = store.supported_currencies ?? []
  const hasVnd = supported.some((c) => c.currency_code === "vnd")
  if (!hasVnd || !store.default_sales_channel_id) {
    await updateStoresWorkflow(container).run({
      input: {
        selector: { id: store.id },
        update: {
          // Preserve whatever currencies/default already exist; vnd only
          // becomes the default when nothing else is.
          supported_currencies: [
            ...supported.map((c) => ({
              currency_code: c.currency_code,
              is_default: !!c.is_default,
            })),
            ...(hasVnd
              ? []
              : [
                  {
                    currency_code: "vnd",
                    is_default: !supported.some((c) => c.is_default),
                  },
                ]),
          ],
          default_sales_channel_id: salesChannel.id,
        },
      },
    })
    logger.info("seed-base: updated store (VND currency / default sales channel)")
  }

  // --- 3. Vietnam region (VND) ---------------------------------------------
  let [region] = await regionModule.listRegions({ name: "Vietnam" })
  if (!region) {
    const { result } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Vietnam",
            currency_code: "vnd",
            countries: ["vn"],
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    })
    region = result[0]
    logger.info(`seed-base: created Vietnam region (${region.id})`)
  }

  // --- 4. Tax region for VN (checkout tax lookup 500s without one) ----------
  const taxRegions = await taxModule.listTaxRegions({ country_code: "vn" })
  if (!taxRegions.length) {
    await createTaxRegionsWorkflow(container).run({
      input: [{ country_code: "vn", provider_id: "tp_system" }],
    })
    logger.info("seed-base: created VN tax region")
  }

  // --- 5. Stock location + manual fulfillment provider + sales channel link -
  let [stockLocation] = await stockLocationModule.listStockLocations({})
  if (!stockLocation) {
    const { result } = await createStockLocationsWorkflow(container).run({
      input: {
        locations: [
          {
            name: "Kho mặc định",
            address: { city: "Hà Nội", country_code: "VN", address_1: "" },
          },
        ],
      },
    })
    stockLocation = result[0]
    logger.info(`seed-base: created stock location (${stockLocation.id})`)
  }

  const {
    data: [locationDetail],
  } = await query.graph({
    entity: "stock_location",
    fields: [
      "id",
      "fulfillment_providers.id",
      "fulfillment_sets.id",
      "sales_channels.id",
    ],
    filters: { id: stockLocation.id },
  })

  if (!locationDetail.fulfillment_providers?.length) {
    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
      [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
    })
    logger.info("seed-base: enabled manual fulfillment provider on stock location")
  }

  if (!locationDetail.sales_channels?.length) {
    await linkSalesChannelsToStockLocationWorkflow(container).run({
      input: { id: stockLocation.id, add: [salesChannel.id] },
    })
    logger.info("seed-base: linked stock location to default sales channel")
  }

  // --- 6. Fulfillment set + "Vietnam" service zone ---------------------------
  // (setup-web-integration.mjs looks the zone up by the name "Vietnam" — keep
  // them in sync)
  let fulfillmentSetId: string | undefined =
    locationDetail.fulfillment_sets?.[0]?.id
  if (!fulfillmentSetId) {
    const fulfillmentSet = await fulfillmentModule.createFulfillmentSets({
      name: "Giao hàng Việt Nam",
      type: "shipping",
      service_zones: [
        {
          name: "Vietnam",
          geo_zones: [{ country_code: "vn", type: "country" }],
        },
      ],
    })
    fulfillmentSetId = fulfillmentSet.id
    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
      [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
    })
    logger.info("seed-base: created fulfillment set + Vietnam service zone")
  }

  const [fulfillmentSet] = await fulfillmentModule.listFulfillmentSets(
    { id: fulfillmentSetId },
    { relations: ["service_zones"] }
  )
  let serviceZone = fulfillmentSet.service_zones?.find(
    (z) => z.name === "Vietnam"
  )
  if (!serviceZone) {
    ;[serviceZone] = await fulfillmentModule.createServiceZones([
      {
        name: "Vietnam",
        fulfillment_set_id: fulfillmentSetId,
        geo_zones: [{ country_code: "vn", type: "country" }],
      },
    ])
    logger.info("seed-base: created Vietnam service zone")
  }

  // --- 7. Default shipping profile -------------------------------------------
  let [shippingProfile] = await fulfillmentModule.listShippingProfiles({
    type: "default",
  })
  if (!shippingProfile) {
    const { result } = await createShippingProfilesWorkflow(container).run({
      input: { data: [{ name: "Default Shipping Profile", type: "default" }] },
    })
    shippingProfile = result[0]
    logger.info("seed-base: created default shipping profile")
  }

  // --- 8. VN standard shipping option ----------------------------------------
  // (the module service's filterable props don't expose service_zone_id —
  // query.graph filters on the raw column instead)
  const { data: existingOptions } = await query.graph({
    entity: "shipping_option",
    fields: ["id"],
    filters: { service_zone_id: serviceZone.id },
  })
  if (!existingOptions.length) {
    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Giao hàng tiêu chuẩn",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: serviceZone.id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Standard",
            description: "Giao trong 2-3 ngày",
            code: "standard",
          },
          prices: [{ currency_code: "vnd", amount: 30000 }],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
      ],
    })
    logger.info("seed-base: created VN standard shipping option (30,000₫ flat)")
  }

  // --- 9. Publishable API key, linked to the sales channel -------------------
  // The Store API rejects a key that has no sales channel linked, so the link
  // matters as much as the key itself.
  let [apiKey] = await apiKeyModule.listApiKeys({ type: "publishable" })
  if (!apiKey) {
    const { result } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [{ title: "Webshop", type: "publishable", created_by: "" }],
      },
    })
    apiKey = result[0]
    logger.info("seed-base: created publishable API key")
  }

  const {
    data: [keyDetail],
  } = await query.graph({
    entity: "api_key",
    fields: ["id", "sales_channels.id"],
    filters: { id: apiKey.id },
  })
  if (!keyDetail.sales_channels?.length) {
    await linkSalesChannelsToApiKeyWorkflow(container).run({
      input: { id: apiKey.id, add: [salesChannel.id] },
    })
    logger.info("seed-base: linked publishable key to default sales channel")
  }

  logger.info("seed-base: done — base commerce data is in place.")
}
