import { defineWidgetConfig } from "@medusajs/admin-sdk"
import type { HttpTypes } from "@medusajs/types"
import { useTranslation } from "react-i18next"
import EntityMediaWidget from "../components/entity-media-widget"
import { sdk } from "../lib/sdk"

type CollectionMediaWidgetProps = {
  data: HttpTypes.AdminCollection
}

const CollectionMediaWidget = ({ data }: CollectionMediaWidgetProps) => {
  const { t } = useTranslation()

  const thumbnail =
    typeof data.metadata?.thumbnail === "string" ? data.metadata.thumbnail : ""

  return (
    <EntityMediaWidget
      title={t("storefrontLink.collection.mediaTitle")}
      hint={t("storefrontLink.collection.mediaHint")}
      value={thumbnail}
      savedMessage={t("storefrontLink.mediaSaved")}
      errorMessage={t("storefrontLink.mediaSaveFailed")}
      onSave={async (url) => {
        await sdk.admin.productCollection.update(data.id, {
          metadata: { ...(data.metadata ?? {}), thumbnail: url || null },
        })
      }}
    />
  )
}

export const config = defineWidgetConfig({
  zone: "product_collection.details.after",
})

export default CollectionMediaWidget
