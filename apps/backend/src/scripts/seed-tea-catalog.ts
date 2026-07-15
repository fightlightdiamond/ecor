import type { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createCollectionsWorkflow,
  createProductsWorkflow,
} from "@medusajs/medusa/core-flows"

/**
 * Seeds tea collections + products for the Strapi Product Grid blocks.
 * Handles: tra-thuong-hang, black-friday-sale
 *
 * Run:
 *   cd apps/backend
 *   npx medusa exec ./src/scripts/seed-tea-catalog.ts
 */
export default async function seedTeaCatalog({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL)
  const fulfillmentModule = container.resolve(Modules.FULFILLMENT)

  const [salesChannel] = await salesChannelModule.listSalesChannels({
    name: "Default Sales Channel",
  })
  if (!salesChannel) {
    throw new Error("Default Sales Channel missing — run seed-base first.")
  }

  const shippingProfiles = await fulfillmentModule.listShippingProfiles({
    type: "default",
  })
  const shippingProfile = shippingProfiles[0]

  const { data: existingCollections } = await query.graph({
    entity: "product_collection",
    fields: ["id", "handle", "title"],
  })

  const byHandle = new Map(
    (existingCollections ?? []).map((c: { handle: string; id: string }) => [
      c.handle,
      c.id,
    ])
  )

  const needed = [
    {
      title: "Trà thượng hạng",
      handle: "tra-thuong-hang",
      metadata: { locale: "vi" },
    },
    {
      title: "Black Friday Sale",
      handle: "black-friday-sale",
      metadata: { locale: "vi" },
    },
  ]

  const toCreate = needed.filter((c) => !byHandle.has(c.handle))
  if (toCreate.length) {
    const { result } = await createCollectionsWorkflow(container).run({
      input: { collections: toCreate },
    })
    for (const col of result) {
      byHandle.set(col.handle, col.id)
      logger.info(`Created collection ${col.handle}`)
    }
  } else {
    logger.info("Collections already exist — skip create.")
  }

  const productDefs = [
    {
      title: "Trà Thái Nguyên Đặc Biệt",
      handle: "tra-thai-nguyen-dac-biet",
      description:
        "Chè Tân Cương hảo hạng — hương cốm non, nước vàng óng, hậu ngọt lâu.",
      collection: "tra-thuong-hang",
      weight: 100,
      image:
        "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=1200&q=80",
      optionTitle: "Khối lượng",
      optionValue: "100g",
      sku: "TRA-TN-100",
      price: 180000,
    },
    {
      title: "Trà Sen Tây Hồ",
      handle: "tra-sen-tay-ho",
      description:
        "Ướp thủ công với cánh sen hồ Tây — hương thanh khiết, vị dịu.",
      collection: "tra-thuong-hang",
      weight: 100,
      image:
        "https://images.unsplash.com/photo-1571934811356-5cc06116f564?auto=format&fit=crop&w=1200&q=80",
      optionTitle: "Khối lượng",
      optionValue: "100g",
      sku: "TRA-SEN-100",
      price: 350000,
    },
    {
      title: "Trà Ô Long Hương",
      handle: "tra-o-long-huong",
      description: "Ô long lên men nhẹ — hương hoa, uống lạnh cũng ngon.",
      collection: "black-friday-sale",
      weight: 100,
      image:
        "https://images.unsplash.com/photo-1594631252845-29fc4cc8c2a1?auto=format&fit=crop&w=1200&q=80",
      optionTitle: "Khối lượng",
      optionValue: "100g",
      sku: "TRA-OL-100",
      price: 220000,
    },
    {
      title: "Hộp quà Tết Tinh Hoa",
      handle: "hop-qua-tet-tinh-hoa",
      description:
        "Set quà gồm trà Thái Nguyên + trà sen — hộp cứng in logo theo yêu cầu.",
      collection: "black-friday-sale",
      weight: 500,
      image:
        "https://images.unsplash.com/photo-1556678727-4f8f6a55e9c1?auto=format&fit=crop&w=1200&q=80",
      optionTitle: "Loại",
      optionValue: "Hộp",
      sku: "QUA-TET-01",
      price: 550000,
    },
  ] as const

  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
    filters: {
      handle: productDefs.map((p) => p.handle),
    },
  })

  const existingHandles = new Set(
    (existingProducts ?? []).map((p: { handle: string }) => p.handle)
  )

  const productsToCreate = productDefs
    .filter((p) => !existingHandles.has(p.handle))
    .map((p) => ({
      title: p.title,
      handle: p.handle,
      description: p.description,
      status: ProductStatus.PUBLISHED,
      collection_id: byHandle.get(p.collection)!,
      weight: p.weight,
      ...(shippingProfile ? { shipping_profile_id: shippingProfile.id } : {}),
      images: [{ url: p.image }],
      options: [{ title: p.optionTitle, values: [p.optionValue] }],
      variants: [
        {
          title: p.optionValue,
          sku: p.sku,
          options: { [p.optionTitle]: p.optionValue },
          prices: [{ amount: p.price, currency_code: "vnd" }],
          manage_inventory: false,
        },
      ],
      sales_channels: [{ id: salesChannel.id }],
    }))

  if (!productsToCreate.length) {
    logger.info("All tea products already exist — skip product create.")
    return
  }

  await createProductsWorkflow(container).run({
    input: { products: productsToCreate },
  })

  logger.info(
    `Seeded ${productsToCreate.length} tea product(s) into tra-thuong-hang / black-friday-sale.`
  )
}
