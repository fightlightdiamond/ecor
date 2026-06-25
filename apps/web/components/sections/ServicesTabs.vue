<script setup lang="ts">
const { categories } = useServices()

const { t, locale } = useI18n()

const activeTab = ref('')
watch(categories, (cats) => {
  if (!activeTab.value && cats[0]) activeTab.value = cats[0].id
}, { immediate: true })
const activeCategory = computed(() =>
  categories.value.find(c => c.id === activeTab.value) ?? categories.value[0],
)

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN').format(price) + ' ₫'
</script>

<template>
  <section id="services" class="section-py bg-[#222]" aria-labelledby="services-tab-heading">
    <div class="container-page">

      <!-- Heading -->
      <div class="text-center mb-10 md:mb-14 animate-on-scroll">
        <p class="font-condensed text-primary-400 text-xs uppercase tracking-[0.25em] mb-3">
          {{ t('services.fullServices') }}
        </p>
        <h2 id="services-tab-heading" class="section-heading text-white mb-4">
          {{ t('services.title') }}
        </h2>
        <div class="divider-gold" />
      </div>

      <!-- Tab nav — exact Modis .de_tab .de_nav style -->
      <div
        class="flex flex-wrap justify-center mb-0 animate-on-scroll"
        role="tablist"
      >
        <button
          v-for="cat in categories"
          :key="cat.id"
          role="tab"
          :aria-selected="activeTab === cat.id"
          class="min-h-[48px] px-6 md:px-10 py-3 font-condensed text-xs uppercase tracking-[0.2em]
                 border-r border-[#404040] last:border-r-0
                 transition-colors duration-200"
          :class="activeTab === cat.id
            ? 'bg-[#27282b] text-[#ccc] border-b border-b-[#27282b]'
            : 'bg-[#222] text-white/50 hover:text-white/80 hover:bg-[#2a2a2a]'"
          @click="activeTab = cat.id"
        >
          <span class="mr-1.5">{{ cat.icon }}</span>{{ cat.name }}
        </button>
      </div>

      <!-- Tab content — Modis .de_tab_content style -->
      <div
        v-if="activeCategory"
        role="tabpanel"
        class="border border-[#404040] bg-[#27282b] p-6 md:p-10 animate-on-scroll"
      >
        <ul class="divide-y divide-white/8">
          <li
            v-for="item in activeCategory.items"
            :key="item.id"
            class="flex items-center justify-between gap-4 py-4 md:py-5 group
                   hover:bg-white/3 -mx-2 px-2 transition-colors"
          >
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 flex-wrap">
                <span
                  v-if="item.discount"
                  class="text-[10px] font-condensed uppercase tracking-wider
                         bg-primary-500 text-white px-2 py-0.5"
                >
                  {{ item.discount }} Off
                </span>
                <span class="text-white/80 group-hover:text-white transition-colors font-medium text-sm md:text-base">
                  {{ item.name }}
                </span>
              </div>
              <span class="text-white/30 text-xs mt-0.5 block font-condensed">
                {{ item.duration }} {{ t('services.minutes') }}
              </span>
            </div>
            <span class="text-primary-400 font-condensed font-bold text-lg md:text-xl whitespace-nowrap tabular-nums">
              {{ formatPrice(item.price) }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
