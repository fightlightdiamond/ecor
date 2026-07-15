import { Suspense } from "react"

import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import {
  flattenNavigationItems,
  getStoreNavigation,
} from "@lib/data/navigation"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import { getTranslations } from "next-intl/server"

export default async function Nav() {
  const [regions, locales, currentLocale, t, navigationTree] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
    getTranslations("nav"),
    getStoreNavigation(),
  ])

  const menuItems = flattenNavigationItems(navigationTree)
  const fallbackItems = [
    { label: t("articles"), href: "/campaign-posts" },
    { label: t("account"), href: "/account" },
  ]
  const desktopItems =
    menuItems.length > 0
      ? menuItems.filter((item) => !["/", "/cart"].includes(item.href))
      : fallbackItems

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b border-brand-solid/15 bg-[#f2f4ed]/90 backdrop-blur-md duration-200">
        <nav className="content-container text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu
                regions={regions}
                locales={locales}
                currentLocale={currentLocale}
                menuItems={menuItems}
              />
            </div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="font-display text-base sm:text-lg tracking-wide text-ui-fg-base hover:text-brand-solid transition-colors"
              data-testid="nav-store-link"
            >
              {t("storeName")}
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              {desktopItems.map(({ label, href }) => (
                <LocalizedClientLink
                  key={href}
                  className="text-xs uppercase tracking-[0.14em] hover:text-brand-solid transition-colors"
                  href={href}
                  data-testid={`nav-${href.replace(/\//g, "") || "home"}-link`}
                >
                  {label}
                </LocalizedClientLink>
              ))}
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  {t("cart")} (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
