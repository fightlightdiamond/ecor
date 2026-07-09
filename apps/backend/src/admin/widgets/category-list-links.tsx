import { defineWidgetConfig } from "@medusajs/admin-sdk"
import type { DataTablePaginationState } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import StorefrontLinksTable, {
  type StorefrontLinkRow,
} from "../components/storefront-links-table"
import { sdk } from "../lib/sdk"

const fetchPage = async (
  pagination: DataTablePaginationState
): Promise<{ rows: StorefrontLinkRow[], count: number }> => {
  const res = await sdk.admin.productCategory.list({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    fields: "id,name,handle,metadata",
  })

  return {
    rows: res.product_categories.map((c) => ({
      id: c.id,
      name: c.name,
      handle: c.handle ?? null,
      thumbnail: typeof c.metadata?.thumbnail === "string" ? c.metadata.thumbnail : null,
    })),
    count: res.count,
  }
}

const CategoryListLinksWidget = () => {
  const { t } = useTranslation()

  return (
    <StorefrontLinksTable
      title={t("storefrontLink.list.categoryTitle")}
      hint={t("storefrontLink.list.hint")}
      basePath="/san-pham/danh-muc"
      queryKey="category-storefront-links"
      fetchPage={fetchPage}
    />
  )
}

export const config = defineWidgetConfig({
  zone: "product_category.list.after",
})

export default CategoryListLinksWidget
