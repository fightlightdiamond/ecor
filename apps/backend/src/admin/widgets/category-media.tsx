import { defineWidgetConfig } from "@medusajs/admin-sdk"
import type { HttpTypes } from "@medusajs/types"
import { useTranslation } from "react-i18next"
import EntityMediaWidget from "../components/entity-media-widget"
import { sdk } from "../lib/sdk"

type CategoryMediaWidgetProps = {
  data: HttpTypes.AdminProductCategory
}

const CategoryMediaWidget = ({ data }: CategoryMediaWidgetProps) => {
  const { t } = useTranslation()

  const thumbnail =
    typeof data.metadata?.thumbnail === "string" ? data.metadata.thumbnail : ""

  return (
    <EntityMediaWidget
      title={t("storefrontLink.category.mediaTitle")}
      hint={t("storefrontLink.category.mediaHint")}
      value={thumbnail}
      savedMessage={t("storefrontLink.mediaSaved")}
      errorMessage={t("storefrontLink.mediaSaveFailed")}
      onSave={async (url) => {
        await sdk.admin.productCategory.update(data.id, {
          metadata: { ...(data.metadata ?? {}), thumbnail: url || null },
        })
      }}
    />
  )
}

export const config = defineWidgetConfig({
  zone: "product_category.details.side.after",
})

export default CategoryMediaWidget
