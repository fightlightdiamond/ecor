import type { ApiEnvelope, Product, RawProduct } from '~/utils/storefront'
import { parseApiError, transformProduct } from '~/utils/storefront'

export interface CartItem {
  id: number
  product_id: number
  quantity: number
  product?: Product
}

export interface Cart {
  id: number
  session_id: string
  user_id: number | null
}

export function useCart() {
  const { fetchApi } = useApi()
  const { locale, t } = useAppI18n()

  const cart = useState<Cart | null>('cart', () => null)
  const items = useState<CartItem[]>('cart_items', () => [])
  const loading = ref(false)
  const toast = useState<string | null>('cart_toast', () => null)

  const mapItem = (item: { id: number; product_id: number; quantity: number; product?: RawProduct }) => ({
    id: item.id,
    product_id: item.product_id,
    quantity: item.quantity,
    product: item.product ? transformProduct(item.product, locale.value) : undefined,
  })

  const fetchCart = async () => {
    loading.value = true
    try {
      const res = await fetchApi<ApiEnvelope<{ cart: Cart; items: Array<{ id: number; product_id: number; quantity: number; product?: RawProduct }> }>>('/cart')
      if (res.success) {
        cart.value = res.data.cart
        items.value = res.data.items.map(mapItem)
      }
    } catch (err) {
      console.error('Failed to fetch cart', err)
    } finally {
      loading.value = false
    }
  }

  const addToCart = async (productId: string | number, quantity = 1) => {
    loading.value = true
    try {
      const res = await fetchApi<ApiEnvelope<null> & { message: string }>('/cart/add', {
        method: 'POST',
        body: { product_id: productId, quantity },
      })
      if (res.success) {
        await fetchCart()
        toast.value = res.message
        return { success: true, message: res.message }
      }
    } catch (err) {
      console.error('Failed to add to cart', err)
      return { success: false, message: parseApiError(err, t('cart.addError')) }
    } finally {
      loading.value = false
    }
    return { success: false, message: t('cart.addError') }
  }

  const updateCart = async (itemId: number, quantity: number) => {
    loading.value = true
    try {
      const res = await fetchApi<ApiEnvelope<null> & { message: string }>('/cart/update', {
        method: 'POST',
        body: { item_id: itemId, quantity },
      })
      if (res.success) {
        await fetchCart()
      }
    } catch (err) {
      console.error('Failed to update cart', err)
    } finally {
      loading.value = false
    }
  }

  const removeFromCart = async (itemId: number) => {
    loading.value = true
    try {
      const res = await fetchApi<ApiEnvelope<null> & { message: string }>('/cart/remove', {
        method: 'POST',
        body: { item_id: itemId },
      })
      if (res.success) {
        await fetchCart()
      }
    } catch (err) {
      console.error('Failed to remove from cart', err)
    } finally {
      loading.value = false
    }
  }

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
      const res = await fetchApi<ApiEnvelope<{
        order_number: string
        subtotal?: number
        discount?: number
        total_price?: number
        payment_method?: string
        payment_url?: string
      }> & { message: string }>('/checkout', {
        method: 'POST',
        body: data,
      })
      if (res.success) {
        if (!res.data?.payment_url) {
          cart.value = null
          items.value = []
        }
        return {
          success: true,
          message: res.message,
          orderNumber: res.data?.order_number ?? null,
          subtotal: res.data?.subtotal,
          discount: res.data?.discount,
          totalPrice: res.data?.total_price,
          paymentUrl: res.data?.payment_url ?? null,
        }
      }
    } catch (err) {
      console.error('Checkout failed', err)
      return {
        success: false,
        message: parseApiError(err, t('cart.checkoutError')),
        orderNumber: null,
        paymentUrl: null,
      }
    } finally {
      loading.value = false
    }
    return { success: false, message: t('cart.checkoutError'), orderNumber: null, paymentUrl: null }
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
