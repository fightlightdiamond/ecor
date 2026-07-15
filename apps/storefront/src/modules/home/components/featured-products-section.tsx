import FeaturedProducts from "@modules/home/components/featured-products"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export default async function FeaturedProductsSection({
  countryCode,
}: {
  countryCode: string
}) {
  const [region, { collections }] = await Promise.all([
    getRegion(countryCode),
    listCollections({ fields: "id, handle, title" }),
  ])

  if (!collections?.length || !region) {
    return null
  }

  return (
    <div className="py-12">
      <ul className="flex flex-col gap-x-6">
        <FeaturedProducts collections={collections} region={region} />
      </ul>
    </div>
  )
}
