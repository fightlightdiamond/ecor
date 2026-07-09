import { defineWidgetConfig } from "@medusajs/admin-sdk"
import type { HttpTypes } from "@medusajs/types"
import { useTranslation } from "react-i18next"
import StorefrontLinkWidget from "../components/storefront-link-widget"

type CategoryWidgetProps = {
  data: HttpTypes.AdminProductCategory
}

const CategoryStorefrontLinkWidget = ({ data }: CategoryWidgetProps) => {
  const { t } = useTranslation()

  return (
    <StorefrontLinkWidget
      title={t("storefrontLink.category.title")}
      hint={t("storefrontLink.category.hint")}
      path={data.handle ? `/san-pham/danh-muc/${data.handle}` : null}
    />
  )
}

export const config = defineWidgetConfig({
  zone: "product_category.details.side.after",
})

export default CategoryStorefrontLinkWidget
