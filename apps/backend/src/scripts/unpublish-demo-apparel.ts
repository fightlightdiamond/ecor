import type { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  ProductStatus,
} from "@medusajs/framework/utils"
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows"

/** Demo Medusa starter apparel — not relevant for Thăng Long Chè Việt. */
const DEMO_HANDLES = [
  "sweatpants",
  "shorts",
  "t-shirt",
  "sweatshirt",
  "medusa-t-shirt",
  "medusa-sweatshirt",
  "medusa-sweatpants",
  "medusa-shorts",
]

/**
 *   npx medusa exec ./src/scripts/unpublish-demo-apparel.ts
 */
export default async function unpublishDemoApparel({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: byHandle } = await query.graph({
    entity: "product",
    fields: ["id", "handle", "title", "status"],
    filters: { handle: DEMO_HANDLES },
  })

  const { data: allPublished } = await query.graph({
    entity: "product",
    fields: ["id", "handle", "title", "status"],
    filters: { status: "published" },
  })

  const apparel = new Map<string, { id: string; handle: string; title: string }>()
  for (const p of byHandle ?? []) {
    apparel.set(p.id, p)
  }
  for (const p of allPublished ?? []) {
    const title = (p.title || "").toLowerCase()
    const handle = (p.handle || "").toLowerCase()
    if (
      title.startsWith("medusa ") ||
      handle.includes("t-shirt") ||
      handle.includes("sweat") ||
      handle.includes("shorts")
    ) {
      apparel.set(p.id, p)
    }
  }

  const products = Array.from(apparel.values())
  if (!products.length) {
    logger.info("No demo apparel products found — skip.")
    return
  }

  await updateProductsWorkflow(container).run({
    input: {
      products: products.map((p) => ({
        id: p.id,
        status: ProductStatus.DRAFT,
      })),
    },
  })

  for (const p of products) {
    logger.info(`Unpublished ${p.handle}`)
  }
}
