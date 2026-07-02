<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const { site, contact, hours } = useSettings()
const { products, categories, byCategory } = useProducts()
const { latestPosts } = useBlog()

useScrollAnimation()

const imgModules = import.meta.glob('~/assets/images/*.jpg', {
  eager: true,
  import: 'default',
}) as Record<string, string>
const assetUrl = (name: string) =>
  Object.entries(imgModules).find(([k]) => k.endsWith(`/${name}`))?.[1] ?? `/san-pham-list/assets/${name}`

const formatPrice = (price: number) =>
  `${price.toLocaleString('vi-VN')} ${t('common.currency')}`

const localLabel = (vi: string, en: string) => (locale.value === 'en' ? en : vi)

const heroSlides = computed(() => {
  const fromApi = products.value.slice(0, 4).map(p => p.image).filter(Boolean)
  return fromApi.length ? fromApi : ['sp-001.jpg', 'sp-003.jpg', 'sp-005.jpg', 'sp-007.jpg'].map(assetUrl)
})

const teaTabs = computed(() => {
  const allTab = {
    id: 'all',
    label: localLabel('Tất cả', 'All'),
    image: products.value[0]?.image ?? assetUrl('sp-001.jpg'),
    categoryId: null as string | null,
  }

  const fromApi = categories.value.map(c => ({
    id: String(c.id),
    label: c.label,
    image: byCategory(c.id)[0]?.image ?? assetUrl('sp-003.jpg'),
    categoryId: c.id,
  }))

  return fromApi.length ? [allTab, ...fromApi] : [allTab]
})

const activeTab = ref('all')

watch(teaTabs, (tabs) => {
  if (!tabs.find(t => t.id === activeTab.value)) {
    activeTab.value = tabs[0]?.id ?? 'all'
  }
}, { immediate: true })

const activeTabProducts = computed(() => {
  const tab = teaTabs.value.find(t => t.id === activeTab.value)
  if (!tab || tab.categoryId === null) return products.value
  return byCategory(tab.categoryId)
})

const blogSnippets = computed(() =>
  latestPosts.value.map((post) => {
    const date = new Date(post.date || Date.now())
    return {
      slug: post.slug,
      img: post.image,
      day: date.getDate().toString().padStart(2, '0'),
      month: date.toLocaleDateString(locale.value === 'vi' ? 'vi-VN' : 'en-US', { month: 'short' }).toUpperCase(),
      title: post.title,
    }
  }),
)

const testimonials = computed(() => [
  {
    text: localLabel(
      'Trà rất thơm và đậm vị, đúng gu trà truyền thống. Hộp quà Tết sang trọng, giao hàng nhanh. Mình sẽ giới thiệu Thăng Long Chè Việt cho gia đình và bạn bè.',
      'The tea is fragrant and full-bodied, true to traditional taste. Elegant Tet gift box and fast delivery. I will recommend Thang Long Che Viet to family and friends.',
    ),
    author: localLabel('Chị Lan, Khách hàng', 'Ms. Lan, Customer'),
  },
  {
    text: localLabel(
      'Trải nghiệm thưởng trà tuyệt vời. Chất lượng trà thượng hạng, đóng gói tinh tế. Mình rất hài lòng và chắc chắn sẽ tiếp tục ủng hộ.',
      'A wonderful tea experience. Premium quality and refined packaging. Very satisfied and will definitely continue to support.',
    ),
    author: localLabel('Anh Minh, Khách hàng', 'Mr. Minh, Customer'),
  },
])

const typedPhrases = computed(() => {
  const fromCategories = categories.value.map(c => c.label)
  if (fromCategories.length) return fromCategories
  return [
    localLabel('Trà xanh Thái Nguyên', 'Thai Nguyen green tea'),
    localLabel('Trà sen Tây Hồ', 'West Lake lotus tea'),
    localLabel('Trà ô long', 'Oolong tea'),
    localLabel('Trà thảo mộc', 'Herbal tea'),
  ]
})

const typedIndex = ref(0)
let typedTimer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  typedTimer = setInterval(() => {
    typedIndex.value = (typedIndex.value + 1) % typedPhrases.value.length
  }, 2800)
})

onUnmounted(() => {
  if (typedTimer) clearInterval(typedTimer)
})

const addressText = computed(() =>
  contact.value.address?.[locale.value as 'vi' | 'en'] ?? contact.value.address?.vi ?? '',
)

const heroBg = (img: string) =>
  img.startsWith('http') ? `url(${img})` : `url(${assetUrl(img)})`

useHead({
  link: [
    { rel: 'stylesheet', href: '/san-pham-list/assets/style.css' },
    { rel: 'stylesheet', href: '/san-pham-list/assets/animate.css' },
  ],
})

useSeoMeta({
  title: () => `${t('products.title')} | ${site.value.name}`,
  description: () => t('products.subtitle'),
})
</script>

<template>
  <div id="content" class="modis-product-page de_light no-bottom no-top bg-white text-[#333]">
    <!-- Hero crossfade -->
    <section id="section-slider" aria-label="section-slider" class="tlcv-hero">
      <div class="tlcv-hero-bg">
        <div
          v-for="(img, i) in heroSlides"
          :key="`${img}-${i}`"
          class="s"
          :class="`s${i + 1}`"
          :style="{ backgroundImage: heroBg(img) }"
        />
      </div>
      <div class="tlcv-hero-overlay" />
      <div class="tlcv-hero-caption">
        <div class="sub">{{ site.name }}</div>
        <h2>{{ t('products.subtitle') }}</h2>
        <p>{{ localLabel('Bộ sưu tập sản phẩm nổi bật — Quà Tết An Tâm', 'Featured collection — Tet An Tam gifts') }}</p>
        <a href="#section-services-tab" class="btn-slider">{{ localLabel('Khám phá sản phẩm', 'Explore products') }}</a>
      </div>
    </section>

    <!-- Info bar -->
    <div class="no-padding mt-130 height90px mobile-hide absolute z-index500 width100 text-light">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <div class="overlay10">
              <div class="row-fluid">
                <div class="col-md-4">
                  <div class="info-box padding20">
                    <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <div class="info-box_text">
                      <div class="info-box_title">{{ t('contact.hours') }}</div>
                      <div class="info-box_subtite">
                        <div v-for="h in hours" :key="h.days">{{ h.days }}: {{ h.time }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="info-box padding20">
                    <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
                      <path d="M3 10.5 12 3l9 7.5" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M5 9.5V20h14V9.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <div class="info-box_text">
                      <div class="info-box_title">{{ localLabel('Địa chỉ', 'Address') }}</div>
                      <div class="info-box_subtite">{{ addressText }}</div>
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="info-box padding20">
                    <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
                      <rect x="3" y="5" width="18" height="16" rx="2" />
                      <path d="M3 10h18M8 3v4M16 3v4" stroke-linecap="round" />
                    </svg>
                    <div class="info-box_text">
                      <div class="info-box_title">{{ localLabel('Đặt mua', 'Order') }}</div>
                      <div class="info-box_subtite">
                        <a :href="`tel:${contact.mobile ?? contact.phone}`" class="text-white/80 hover:text-white">
                          {{ contact.mobile?.replace('+84 ', '0') ?? contact.phoneDisplay }}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="clearfix" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top reasons -->
    <section id="section-top-reason" class="no-top no-bottom">
      <div class="container-fluid">
        <div class="row-fluid display-table">
          <div class="col-md-4 text-middle" data-bgcolor="#e2e2e2" style="background-color: #e2e2e2;">
            <div class="padding40">
              <div class="box-icon" style="position: relative;">
                <i class="fa fa-tags box-icon-fa" aria-hidden="true" />
                <div class="text">
                  <h4>{{ localLabel('Ưu đãi đặc biệt', 'Special offers') }}</h4>
                  <p>{{ localLabel(
                    'Thăng Long Chè Việt cam kết mang đến những sản phẩm trà thượng hạng, chế biến thủ công theo phương pháp truyền thống.',
                    'Thang Long Che Viet is committed to premium teas crafted by traditional methods.',
                  ) }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4 text-middle text-light" :style="{ backgroundImage: heroBg(products[0]?.image ?? 'sp-002.jpg'), backgroundSize: 'cover', backgroundPosition: 'center' }">
            <div class="padding40" style="background: rgba(0,0,0,.45);">
              <div class="box-icon" style="position: relative;">
                <i class="fa fa-tags box-icon-fa" aria-hidden="true" />
                <div class="text">
                  <h4 style="color:#fff;">{{ localLabel('Sản phẩm nổi bật', 'Featured products') }}</h4>
                  <p style="color:rgba(255,255,255,.85);">{{ localLabel(
                    'Hương vị thanh khiết, an toàn cho sức khỏe — món quà ý nghĩa cho gia đình và người thân.',
                    'Pure flavor, safe for health — a meaningful gift for family and loved ones.',
                  ) }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4 text-middle text-center" style="background-color: #50094d;">
            <div class="padding40">
              <NuxtLink :to="localePath('/gio-hang')" class="btn btn-line-white btn-big">
                {{ localLabel('Đặt mua ngay', 'Order now') }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Product tabs -->
    <section id="section-services-tab" aria-label="section-services-tab" class="section-py">
      <div class="container">
        <div class="col-md-12">
          <div class="de_tab tab_style_2 scrollTo">
            <ul class="de_nav" role="tablist">
              <li
                v-for="tab in teaTabs"
                :key="tab.id"
                role="presentation"
                :class="{ active: activeTab === tab.id }"
                @click="activeTab = tab.id"
              >
                <img :src="tab.image.startsWith('http') ? tab.image : assetUrl(tab.image)" :alt="tab.label">
                <span>{{ tab.label }}</span>
                <div class="v-border" :style="{ opacity: activeTab === tab.id ? 1 : 0 }" />
              </li>
            </ul>

            <div class="de_tab_content">
              <div class="tab_single_content">
                <div v-if="!activeTabProducts.length" class="text-center py-8 text-[#999]">
                  {{ t('common.loading') }}
                </div>
                <div v-else class="row">
                  <div
                    v-for="p in activeTabProducts"
                    :key="p.id"
                    class="col-md-6"
                  >
                    <div class="sub-item-service">
                      <div class="c1">
                        <NuxtLink :to="localePath(`/san-pham/${p.slug}`)">{{ p.title }}</NuxtLink>
                      </div>
                      <div class="c2" />
                      <div class="c3">{{ formatPrice(p.price) }}</div>
                    </div>
                  </div>
                  <div class="clearfix" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section id="explore-5" class="side-bg text-light" style="background:#333;">
      <div class="container section-py">
        <div class="row">
          <div class="col-md-8 col-md-offset-2 text-center">
            <h2>{{ t('testimonials.title') }}</h2>
            <div class="small-border" style="margin: 16px auto;" />
            <ul class="testimonial-list list-none p-0 m-0">
              <li
                v-for="(item, i) in testimonials"
                :key="i"
                class="mb-8 text-white/85 leading-relaxed"
              >
                {{ item.text }}
                <span class="block mt-3 text-primary-400 text-sm">{{ item.author }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Typed heading -->
    <section id="section-hero-2" aria-label="section-hero-2" class="text-light" style="background:#333;">
      <div class="container">
        <div class="row">
          <div class="col-md-12 mt60 mb100 text-center">
            <h4 class="mb30">{{ localLabel('Khám phá sản phẩm của chúng tôi.', 'Discover our products.') }}</h4>
            <div class="small-border" style="margin: 0 auto 20px;" />
            <div class="type-wrap font48 text-center text-white">
              {{ localLabel('Chúng tôi có', 'We offer') }}
              <span class="typed id-color">{{ typedPhrases[typedIndex] }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Blog snippets -->
    <section v-if="blogSnippets.length" id="section-blog" class="no-top section-py">
      <div class="container">
        <div class="row">
          <div
            v-for="post in blogSnippets"
            :key="post.slug"
            class="col-md-6 col-sm-6 mb-8"
          >
            <div class="post-content flex gap-4">
              <div class="post-image flex-shrink-0" style="width:120px;">
                <img :src="post.img" :alt="post.title" class="w-full h-auto rounded object-cover" style="max-height:90px;">
              </div>
              <div class="post-text">
                <div class="date-box text-xs text-[#999] mb-1">
                  <span class="day font-bold">{{ post.day }}</span>
                  <span class="month ml-1">{{ post.month }}</span>
                </div>
                <h3 class="text-base font-semibold m-0">
                  <NuxtLink :to="localePath(`/tin-tuc/${post.slug}`)" class="text-[#333] hover:text-[#c9a86c]">
                    {{ post.title }}
                  </NuxtLink>
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section id="cta" aria-label="cta" class="call-to-action bg-color-2 text-light" style="background:#c9a86c;">
      <div class="container">
        <div class="row flex items-center py-6">
          <div class="col-md-9">
            <h3 class="m-0 flex items-center gap-2 text-lg">
              <i class="fa fa-phone" aria-hidden="true" />
              {{ localLabel('Liên hệ ngay để nhận ưu đãi đặc biệt!', 'Contact us now for a special offer!') }}
            </h3>
          </div>
          <div class="col-md-3 text-right">
            <NuxtLink :to="localePath('/gio-hang')" class="btn btn-line-white btn-big">
              {{ localLabel('Đặt mua ngay', 'Order now') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tlcv-hero {
  position: relative;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background: #1a1a1a;
  margin-top: -72px;
}
.tlcv-hero-bg .s {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  animation: tlcvFade 24s infinite;
}
.tlcv-hero-bg .s2 { animation-delay: 6s; }
.tlcv-hero-bg .s3 { animation-delay: 12s; }
.tlcv-hero-bg .s4 { animation-delay: 18s; }
@keyframes tlcvFade {
  0% { opacity: 0; }
  3% { opacity: 1; }
  25% { opacity: 1; }
  28% { opacity: 0; }
  100% { opacity: 0; }
}
.tlcv-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(0, 0, 0, .4), rgba(0, 0, 0, .62));
}
.tlcv-hero-caption {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
  padding: 20px;
}
.tlcv-hero-caption .sub {
  letter-spacing: 5px;
  text-transform: uppercase;
  font-size: 14px;
  color: #c9a86c;
  margin-bottom: 14px;
}
.tlcv-hero-caption h2 {
  color: #fff;
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 12px;
  letter-spacing: 2px;
}
.tlcv-hero-caption p {
  font-size: 16px;
  opacity: .9;
  margin-bottom: 24px;
}
.typed {
  display: inline-block;
  margin-left: 8px;
  transition: opacity .4s ease;
}
@media (prefers-reduced-motion: reduce) {
  .tlcv-hero-bg .s { animation: none; }
  .tlcv-hero-bg .s1 { opacity: 1; }
}
@media (max-width: 768px) {
  .tlcv-hero-caption h2 { font-size: 30px; }
}
</style>
