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
  const res = await sdk.admin.productCollection.list({
    limit: pagination.pageSize,
    offset: pagination.pageIndex * pagination.pageSize,
    fields: "id,title,handle,metadata",
  })

  return {
    rows: res.collections.map((c) => ({
      id: c.id,
      name: c.title,
      handle: c.handle ?? null,
      thumbnail: typeof c.metadata?.thumbnail === "string" ? c.metadata.thumbnail : null,
    })),
    count: res.count,
  }
}

const CollectionListLinksWidget = () => {
  const { t } = useTranslation()

  return (
    <StorefrontLinksTable
      title={t("storefrontLink.list.collectionTitle")}
      hint={t("storefrontLink.list.hint")}
      basePath="/san-pham/bo-suu-tap"
      queryKey="collection-storefront-links"
      fetchPage={fetchPage}
    />
  )
}

export const config = defineWidgetConfig({
  zone: "product_collection.list.after",
})

export default CollectionListLinksWidget
