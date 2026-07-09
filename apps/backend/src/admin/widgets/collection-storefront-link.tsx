import { defineWidgetConfig } from "@medusajs/admin-sdk"
import type { HttpTypes } from "@medusajs/types"
import { useTranslation } from "react-i18next"
import StorefrontLinkWidget from "../components/storefront-link-widget"

type CollectionWidgetProps = {
  data: HttpTypes.AdminCollection
}

const CollectionStorefrontLinkWidget = ({ data }: CollectionWidgetProps) => {
  const { t } = useTranslation()

  return (
    <StorefrontLinkWidget
      title={t("storefrontLink.collection.title")}
      hint={t("storefrontLink.collection.hint")}
      path={data.handle ? `/san-pham/bo-suu-tap/${data.handle}` : null}
    />
  )
}

export const config = defineWidgetConfig({
  zone: "product_collection.details.after",
})

export default CollectionStorefrontLinkWidget
