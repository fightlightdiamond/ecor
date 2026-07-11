import type { ExecArgs } from "@medusajs/framework/types"

const NAVIGATION_MODULE = "navigation"
const NAVIGATION_NAME = "storefront-header"

const DEFAULT_ITEMS = [
  { name: "Trang chủ", url: "/", index: 0 },
  { name: "Cửa hàng", url: "/store", index: 1 },
  { name: "Bài viết", url: "/campaign-posts", index: 2 },
  { name: "Tài khoản", url: "/account", index: 3 },
  { name: "Giỏ hàng", url: "/cart", index: 4 },
]

export default async function seedNavigation({ container }: ExecArgs) {
  const navigationService = container.resolve(NAVIGATION_MODULE) as {
    listNavigations: (filters?: { name?: string }) => Promise<{ id: string; name: string }[]>
    createNestedNavigation: (
      service: unknown,
      name: string,
      items: typeof DEFAULT_ITEMS,
    ) => Promise<{ id: string; name: string }>
  }

  const existing = await navigationService.listNavigations({ name: NAVIGATION_NAME })

  if (existing.length) {
    console.log(
      `Navigation "${NAVIGATION_NAME}" already exists (id: ${existing[0].id}).`,
    )
    console.log(`Set in .env: NEXT_PUBLIC_MEDUSA_NAVIGATION_ID=${existing[0].id}`)
    return
  }

  const navigation = await navigationService.createNestedNavigation(
    navigationService,
    NAVIGATION_NAME,
    DEFAULT_ITEMS,
  )

  console.log(`Created navigation "${NAVIGATION_NAME}" (id: ${navigation.id}).`)
  console.log(`Set in .env: NEXT_PUBLIC_MEDUSA_NAVIGATION_ID=${navigation.id}`)
}
