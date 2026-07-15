import { getProductPrice } from "@lib/util/get-product-price"
import { Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import PreviewPrice from "@modules/products/components/product-preview/price"
import ProductGridAddButton from "@modules/landing/blocks/product-grid-add-button"
import type { HttpTypes } from "@medusajs/types"

function getQuickAddVariant(product: HttpTypes.StoreProduct) {
  const variants = product.variants ?? []
  if (!variants.length) {
    return null
  }

  if (variants.length === 1) {
    return variants[0]
  }

  return (
    variants.find((variant) => {
      if (!variant.manage_inventory) {
        return true
      }
      if (variant.allow_backorder) {
        return true
      }
      return (variant.inventory_quantity ?? 0) > 0
    }) ?? variants[0]
  )
}

function canAddVariant(variant: HttpTypes.StoreProductVariant) {
  if (!variant.manage_inventory) {
    return true
  }
  if (variant.allow_backorder) {
    return true
  }
  return (variant.inventory_quantity ?? 0) > 0
}

type ProductGridCardProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}

export default function ProductGridCard({ product }: ProductGridCardProps) {
  const { cheapestPrice } = getProductPrice({ product })
  const variant = getQuickAddVariant(product)
  const needsVariantSelection = (product.variants?.length ?? 0) > 1
  const hasPrice = Boolean(cheapestPrice)
  const canQuickAdd = Boolean(
    variant && canAddVariant(variant) && !needsVariantSelection && hasPrice
  )

  return (
    <article className="flex h-full flex-col group" data-testid="product-grid-card">
      <LocalizedClientLink href={`/products/${product.handle}`} className="flex-1">
        <div className="overflow-hidden rounded-soft bg-ui-bg-subtle">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured
          />
        </div>
        <div className="mt-4 flex flex-col gap-1">
          <Text
            className="font-display text-base text-ui-fg-base line-clamp-2 group-hover:text-brand-solid transition-colors"
            data-testid="product-title"
          >
            {product.title}
          </Text>
          <div className="text-sm text-ui-fg-subtle">
            {cheapestPrice ? <PreviewPrice price={cheapestPrice} /> : null}
          </div>
        </div>
      </LocalizedClientLink>

      <ProductGridAddButton
        variantId={variant?.id}
        productHandle={product.handle!}
        canQuickAdd={canQuickAdd}
        needsVariantSelection={needsVariantSelection}
        hasPrice={hasPrice}
      />
    </article>
  )
}
