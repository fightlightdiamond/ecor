<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

const isMenuOpen = ref(false)

watch(() => route.path, () => { isMenuOpen.value = false })

// Header trong suốt khi ở đỉnh trang; đổ nền sau khi cuộn > 50px
// (hoặc khi menu mobile đang mở để giữ chữ dễ đọc).
const { y: scrollY } = useWindowScroll()
const isSolid = computed(() => scrollY.value > 50 || isMenuOpen.value)

const navLinks = computed(() => [
  { key: 'nav.home', path: '/' },
  { key: 'nav.products', path: '/san-pham-list' },
  { key: 'nav.craftVillage', path: '/lang-nghe' },
  { key: 'nav.team', path: '/doi-ngu' },
  { key: 'nav.blog', path: '/tin-tuc' },
  { key: 'nav.contact', path: '/lien-he' },
])
</script>

<template>
  <!-- role="banner" thay vì <header> để tránh xung đột CSS Modis (header { position:absolute }) -->
  <div
    class="site-header"
    :class="{ 'is-solid': isSolid }"
    role="banner"
  >
    <div class="site-header-inner container-page">
      <LayoutSiteLogo variant="header" class="site-header-logo" />

      <nav class="max-lg:hidden lg:flex items-center gap-0 flex-1 justify-center min-w-0" aria-label="Main navigation">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.key"
          :to="localePath(link.path)"
          class="site-nav-link"
          active-class="site-nav-active"
        >
          {{ t(link.key) }}
        </NuxtLink>
      </nav>

      <div class="max-lg:hidden lg:flex items-center">
        <NuxtLink :to="localePath('/lien-he')" class="site-header-cta">
          {{ t('nav.bookNow') }}
        </NuxtLink>
      </div>

      <button
        class="lg:hidden p-2 text-[#f5f0e6] min-h-[44px] min-w-[44px] flex items-center justify-center"
        :aria-label="isMenuOpen ? 'Đóng menu' : 'Mở menu'"
        :aria-expanded="isMenuOpen"
        @click="isMenuOpen = !isMenuOpen"
      >
        <div class="w-6 flex flex-col gap-1.5">
          <span class="block h-0.5 bg-[#f5f0e6] transition-all duration-300" :class="isMenuOpen ? 'rotate-45 translate-y-2' : ''" />
          <span class="block h-0.5 bg-[#f5f0e6] transition-all duration-300" :class="isMenuOpen ? 'opacity-0' : ''" />
          <span class="block h-0.5 bg-[#f5f0e6] transition-all duration-300" :class="isMenuOpen ? '-rotate-45 -translate-y-2' : ''" />
        </div>
      </button>
    </div>

    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="isMenuOpen" class="lg:hidden site-header-mobile">
        <nav class="container-page py-4 flex flex-col" aria-label="Mobile navigation">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.key"
            :to="localePath(link.path)"
            class="site-mobile-link"
            active-class="text-[#e8d5a8]"
            @click="isMenuOpen = false"
          >
            {{ t(link.key) }}
          </NuxtLink>
          <div class="pt-4">
            <NuxtLink
              :to="localePath('/lien-he')"
              class="site-header-cta w-full justify-center"
              @click="isMenuOpen = false"
            >
              {{ t('nav.bookNow') }}
            </NuxtLink>
          </div>
        </nav>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.site-header {
  position: fixed !important;
  top: 0 !important;
  left: 0;
  right: 0;
  z-index: 950;
  background: transparent;
  border-bottom: 1px solid transparent;
  box-shadow: none;
  transition: background .3s ease, border-color .3s ease, box-shadow .3s ease;
}

.site-header.is-solid {
  background: linear-gradient(180deg, #4a4a4a 0%, #333333 100%);
  border-bottom-color: rgba(201, 108, 108, 0.35);
  box-shadow: 0 4px 20px rgba(0, 0, 0, .22);
}

.site-header-inner {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.site-header-logo {
  text-decoration: none;
}

.site-nav-link {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: .12em;
  color: rgba(245, 240, 230, .88);
  padding: .5rem .55rem;
  text-decoration: none;
  transition: color .2s ease;
  white-space: nowrap;
}

@media (min-width: 1280px) {
  .site-nav-link {
    font-size: 11px;
    letter-spacing: .15em;
    padding: .75rem .7rem;
  }
}

.site-nav-link:hover {
  color: #e8d5a8;
}

.site-nav-active {
  color: #e8d5a8 !important;
}

.site-header-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: .6rem 1.25rem;
  background: #64231e;
  color: #d5b176;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .15em;
  text-decoration: none;
  transition: background .2s ease, color .2s ease;
}

.site-header-cta:hover {
  background: #752b26;
  color: #d5b176;
}

.site-header-mobile {
  background: #143222;
  border-top: 1px solid rgba(201, 168, 108, .2);
}

.site-mobile-link {
  color: rgba(245, 240, 230, .85);
  padding: .85rem .75rem;
  font-size: .875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: .12em;
  border-bottom: 1px solid rgba(255, 255, 255, .06);
  text-decoration: none;
  min-height: 44px;
  display: flex;
  align-items: center;
  transition: color .2s ease;
}

.site-mobile-link:hover {
  color: #e8d5a8;
}
</style>
