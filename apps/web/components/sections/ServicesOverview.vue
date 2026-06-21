<script setup lang="ts">
import servicesData from '~/content/services.json'

const { t, locale } = useI18n()
const localePath = useLocalePath()

const localText = (field: Record<string, string> | undefined) =>
  field?.[locale.value] ?? field?.vi ?? ''

// Only featured services for homepage
const featuredServices = computed(() =>
  servicesData.flatMap(cat =>
    cat.items
      .filter(item => item.featured)
      .map(item => ({
        ...item,
        name: localText(item.name),
        description: localText(item.description),
        categoryName: localText(cat.category),
        categoryIcon: cat.icon,
      })),
  ).slice(0, 6),
)

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN').format(price) + ' ₫'
</script>

<template>
  <section class="section-py bg-white" aria-labelledby="services-heading">
    <div class="container-page">
      <!-- Heading -->
      <div class="text-center mb-12 md:mb-16 animate-on-scroll">
        <p class="text-primary-500 text-sm font-medium tracking-widest uppercase mb-3">
          {{ $t('site.tagline') }}
        </p>
        <h2 id="services-heading" class="section-heading text-dark mb-4">
          {{ t('services.title') }}
        </h2>
        <div class="divider-gold" />
        <p class="section-subheading mt-4 max-w-2xl mx-auto">
          {{ t('services.subtitle') }}
        </p>
      </div>

      <!-- Services grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <article
          v-for="service in featuredServices"
          :key="service.id"
          class="group bg-white border border-gray-100 rounded-lg overflow-hidden
                 hover:shadow-xl transition-shadow duration-300 animate-on-scroll"
        >
          <!-- Image -->
          <div class="relative overflow-hidden aspect-[4/3]">
            <NuxtImg
              :src="service.image"
              :alt="service.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="100vw sm:50vw lg:33vw"
              format="webp"
              loading="lazy"
            />
            <!-- Category badge -->
            <span
              class="absolute top-3 left-3 bg-primary-500 text-white text-xs font-medium
                     px-2 py-1 rounded"
            >
              {{ service.categoryIcon }} {{ service.categoryName }}
            </span>
          </div>

          <!-- Content -->
          <div class="p-5 md:p-6">
            <h3 class="font-heading text-lg font-semibold text-dark mb-2 group-hover:text-primary-600 transition-colors">
              {{ service.name }}
            </h3>
            <p class="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
              {{ service.description }}
            </p>

            <!-- Price & duration -->
            <div class="flex items-center justify-between text-sm">
              <div>
                <span class="text-gray-400 text-xs">{{ t('services.from') }}</span>
                <span class="block text-primary-600 font-semibold text-base">
                  {{ formatPrice(service.price) }}
                </span>
              </div>
              <div class="text-right">
                <span class="text-gray-400 text-xs">{{ t('services.duration') }}</span>
                <span class="block text-dark font-medium">
                  {{ service.duration }} {{ t('services.minutes') }}
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- CTA -->
      <div class="text-center mt-10 md:mt-14 animate-on-scroll">
        <NuxtLink :to="localePath('/dich-vu')" class="btn-primary px-10 py-4">
          {{ t('services.viewAll') }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
