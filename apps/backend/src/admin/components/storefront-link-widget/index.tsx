import { Container, Copy, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

type StorefrontLinkWidgetProps = {
  title: string
  hint: string
  /** Domain-relative path to the listing page on the storefront, or null while the handle is missing. */
  path: string | null
}

const StorefrontLinkWidget = ({ title, hint, path }: StorefrontLinkWidgetProps) => {
  const { t } = useTranslation()

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{title}</Heading>
      </div>
      <div className="flex flex-col gap-y-2 px-6 py-4">
        <Text size="small" leading="compact" className="text-ui-fg-subtle">
          {hint}
        </Text>
        {path
          ? (
              <div className="bg-ui-bg-subtle flex items-center justify-between gap-x-2 rounded-md border px-3 py-2">
                <Text size="small" leading="compact" className="text-ui-fg-base font-mono truncate">
                  {path}
                </Text>
                <Copy content={path} />
              </div>
            )
          : (
              <Text size="small" leading="compact" className="text-ui-fg-muted">
                {t("storefrontLink.noHandle")}
              </Text>
            )}
      </div>
    </Container>
  )
}

export default StorefrontLinkWidget
