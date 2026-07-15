import type { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows"

/**
 * Restores thumbnail/images for tea products that are missing media.
 *
 *   npx medusa exec ./src/scripts/fix-tea-product-media.ts
 */
export default async function fixTeaProductMedia({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const IMAGE =
    "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=1200&q=80"

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "handle", "thumbnail", "images.url"],
    filters: { handle: "tra-thai-nguyen-dac-biet" },
  })

  const product = products?.[0]
  if (!product) {
    logger.warn("Product tra-thai-nguyen-dac-biet not found")
    return
  }

  const hasImage = Boolean(product.thumbnail || product.images?.length)
  if (hasImage) {
    logger.info("Product already has media — skip")
    return
  }

  await updateProductsWorkflow(container).run({
    input: {
      products: [
        {
          id: product.id,
          thumbnail: IMAGE,
          images: [{ url: IMAGE }],
        },
      ],
    },
  })

  logger.info(`Restored media for ${product.handle}`)
}
