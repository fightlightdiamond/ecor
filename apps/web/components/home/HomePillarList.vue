<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const imgModules = import.meta.glob('~/assets/images/*.jpg', {
  eager: true,
  import: 'default',
}) as Record<string, string>
const imgUrl = (name: string) =>
  Object.entries(imgModules).find(([k]) => k.endsWith(`/${name}`))?.[1] ?? ''

const pillars = computed(() => [
  { key: 'home.pillars.tradition', path: '/san-pham-list', img: 'tlcv_van_hoa_truyen_thong_001.jpg' },
  { key: 'home.pillars.vietTea', path: '/san-pham-list', img: 'tlcv_nep_che_viet.jpg' },
  { key: 'home.pillars.vietIdentity', path: '/san-pham-list', img: 'tlcv_can_tinh_viet_001.jpg' },
  { key: 'home.pillars.teaProducts', path: '/san-pham-list', img: 'tlcv_san_pham.jpg' },
  { key: 'home.pillars.brand', path: '/san-pham-list', img: 'kp_thang_long_che_viet.jpg' },
])
</script>

<template>
  <div class="home-pillars">
    <div class="row">
      <template v-for="(item, i) in pillars" :key="item.key">
        <div class="col-md-6 mb30 col-sm-12 col-sm-offset-0">
          <NuxtLink :to="localePath(item.path)" class="preview-link">
            <span class="preview-media">
              <img :src="imgUrl(item.img)" class="img-responsive" :alt="t(item.key)">
            </span>
            <span class="pillar-title">{{ t(item.key) }}</span>
          </NuxtLink>
        </div>
        <div v-if="i % 2 === 1" class="clearfix" />
      </template>
    </div>
  </div>
</template>

<style scoped>
.home-pillars {
  --pillar-red: #a10c25;
  --pillar-red-bright: #c41e3a;
  --pillar-red-glow: rgba(161, 12, 37, .72);
  --pillar-green: #4d7c3a;
  --pillar-green-glow: rgba(77, 124, 58, .55);
  margin-top: 4px;
}

@media (max-width: 1023px) {
  .home-pillars {
    --pillar-gutter: 24px;
    padding-left: var(--pillar-gutter);
    padding-right: var(--pillar-gutter);
  }

  .home-pillars :deep(.mb30) {
    width: 100%;
    float: none;
    padding-left: 0;
    padding-right: 0;
  }
}

@media (min-width: 640px) and (max-width: 1023px) {
  .home-pillars {
    --pillar-gutter: 24px;
  }
}

.pillar-title {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 4;
  display: block;
  margin: 0;
  padding: 22px 12px 10px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: .08em;
  line-height: 1.35;
  text-align: center;
  text-transform: capitalize;
  color: #fff;
  background: linear-gradient(
    to top,
    rgba(12, 20, 14, .92) 0%,
    rgba(12, 20, 14, .58) 42%,
    rgba(12, 20, 14, 0) 100%
  );
  border: none;
  border-radius: 0 0 6px 6px;
  box-sizing: border-box;
  pointer-events: none;
  transition: background .45s ease;
}

@media (min-width: 768px) {
  .pillar-title {
    padding: 24px 14px 11px;
    font-size: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pillar-title {
    background: linear-gradient(
      to top,
      rgba(12, 20, 14, .95) 0%,
      rgba(12, 20, 14, .72) 55%,
      rgba(12, 20, 14, .2) 100%
    );
  }
}

.preview-link {
  position: relative;
  display: block;
  width: calc(100% - var(--pillar-gutter) * 2);
  margin-left: auto;
  margin-right: auto;
  max-width: none;
  aspect-ratio: 346 / 197;
  overflow: hidden;
  border-radius: 6px;
  background: #2a3326;
  box-shadow: 0 6px 18px rgba(0, 0, 0, .28);
  transform: translateZ(0);
  transition: transform .45s cubic-bezier(.22, .61, .36, 1),
              box-shadow .45s cubic-bezier(.22, .61, .36, 1);
  will-change: transform;
  text-decoration: none;
  box-shadow: 1px 1px 6px 1px #666666;
}

.preview-link:not(:hover) {
  overflow: hidden;
}

@media (min-width: 1024px) {
  .preview-link {
    max-width: 346px;
    margin-left: auto;
    margin-right: auto;
  }
}

.preview-media {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  border-radius: 6px;
}

.preview-link img.img-responsive {
  width: 100%;
  height: 100%;
  max-width: 100%;
  padding: 0;
  object-fit: cover;
  display: block;
  opacity: 1;
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  transition: transform .6s cubic-bezier(.22, .61, .36, 1),
              filter .45s ease;
  will-change: transform;
}

/* Ghi đè style.css global (.col-md-6 img:hover { width:90%; padding:5% }) */
.preview-link:hover img.img-responsive {
  width: 100%;
  height: 100%;
  padding: 0;
  opacity: 1;
  background: transparent;
}

.preview-link::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 2;
  background: linear-gradient(
    to bottom,
    rgba(161, 12, 37, .48) 0%,
    rgba(30, 86, 168, .36) 40%,
    transparent 74%
  );
  opacity: 0;
  transition: opacity .45s ease;
  pointer-events: none;
}

.preview-link::before {
  content: "";
  position: absolute;
  inset: -2px;
  z-index: 3;
  border-radius: 8px;
  box-shadow:
    0 0 0 0 transparent,
    0 0 0 0 transparent;
  transition: box-shadow .45s ease;
  pointer-events: none;
}

.preview-link:hover {
  overflow: visible;
  transform: translateY(-4px);
  box-shadow:
    0 0 0 2px var(--pillar-red),
    0 0 14px var(--pillar-red-glow),
    0 0 28px rgba(196, 30, 58, .42),
    0 0 40px var(--pillar-green-glow),
    0 14px 32px rgba(0, 0, 0, .4),
    inset 0 56px 64px -20px var(--pillar-green-glow);
}

.preview-link:hover .preview-media img.img-responsive {
  transform: scale(1.06);
  filter: saturate(1.12) brightness(1.06) contrast(1.04);
}

.preview-link:hover::after { opacity: 1; }

.preview-link:hover::before {
  animation: pillar-edge-glow 2.2s ease-in-out infinite;
}

.preview-link:hover .pillar-title {
  background: linear-gradient(
    to top,
    rgba(161, 12, 37, .94) 0%,
    rgba(30, 168, 53, 0.62) 46%,
    rgba(1, 97, 14, 0) 100%
  );
}

@keyframes pillar-edge-glow {
  0%, 100% {
    box-shadow:
      0 0 0 2px var(--pillar-red),
      0 0 10px rgba(161, 12, 37, .85),
      0 0 22px rgba(196, 30, 58, .5),
      0 0 34px rgba(1, 85, 22, 0.28);
  }
  50% {
    box-shadow:
      0 0 0 2px var(--pillar-red-bright),
      0 0 18px rgba(196, 30, 58, 1),
      0 0 32px rgba(161, 12, 37, .72),
      0 0 48px rgba(1, 95, 32, 0.45);
  }
}

@supports not (aspect-ratio: 1) {
  .preview-link {
    max-height: none;
  }

  @media (min-width: 1024px) {
    .preview-link {
      max-height: 197px;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .preview-link,
  .preview-link .preview-media img.img-responsive,
  .preview-link::after,
  .preview-link::before {
    transition-duration: .01ms;
  }

  .preview-link:hover {
    transform: none;
    box-shadow:
      0 0 0 2px var(--pillar-red),
      0 0 16px var(--pillar-red-glow),
      0 0 28px var(--pillar-green-glow),
      0 10px 24px rgba(0, 0, 0, .35),
      inset 0 48px 56px -20px var(--pillar-green-glow);
  }

  .preview-link:hover .preview-media img.img-responsive { transform: none; }

  .preview-link:hover::before {
    animation: none;
    box-shadow:
      0 0 0 2px var(--pillar-red-bright),
      0 0 14px rgba(196, 30, 58, .9),
      0 0 26px rgba(0, 88, 34, 0.38);
  }
}
</style>
