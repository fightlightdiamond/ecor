<script setup lang="ts">
import defaultBaseImage from '~/assets/images/tlcv_bg_home_001.jpg'
import defaultLeftImage from '~/assets/images/dau_chim_phuong_nha_ly.png'

const props = withDefaults(defineProps<{
  /** Ảnh nền toàn khung (phần bên phải) */
  baseImage?: string
  /** Độ blur ảnh nền chung (px), 0 = không blur */
  baseBlur?: number
  /** Ảnh nền khung cột trái */
  leftImage?: string
  /** Độ blur ảnh cột trái (px), 0 = không blur */
  leftBlur?: number
  /** Màu nền dự phòng khi ảnh chưa tải */
  fallbackColor?: string
  /** Chiều cao banner (vh) trên mobile & tablet */
  heightVh?: number
}>(), {
  baseImage: undefined,
  baseBlur: 0,
  leftImage: undefined,
  leftBlur: 0,
  fallbackColor: '#333',
  heightVh: 18,
})

const resolvedBaseImage = computed(() => props.baseImage ?? defaultBaseImage)
const resolvedLeftImage = computed(() => props.leftImage ?? defaultLeftImage)

const mediaStyle = (image: string, blur: number) => ({
  backgroundImage: `url(${image})`,
  '--bg-blur': blur > 0 ? `${blur}px` : '0px',
})
</script>

<template>
  <div
    class="home-mobile-banner"
    :style="{
      '--banner-h': `${heightVh}vh`,
      '--home-bg-fallback': fallbackColor,
    }"
    aria-hidden="true"
  >
    <!-- Nền chung: phủ toàn banner (phần bên phải) -->
    <div class="home-mobile-banner__base">
      <div
        class="home-mobile-banner__media"
        :class="{ 'is-blurred': baseBlur > 0 }"
        :style="mediaStyle(resolvedBaseImage, baseBlur)"
      />
      <div class="home-mobile-banner__base-overlay" />
    </div>

    <!-- Cột trái ~1/(1+φ) ≈ 38% (tỉ lệ vàng) -->
    <div class="home-mobile-banner__aside">
      <div
        class="home-mobile-banner__media"
        :class="{ 'is-blurred': leftBlur > 0 }"
        :style="mediaStyle(resolvedLeftImage, leftBlur)"
      />
      <div class="home-mobile-banner__aside-overlay" />
    </div>
  </div>
</template>

<style scoped>
.home-mobile-banner {
  display: none;
}

@media (max-width: 1023px) {
  .home-mobile-banner {
    --home-bg-ratio-left: 1;
    --home-bg-ratio-right: 1.618;
    --home-bg-left-w: calc(100% * var(--home-bg-ratio-left) / (var(--home-bg-ratio-left) + var(--home-bg-ratio-right)));
    --banner-h: 18vh;
    display: block;
    position: fixed;
    top: var(--site-marquee-h, 0px);
    left: 0;
    right: 0;
    z-index: 5;
    width: 100%;
    height: var(--banner-h);
    min-height: 180px;
    max-height: 300px;
    margin: 0;
    padding: 0;
    overflow: hidden;
    pointer-events: none;
    background-color: var(--home-bg-fallback, #333);
    isolation: isolate;
  }

  .home-mobile-banner__base {
    position: absolute;
    inset: 0;
  }

  .home-mobile-banner__base-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, .08) 0%,
      rgba(0, 0, 0, .18) 100%
    );
    -webkit-backdrop-filter: blur(8px);
    backdrop-filter: blur(8px);
  }

  .home-mobile-banner__aside {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: var(--home-bg-left-w);
    overflow: hidden;
  }

  .home-mobile-banner__aside-overlay {
    position: absolute;
    inset: 0;
    --blur: 1px;
    -webkit-backdrop-filter: blur(var(--blur));
    backdrop-filter: blur(var(--blur));
  }

  .home-mobile-banner__media {
    position: absolute;
    inset: -8px;
    background-repeat: no-repeat;
    background-position: top center;
    background-size: 100% auto;
    transform: scale(1.02);
    transform-origin: center;
  }

  .home-mobile-banner__base .home-mobile-banner__media {
    background-size: cover;
    background-position: center;
  }

  .home-mobile-banner__media.is-blurred {
    filter: blur(var(--bg-blur, 0px));
    -webkit-filter: blur(var(--bg-blur, 0px));
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .home-mobile-banner {
    --banner-h: 22vh;
    min-height: 200px;
    max-height: 320px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-mobile-banner__media.is-blurred {
    filter: none;
    -webkit-filter: none;
  }
}
</style>
