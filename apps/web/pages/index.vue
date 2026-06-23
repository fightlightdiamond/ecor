<script setup lang="ts">
// Trang chủ clone từ v2 (theme Modis - "Select Preview").
// CSS trong ~/assets/css, ảnh trong ~/assets/images — build bởi Vite.
// layout: false để render standalone đúng như trang gốc v2.
definePageMeta({ layout: false })

// Nền đặt trên lớp fixed riêng (không dùng body background-attachment:fixed)
// để backdrop-filter của widget blur hoạt động đúng trên trang chủ.
useHead({
  style: [
    { innerHTML: `html,body{min-height:100%;margin:0;background:#333;}` },
  ],
})
</script>

<template>
  <div id="wrapper" class="home-page">
    <HomePageBackground :base-blur="0" :left-blur="0" />

    <HomeNewsMarquee />

    <div class="home-main">
      <HomeMobileTopBanner :base-blur="0" :left-blur="0" />
      <div class="container text-center home-pillars-wrap">
        <div class="row">
          <div class="col-md-8 col-md-offset-5 col-sm-12 col-sm-offset-0">
            <HomePillarList />
          </div>
        </div>
      </div>
    </div>
    <WidgetsConnectWidget />
    <div class="home-footer-wrap">
      <LayoutAppFooter />
    </div>
  </div>
</template>

<style scoped>
.home-page {
  --site-marquee-h: 0px;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: transparent;
  padding-top: 0;
}

.home-page :deep(.site-header) {
  top: var(--site-marquee-h);
}

.home-main {
  position: relative;
  z-index: 1;
  flex: 1 0 auto;
  display: flow-root;
  padding-top: calc(var(--site-marquee-h) + 24px);
  padding-bottom: 24px;
}

@media (max-width: 1023px) {
  .home-main {
    /* Chừa chỗ cho marquee + banner fixed (mobile & tablet) */
    padding-top: calc(var(--site-marquee-h) + clamp(150px, 18vh, 320px));
  }
}

@media (min-width: 1024px) {
  .home-main {
    padding-top: calc(var(--site-marquee-h) + 32px);
  }
}

.home-pillars-wrap {
  position: relative;
  z-index: 1;
}

@media (max-width: 1023px) {
  .home-pillars-wrap.container {
    max-width: none;
    padding-left: 0;
    padding-right: 0;
    .row {
      margin-left: 0;
      margin-right: 0;
    }
  }

  .home-pillars-wrap :deep(.col-md-8),
  .home-pillars-wrap :deep([class*="col-md-offset"]) {
    width: 100%;
    float: none;
    margin-left: 0;
    padding-left: 0;
    padding-right: 0;
  }
}

.home-footer-wrap {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  clear: both;
  margin-top: auto;
}

@media (max-width: 639px) {
  .home-page {
    --site-marquee-h: 31px;
  }
}
</style>
