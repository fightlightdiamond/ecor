"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"

import { addToCart } from "@lib/data/cart"
import { Button, Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductGridAddButtonProps = {
  variantId?: string | null
  productHandle: string
  canQuickAdd: boolean
  needsVariantSelection: boolean
  hasPrice: boolean
}

export default function ProductGridAddButton({
  variantId,
  productHandle,
  canQuickAdd,
  needsVariantSelection,
  hasPrice,
}: ProductGridAddButtonProps) {
  const router = useRouter()
  const countryCode = useParams().countryCode as string
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddToCart = async () => {
    if (!canQuickAdd || !variantId) {
      return
    }

    setIsAdding(true)
    setError(null)
    try {
      await addToCart({
        variantId,
        quantity: 1,
        countryCode,
      })
      router.refresh()
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Không thêm được vào giỏ. Thử lại."
      )
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="mt-4 flex flex-col gap-2">
      {canQuickAdd ? (
        <Button
          variant="secondary"
          className="w-full min-h-[44px] border-brand-solid/30 hover:bg-brand-solid hover:text-white hover:border-brand-solid"
          disabled={isAdding}
          onClick={handleAddToCart}
          isLoading={isAdding}
        >
          Thêm vào giỏ
        </Button>
      ) : (
        <LocalizedClientLink href={`/products/${productHandle}`} className="block">
          <Button variant="secondary" className="w-full min-h-[44px]">
            {needsVariantSelection
              ? "Chọn biến thể"
              : !hasPrice
                ? "Liên hệ giá"
                : "Xem sản phẩm"}
          </Button>
        </LocalizedClientLink>
      )}
      {error ? (
        <Text className="text-xs text-red-700" role="alert">
          {error}
        </Text>
      ) : null}
    </div>
  )
}
