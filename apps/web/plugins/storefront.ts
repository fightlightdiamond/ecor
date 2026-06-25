export default defineNuxtPlugin(() => {
  useSiteBundle()

  if (import.meta.client) {
    const { fetchCart } = useCart()
    fetchCart()
  }
})
