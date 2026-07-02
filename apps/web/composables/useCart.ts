import type { Product } from '~/utils/storefront'
import { parseApiError } from '~/utils/storefront'

export interface CartItem {
  id: string
  product_id: string
  quantity: number
  product?: Product
}

export interface Cart {
  id: string
  region_id: string
}

interface MedusaLineItem {
  id: string
  product_id: string
  product_title: string
  product_handle: string
  thumbnail: string | null
  quantity: number
  unit_price: number
}

interface MedusaCart {
  id: string
  region_id: string
  email: string | null
  total: number
  items: MedusaLineItem[]
}

function mapLineItem(item: MedusaLineItem): CartItem {
  return {
    id: item.id,
    product_id: item.product_id,
    quantity: item.quantity,
    product: {
      id: item.product_id,
      variantId: '',
      slug: item.product_handle,
      price: item.unit_price,
      image: item.thumbnail ?? '',
      gallery: item.thumbnail ? [item.thumbnail] : [],
      title: item.product_title,
      shortDesc: '',
      description: '',
      features: [],
      categoryId: null,
      inStock: true,
    },
  }
}

export function useCart() {
  const { fetchMedusa, regionId } = useMedusaApi()
  const { t } = useAppI18n()

  const cartId = useCookie<string | null>('medusa_cart_id', { maxAge: 60 * 60 * 24 * 30 })
  const cart = useState<Cart | null>('cart', () => null)
  const items = useState<CartItem[]>('cart_items', () => [])
  const loading = ref(false)
  const toast = useState<string | null>('cart_toast', () => null)

  const applyCart = (medusaCart: MedusaCart) => {
    cart.value = { id: medusaCart.id, region_id: medusaCart.region_id }
    items.value = (medusaCart.items ?? []).map(mapLineItem)
    cartId.value = medusaCart.id
  }

  const createCart = async () => {
    const res = await fetchMedusa<{ cart: MedusaCart }>('/store/carts', {
      method: 'POST',
      body: { region_id: regionId },
    })
    applyCart(res.cart)
    return res.cart
  }

  const fetchCart = async () => {
    loading.value = true
    try {
      if (!cartId.value) {
        await createCart()
        return
      }
      try {
        const res = await fetchMedusa<{ cart: MedusaCart }>(`/store/carts/${cartId.value}`)
        applyCart(res.cart)
      } catch {
        // Cart likely completed/expired — start a fresh one.
        await createCart()
      }
    } catch (err) {
      console.error('Failed to fetch cart', err)
    } finally {
      loading.value = false
    }
  }

  const ensureCart = async () => {
    if (!cart.value) await fetchCart()
    return cart.value!
  }

  const addToCart = async (variantId: string, quantity = 1) => {
    loading.value = true
    try {
      const current = await ensureCart()
      const res = await fetchMedusa<{ cart: MedusaCart }>(`/store/carts/${current.id}/line-items`, {
        method: 'POST',
        body: { variant_id: variantId, quantity },
      })
      applyCart(res.cart)
      const message = t('cart.added')
      toast.value = message
      return { success: true, message }
    } catch (err) {
      console.error('Failed to add to cart', err)
      return { success: false, message: parseApiError(err, t('cart.addError')) }
    } finally {
      loading.value = false
    }
  }

  const updateCart = async (itemId: string, quantity: number) => {
    if (!cart.value) return
    loading.value = true
    try {
      const res = await fetchMedusa<{ cart: MedusaCart }>(`/store/carts/${cart.value.id}/line-items/${itemId}`, {
        method: 'POST',
        body: { quantity },
      })
      applyCart(res.cart)
    } catch (err) {
      console.error('Failed to update cart', err)
    } finally {
      loading.value = false
    }
  }

  const removeFromCart = async (itemId: string) => {
    if (!cart.value) return
    loading.value = true
    try {
      const res = await fetchMedusa<{ parent: MedusaCart }>(`/store/carts/${cart.value.id}/line-items/${itemId}`, {
        method: 'DELETE',
      })
      applyCart(res.parent)
    } catch (err) {
      console.error('Failed to remove from cart', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Runs Medusa's full guest checkout sequence: set contact/shipping info,
   * pick the (single, Vietnam) shipping option, open a manual/system payment
   * session, then complete the cart into an order.
   *
   * NOT wired up here (kept out of scope for this integration pass):
   *  - Coupon codes (useCoupon.ts) are validated against the old NestJS API
   *    only — they are NOT applied to the Medusa order.
   *  - Order tracking (useOrder.ts) looks up orders in the old NestJS system
   *    and will not find orders placed through this Medusa checkout.
   */
  const checkout = async (data: {
    name: string
    phone: string
    address: string
    email?: string
    coupon_code?: string
    payment_method?: string
  }) => {
    loading.value = true
    try {
      const current = await ensureCart()
      const [firstName, ...rest] = data.name.trim().split(/\s+/)

      await fetchMedusa(`/store/carts/${current.id}`, {
        method: 'POST',
        body: {
          email: data.email || 'khach@thanglongcheviet.vn',
          shipping_address: {
            first_name: firstName || data.name,
            last_name: rest.join(' ') || data.name,
            address_1: data.address,
            city: 'Hà Nội',
            country_code: 'vn',
            phone: data.phone,
          },
        },
      })

      const { shipping_options } = await fetchMedusa<{ shipping_options: { id: string }[] }>(
        `/store/shipping-options?cart_id=${current.id}`,
      )
      const option = shipping_options[0]
      if (!option) throw new Error('No shipping option available for this cart')
      await fetchMedusa(`/store/carts/${current.id}/shipping-methods`, {
        method: 'POST',
        body: { option_id: option.id },
      })

      const { payment_collection } = await fetchMedusa<{ payment_collection: { id: string } }>(
        '/store/payment-collections',
        { method: 'POST', body: { cart_id: current.id } },
      )
      await fetchMedusa(`/store/payment-collections/${payment_collection.id}/payment-sessions`, {
        method: 'POST',
        body: { provider_id: 'pp_system_default' },
      })

      const result = await fetchMedusa<{ type: string, order?: { display_id: number }, error?: { message: string } }>(
        `/store/carts/${current.id}/complete`,
        { method: 'POST' },
      )

      if (result.type !== 'order' || !result.order) {
        throw new Error(result.error?.message || 'Checkout failed')
      }

      cartId.value = null
      cart.value = null
      items.value = []

      return {
        success: true,
        message: t('cart.orderSuccess', { number: String(result.order.display_id) }),
        orderNumber: String(result.order.display_id),
        paymentUrl: null as string | null,
      }
    } catch (err) {
      console.error('Checkout failed', err)
      return {
        success: false,
        message: parseApiError(err, t('cart.checkoutError')),
        orderNumber: null as string | null,
        paymentUrl: null as string | null,
      }
    } finally {
      loading.value = false
    }
  }

  const totalItems = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const totalPrice = computed(() => items.value.reduce((sum, item) => sum + (item.quantity * (item.product?.price || 0)), 0))

  return {
    cart,
    items,
    loading,
    toast,
    totalItems,
    totalPrice,
    fetchCart,
    addToCart,
    updateCart,
    removeFromCart,
    checkout,
  }
}
