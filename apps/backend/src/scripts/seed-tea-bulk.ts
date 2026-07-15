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

type TeaDef = {
  title: string
  handle: string
  description: string
  collection: string
  price: number
  weight: number
  image: string
}

const COLLECTIONS = [
  { title: "Trà thượng hạng", handle: "tra-thuong-hang" },
  { title: "Black Friday Sale", handle: "black-friday-sale" },
  { title: "Quà tặng", handle: "qua-tang" },
  { title: "Trà sen & hoa", handle: "tra-sen-hoa" },
  { title: "Trà Everyday", handle: "tra-everyday" },
]

const IMAGES = [
  "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1571934811356-5cc06116f564?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1594631252845-29fc4cc8c2a1?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1556678727-4f8f6a55e9c1?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80",
]

function buildCatalog(): TeaDef[] {
  const items: TeaDef[] = []

  const premium = [
    ["Trà Thái Nguyên Đặc Biệt", "tra-thai-nguyen-dac-biet", 180000],
    ["Trà Tân Cương Tước Thiệt", "tra-tan-cuong-tuoc-thiet", 220000],
    ["Trà Đinh Ngọc", "tra-dinh-ngoc", 260000],
    ["Trà Móc Câu Hảo Hạng", "tra-moc-cau-hao-hang", 240000],
    ["Trà Nõn Tôm", "tra-non-tom", 280000],
    ["Trà Shan Tuyết Hà Giang", "tra-shan-tuyet-ha-giang", 320000],
    ["Trà Cổ Thụ Suối Giàng", "tra-co-thu-suoi-giang", 350000],
    ["Trà Tôm Nõn Thái Nguyên", "tra-tom-non-thai-nguyen", 210000],
  ] as const

  for (const [title, handle, price] of premium) {
    items.push({
      title,
      handle,
      description: `${title} — hương rõ, nước trong, hậu ngọt. Đóng gói 100g.`,
      collection: "tra-thuong-hang",
      price,
      weight: 100,
      image: IMAGES[items.length % IMAGES.length],
    })
  }

  const sen = [
    ["Trà Sen Tây Hồ", "tra-sen-tay-ho", 350000],
    ["Trà Sen Thủ Công", "tra-sen-thu-cong", 380000],
    ["Trà Hoa Nhài", "tra-hoa-nhai", 190000],
    ["Trà Hoa Cúc", "tra-hoa-cuc", 160000],
    ["Trà Hoa Hồng", "tra-hoa-hong", 175000],
    ["Trà Lài Ướp Lạnh", "tra-lai-uop-lanh", 200000],
  ] as const

  for (const [title, handle, price] of sen) {
    items.push({
      title,
      handle,
      description: `${title} — hương hoa thanh, pha nóng hoặc lạnh đều ngon.`,
      collection: "tra-sen-hoa",
      price,
      weight: 100,
      image: IMAGES[items.length % IMAGES.length],
    })
  }

  const everyday = [
    ["Trà Xanh Everyday", "tra-xanh-everyday", 99000],
    ["Trà Đậm Everyday", "tra-dam-everyday", 89000],
    ["Ô Long Everyday", "o-long-everyday", 120000],
    ["Trà Túi Lọc Thái Nguyên (20 gói)", "tra-tui-loc-thai-nguyen-20", 79000],
    ["Trà Túi Lọc Sen (20 gói)", "tra-tui-loc-sen-20", 85000],
    ["Trà Gói Dùng Thử 50g", "tra-goi-dung-thu-50g", 59000],
    ["Combo Thử 3 vị 50g", "combo-thu-3-vi-50g", 149000],
    ["Trà Văn Phòng Tip", "tra-van-phong-tip", 69000],
  ] as const

  for (const [title, handle, price] of everyday) {
    items.push({
      title,
      handle,
      description: `${title} — tiện dụng cho dùng hàng ngày.`,
      collection: "tra-everyday",
      price,
      weight: title.includes("50g") ? 50 : 100,
      image: IMAGES[items.length % IMAGES.length],
    })
  }

  const gifts = [
    ["Hộp quà Tết Tinh Hoa", "hop-qua-tet-tinh-hoa", 550000],
    ["Hộp quà Trung Thu Trà Việt", "hop-qua-trung-thu-tra-viet", 480000],
    ["Set Doanh Nghiệp Classic", "set-doanh-nghiep-classic", 650000],
    ["Set Doanh Nghiệp Premium", "set-doanh-nghiep-premium", 980000],
    ["Hộp Đôi Thái Nguyên + Sen", "hop-doi-thai-nguyen-sen", 720000],
    ["Hộp Mini Biếu Bạn", "hop-mini-bieu-ban", 290000],
    ["Set Ấm Chén + Trà 100g", "set-am-chen-tra-100g", 890000],
    ["Hộp Gỗ Khắc Logo", "hop-go-khac-logo", 1200000],
  ] as const

  for (const [title, handle, price] of gifts) {
    items.push({
      title,
      handle,
      description: `${title} — đóng gói quà tặng, hỗ trợ in logo số lượng lớn.`,
      collection: "qua-tang",
      price,
      weight: 500,
      image: IMAGES[items.length % IMAGES.length],
    })
  }

  const bf = [
    ["Trà Ô Long Hương", "tra-o-long-huong", 220000],
    ["Flash Sale Tân Cương 100g", "flash-sale-tan-cuong-100g", 129000],
    ["Flash Sale Sen 100g", "flash-sale-sen-100g", 199000],
    ["Combo Black Friday 3 gói", "combo-black-friday-3-goi", 299000],
    ["Ô Long Sale 30%", "o-long-sale-30", 145000],
    ["Trà Đậm Sale Cuối Tuần", "tra-dam-sale-cuoi-tuan", 99000],
    ["Mystery Tea Box", "mystery-tea-box", 249000],
    ["Bundle Gia Đình 4 vị", "bundle-gia-dinh-4-vi", 399000],
  ] as const

  for (const [title, handle, price] of bf) {
    items.push({
      title,
      handle,
      description: `${title} — ưu đãi có thời hạn, số lượng giới hạn.`,
      collection: "black-friday-sale",
      price,
      weight: 100,
      image: IMAGES[items.length % IMAGES.length],
    })
  }

  // Extra numbered SKUs for stress-testing store listing / filters
  for (let i = 1; i <= 20; i++) {
    const n = String(i).padStart(2, "0")
    items.push({
      title: `Trà Sample Batch ${n}`,
      handle: `tra-sample-batch-${n}`,
      description: `Mẫu thử số ${n} — dùng để test listing và phân trang.`,
      collection: i % 2 === 0 ? "tra-everyday" : "tra-thuong-hang",
      price: 50000 + i * 3000,
      weight: 50,
      image: IMAGES[i % IMAGES.length],
    })
  }

  return items
}

/**
 * Seeds many tea collections + products for storefront testing.
 *
 *   cd apps/backend
 *   npx medusa exec ./src/scripts/seed-tea-bulk.ts
 */
export default async function seedTeaBulk({ container }: ExecArgs) {
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
    fields: ["id", "handle"],
  })

  const byHandle = new Map(
    (existingCollections ?? []).map((c: { handle: string; id: string }) => [
      c.handle,
      c.id,
    ])
  )

  const missingCollections = COLLECTIONS.filter((c) => !byHandle.has(c.handle))
  if (missingCollections.length) {
    const { result } = await createCollectionsWorkflow(container).run({
      input: { collections: missingCollections },
    })
    for (const col of result) {
      byHandle.set(col.handle, col.id)
    }
    logger.info(`Created ${result.length} collection(s).`)
  }

  const catalog = buildCatalog()
  const handles = catalog.map((p) => p.handle)

  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
    filters: { handle: handles },
  })

  const existingHandles = new Set(
    (existingProducts ?? []).map((p: { handle: string }) => p.handle)
  )

  const toCreate = catalog.filter((p) => !existingHandles.has(p.handle))
  if (!toCreate.length) {
    logger.info(`All ${catalog.length} bulk tea products already exist — skip.`)
    return
  }

  // Create in chunks to avoid huge single workflow payloads
  const chunkSize = 10
  let created = 0
  for (let i = 0; i < toCreate.length; i += chunkSize) {
    const chunk = toCreate.slice(i, i + chunkSize)
    await createProductsWorkflow(container).run({
      input: {
        products: chunk.map((p) => ({
          title: p.title,
          handle: p.handle,
          description: p.description,
          status: ProductStatus.PUBLISHED,
          collection_id: byHandle.get(p.collection)!,
          weight: p.weight,
          ...(shippingProfile
            ? { shipping_profile_id: shippingProfile.id }
            : {}),
          images: [{ url: p.image }],
          options: [{ title: "Loại", values: ["Mặc định"] }],
          variants: [
            {
              title: "Mặc định",
              sku: `${p.handle}-DEFAULT`.slice(0, 50).toUpperCase(),
              options: { Loại: "Mặc định" },
              prices: [{ amount: p.price, currency_code: "vnd" }],
              manage_inventory: false,
            },
          ],
          sales_channels: [{ id: salesChannel.id }],
        })),
      },
    })
    created += chunk.length
    logger.info(`Created products ${created}/${toCreate.length}`)
  }

  logger.info(
    `Bulk seed done: ${created} new product(s), ${COLLECTIONS.length} collections.`
  )
}
