import { getCollectionByHandle } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { Heading, clx } from "@modules/common/components/ui"
import ProductGridCard from "@modules/landing/blocks/product-grid-card"
import type { HttpTypes } from "@medusajs/types"
import type { ProductGridBlock } from "@types/strapi-blocks"

type ProductGridBlockProps = {
  block: ProductGridBlock
  countryCode: string
  region: HttpTypes.StoreRegion
}

/**
 * Loads products live from Medusa. Invalid handle or API errors hide the block
 * without crashing the page (SRS §5.4).
 */
export default async function ProductGridBlock({
  block,
  countryCode: _countryCode,
  region,
}: ProductGridBlockProps) {
  try {
    const handle = block.medusa_collection_handle?.trim()

    if (!handle) {
      return null
    }

    const collection = await getCollectionByHandle(handle).catch(() => null)

    if (!collection) {
      return null
    }

    // Cap for LCP / RSC payload size (CMS may request 8+)
    const limit = Math.min(block.limit ?? 4, 8)

    const {
      response: { products },
    } = await listProducts({
      regionId: region.id,
      queryParams: {
        collection_id: collection.id,
        limit,
        fields:
          "id,title,handle,thumbnail,*images,*variants.calculated_price,+variants.inventory_quantity",
      },
    }).catch(() => ({ response: { products: [] as HttpTypes.StoreProduct[] } }))

    if (!products?.length) {
      return null
    }

    const isSlider = block.layout === "Slider"

    return (
      <section className="content-container py-16 small:py-20">
        {block.heading ? (
          <Heading
            level="h2"
            className="font-display text-3xl sm:text-4xl font-medium tracking-tight mb-10"
          >
            {block.heading}
          </Heading>
        ) : null}

        <ul
          className={clx(
            isSlider
              ? "flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
              : "grid grid-cols-2 small:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10"
          )}
        >
          {products.map((product) => (
            <li
              key={product.id}
              className={clx(
                isSlider && "min-w-[220px] sm:min-w-[260px] snap-start shrink-0"
              )}
            >
              <ProductGridCard product={product} region={region} />
            </li>
          ))}
        </ul>
      </section>
    )
  } catch (error) {
    console.error(
      `[ProductGridBlock] Failed for handle "${block.medusa_collection_handle}":`,
      error
    )
    return null
  }
}
