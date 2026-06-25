<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const { salon } = useSettings()
const {
  items,
  loading,
  totalPrice,
  updateCart,
  removeFromCart,
  checkout,
} = useCart()

const form = reactive({
  name: '',
  phone: '',
  address: '',
})

const message = ref('')
const error = ref('')

const formatPrice = (price: number) =>
  `${price.toLocaleString('vi-VN')} ${t('common.currency')}`

const handleCheckout = async () => {
  error.value = ''
  message.value = ''
  if (!form.name || !form.phone || !form.address) {
    error.value = t('cart.formRequired')
    return
  }
  const res = await checkout({ ...form })
  if (res.success) {
    message.value = res.orderNumber
      ? t('cart.orderSuccess', { number: res.orderNumber })
      : res.message
    form.name = ''
    form.phone = ''
    form.address = ''
  } else {
    error.value = res.message
  }
}

useSeoMeta({
  title: () => `${t('cart.title')} | ${salon.value.name}`,
})
</script>

<template>
  <div class="bg-dark min-h-[60vh] text-white">
    <LayoutPageHero :label="t('cart.eyebrow')" :title="t('cart.title')" />

    <section class="section-py bg-dark-800">
      <div class="container-page max-w-4xl">
        <div v-if="loading && !items.length" class="text-white/50 text-center py-12">
          {{ t('common.loading') }}
        </div>

        <div v-else-if="!items.length" class="text-center py-12">
          <p class="text-white/60 mb-6">{{ t('cart.empty') }}</p>
          <NuxtLink :to="localePath('/san-pham-list')" class="btn-primary">
            {{ t('cart.continueShopping') }}
          </NuxtLink>
        </div>

        <template v-else>
          <ul class="space-y-4 mb-10">
            <li
              v-for="item in items"
              :key="item.id"
              class="flex flex-col sm:flex-row gap-4 p-4 border border-white/10 rounded-lg"
            >
              <img
                v-if="item.product?.image"
                :src="item.product.image"
                :alt="item.product.title"
                class="w-24 h-24 object-cover rounded-md flex-shrink-0"
              >
              <div class="flex-1 min-w-0">
                <NuxtLink
                  v-if="item.product"
                  :to="localePath(`/san-pham/${item.product.slug}`)"
                  class="font-semibold hover:text-primary-400"
                >
                  {{ item.product.title }}
                </NuxtLink>
                <p class="text-primary-400 mt-1">
                  {{ formatPrice(item.product?.price || 0) }}
                </p>
                <div class="flex flex-wrap items-center gap-3 mt-3">
                  <label class="text-sm text-white/60">{{ t('cart.quantity') }}</label>
                  <input
                    :value="item.quantity"
                    type="number"
                    min="0"
                    class="w-20 px-2 py-1 rounded bg-dark text-white border border-white/20 min-h-[44px]"
                    @change="updateCart(item.id, Number(($event.target as HTMLInputElement).value))"
                  >
                  <button
                    type="button"
                    class="text-sm text-red-400 hover:text-red-300 min-h-[44px] px-2"
                    @click="removeFromCart(item.id)"
                  >
                    {{ t('cart.remove') }}
                  </button>
                </div>
              </div>
            </li>
          </ul>

          <div class="flex justify-between items-center border-t border-white/10 pt-6 mb-10">
            <span class="text-lg font-semibold">{{ t('cart.total') }}</span>
            <span class="text-xl text-primary-400 font-bold">{{ formatPrice(totalPrice) }}</span>
          </div>

          <form class="space-y-4 max-w-lg" @submit.prevent="handleCheckout">
            <h2 class="text-xl font-semibold mb-2">{{ t('cart.checkoutTitle') }}</h2>
            <input
              v-model="form.name"
              type="text"
              :placeholder="t('contact.form.name')"
              class="w-full px-4 py-3 rounded bg-dark border border-white/20 min-h-[44px]"
              required
            >
            <input
              v-model="form.phone"
              type="tel"
              inputmode="tel"
              :placeholder="t('contact.form.phone')"
              class="w-full px-4 py-3 rounded bg-dark border border-white/20 min-h-[44px]"
              required
            >
            <textarea
              v-model="form.address"
              rows="3"
              :placeholder="t('cart.address')"
              class="w-full px-4 py-3 rounded bg-dark border border-white/20"
              required
            />
            <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>
            <p v-if="message" class="text-green-400 text-sm">{{ message }}</p>
            <button
              type="submit"
              class="btn-primary w-full md:w-auto min-h-[44px]"
              :disabled="loading"
            >
              {{ loading ? t('cart.submitting') : t('cart.submit') }}
            </button>
          </form>
        </template>
      </div>
    </section>
  </div>
</template>
