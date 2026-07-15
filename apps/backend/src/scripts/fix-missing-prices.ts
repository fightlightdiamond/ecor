import type { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows"

/**
 * Adds VND prices to published variants that have none (breaks add-to-cart).
 *
 *   npx medusa exec ./src/scripts/fix-missing-prices.ts
 */
export default async function fixMissingPrices({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: products } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "handle",
      "title",
      "variants.id",
      "variants.sku",
      "variants.price_set.prices.amount",
      "variants.price_set.prices.currency_code",
    ],
    filters: { status: "published" },
  })

  const FALLBACK_BY_HANDLE: Record<string, number> = {
    "tra-thai-nguyen-dac-biet": 180000,
  }

  const updates: {
    id: string
    variants: { id: string; prices: { amount: number; currency_code: string }[] }[]
  }[] = []

  for (const product of products ?? []) {
    const variantUpdates: {
      id: string
      prices: { amount: number; currency_code: string }[]
    }[] = []

    for (const variant of product.variants ?? []) {
      const prices = variant.price_set?.prices ?? []
      const hasVnd = prices.some(
        (p: { currency_code?: string }) => p.currency_code === "vnd"
      )
      if (hasVnd) continue

      const amount =
        FALLBACK_BY_HANDLE[product.handle] ??
        prices[0]?.amount ??
        99000

      variantUpdates.push({
        id: variant.id,
        prices: [{ amount, currency_code: "vnd" }],
      })
      logger.info(
        `Will set VND ${amount} on ${product.handle} (${variant.id})`
      )
    }

    if (variantUpdates.length) {
      updates.push({ id: product.id, variants: variantUpdates })
    }
  }

  if (!updates.length) {
    logger.info("No missing VND prices — nothing to do.")
    return
  }

  // updateProductsWorkflow accepts one product at a time in some versions
  for (const product of updates) {
    await updateProductsWorkflow(container).run({
      input: { products: [product] },
    })
  }

  logger.info(`Fixed prices on ${updates.length} product(s).`)
}
