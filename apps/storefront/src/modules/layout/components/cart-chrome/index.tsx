import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"

export default async function CartChrome() {
  const [customer, cart] = await Promise.all([retrieveCustomer(), retrieveCart()])

  if (!cart) {
    return null
  }

  const { shipping_options } = await listCartOptions()

  return (
    <>
      {customer ? <CartMismatchBanner customer={customer} cart={cart} /> : null}
      <FreeShippingPriceNudge
        variant="popup"
        cart={cart}
        shippingOptions={shipping_options}
      />
    </>
  )
}
