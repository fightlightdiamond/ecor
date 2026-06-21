<script setup lang="ts">
const { t } = useI18n()
const { salon } = useSettings()
const { getBySlug, related } = useProducts()
const localePath = useLocalePath()
const route = useRoute()

useScrollAnimation()

const listUrl = computed(() => localePath('/san-pham-list'))

const slug = computed(() => String(route.params.slug))
const product = computed(() => getBySlug(slug.value))

// 404 khi không tìm thấy sản phẩm
if (!product.value) {
  throw createError({ statusCode: 404, statusMessage: t('products.notFound'), fatal: true })
}

const activeImage = ref(product.value.gallery[0] ?? product.value.image)
watch(product, (p) => { if (p) activeImage.value = p.gallery[0] ?? p.image })

const relatedItems = computed(() => related(slug.value, 3))
const priceText = computed(() =>
  `${product.value?.price.toLocaleString('vi-VN')} ${t('common.currency')}`,
)

useSeoMeta({
  title: () => `${product.value?.title} | ${salon.value.name}`,
  description: () => product.value?.shortDesc,
  ogImage: () => product.value?.image,
})
</script>

<template>
  <div v-if="product" class="bg-dark text-white">
    <section class="section-py">
      <div class="container-page">

        <!-- Breadcrumb -->
        <nav class="mb-8 text-xs uppercase tracking-[0.12em] text-white/50 d-none!" aria-label="Breadcrumb">
          <NuxtLink :to="localePath('/')" class="hover:text-primary-400">{{ t('nav.home') }}</NuxtLink>
          <span class="mx-2">/</span>
          <NuxtLink :to="listUrl" class="hover:text-primary-400">{{ t('products.label') }}</NuxtLink>
          <span class="mx-2">/</span>
          <span class="text-white/80">{{ product.title }}</span>
        </nav>

        <!-- Top: gallery + info -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">

          <!-- Gallery -->
          <div class="animate-on-scroll">
            <div class="relative aspect-[16/9] overflow-hidden rounded-lg bg-[#2a3326] shadow-2xl">
              <img :src="activeImage" :alt="product.title" class="w-full h-full object-cover">
            </div>
            <div v-if="product.gallery.length > 1" class="mt-4 flex gap-3">
              <button
                v-for="(img, i) in product.gallery"
                :key="i"
                type="button"
                class="relative aspect-[16/9] w-24 overflow-hidden rounded-md border-2 transition-colors"
                :class="img === activeImage ? 'border-primary-500' : 'border-transparent opacity-70 hover:opacity-100'"
                @click="activeImage = img"
              >
                <img :src="img" :alt="`${product.title} ${i + 1}`" class="w-full h-full object-cover">
              </button>
            </div>
          </div>

          <!-- Info -->
          <div class="animate-on-scroll">
            <p class="modis-eyebrow mb-3">{{ t('products.label') }}</p>
            <h1 class="font-heading text-3xl md:text-4xl font-bold mb-3">{{ product.title }}</h1>
            <p class="text-2xl font-semibold text-primary-400 mb-5">{{ priceText }}</p>
            <p class="text-white/70 leading-relaxed mb-6">{{ product.shortDesc }}</p>

            <!-- Features -->
            <ul v-if="product.features.length" class="space-y-2.5 mb-8">
              <li
                v-for="(f, i) in product.features"
                :key="i"
                class="flex items-start gap-3 text-sm text-white/80"
              >
                <svg class="mt-0.5 w-4 h-4 flex-shrink-0 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>{{ f }}</span>
              </li>
            </ul>

            <!-- CTA -->
            <div class="flex flex-wrap gap-3">
              <NuxtLink :to="localePath('/lien-he')" class="btn-primary">
                {{ t('products.buy') }}
              </NuxtLink>
              <NuxtLink :to="listUrl" class="btn-ghost">
                {{ t('products.backToList') }}
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="mt-16 max-w-3xl animate-on-scroll">
          <h2 class="section-heading text-2xl md:text-3xl mb-4">{{ t('products.descTitle') }}</h2>
          <div class="divider-gold !mx-0" />
          <p class="text-white/70 leading-relaxed mt-5 whitespace-pre-line">{{ product.description }}</p>
        </div>
      </div>
    </section>

    <!-- Related -->
    <section v-if="relatedItems.length" class="section-py bg-dark-800" aria-label="Related products">
      <div class="container-page">
        <h2 class="section-heading text-2xl md:text-3xl text-center mb-3">{{ t('products.related') }}</h2>
        <div class="divider-gold mb-10" />
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          <NuxtLink
            v-for="p in relatedItems"
            :key="p.id"
            :to="localePath(`/san-pham/${p.slug}`)"
            class="group block"
          >
            <div class="relative aspect-[346/197] overflow-hidden rounded-md bg-[#2a3326] shadow-lg">
              <img :src="p.image" :alt="p.title" loading="lazy" class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105">
            </div>
            <h3 class="mt-3 text-center text-white/75 text-sm uppercase tracking-[0.12em] transition-colors group-hover:text-primary-400">{{ p.title }}</h3>
            <p class="mt-1 text-center text-primary-400 text-sm font-semibold">{{ p.price.toLocaleString('vi-VN') }} {{ t('common.currency') }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
