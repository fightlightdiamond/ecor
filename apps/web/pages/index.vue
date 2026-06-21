<script setup lang="ts">
// Trang chủ clone từ v2 (theme Modis - "Select Preview").
// CSS trong ~/assets/css, ảnh trong ~/assets/images — build bởi Vite.
// layout: false để render standalone đúng như trang gốc v2.
definePageMeta({ layout: false })

const { t } = useI18n()
const localePath = useLocalePath()

// CSS nạp qua ?inline (lấy nội dung dạng string) rồi inject bằng useHead.
// Cách này KHÔNG đưa CSS vào stylesheet graph của Vite -> không rò rỉ
// Bootstrap sang các trang Tailwind khác, đồng thời page-scoped
// (useHead tự gỡ <style> khi rời trang).
import bgUrl from '~/assets/images/bg.jpg'

// Ảnh lưới: glob eager -> map theo tên file (Vite rewrite về URL đã build).
const imgModules = import.meta.glob('~/assets/images/*.jpg', {
  eager: true,
  import: 'default',
}) as Record<string, string>
const imgUrl = (name: string) =>
  Object.entries(imgModules).find(([k]) => k.endsWith(`/${name}`))?.[1] ?? ''

// Link tới trang chi tiết động: suy ra slug từ tên ảnh (sp-001.jpg -> tet-an-tam-001)
const detailHref = (img: string) => `/san-pham/tet-an-tam-${img.match(/\d+/)?.[0] ?? ''}`

// Nền đặt trên lớp fixed riêng (không dùng body background-attachment:fixed)
// để backdrop-filter của widget blur hoạt động đúng trên trang chủ.
useHead({
  style: [
    { innerHTML: `html,body{min-height:100%;margin:0;background:#333;}` },
  ],
})

// Các card preview (đã bỏ link ngoài designesia.com & rác extension)
const previews = [
  { img: 'sp-001.jpg',    title: 'Tết An Tâm 001', target: '_blank', href: '/san-pham-detail/' },
  { img: 'sp-002.jpg',      title: 'Tết An Tâm 002', target: '_blank', href: '/san-pham-detail/' },
  { img: 'sp-004.jpg',    title: 'Tết An Tâm 004', target: '_blank', href: '/san-pham-detail/' },
  { img: 'sp-005.jpg',    title: 'Tết An Tâm 005', target: '_blank', href: '/san-pham-detail/' },
  { img: 'sp-006.jpg',    title: 'Tết An Tâm 006', target: '_blank', href: '/san-pham-detail/' },
  { img: 'sp-003.jpg',    title: 'Tết An Tâm 003', target: '_blank', href: '/san-pham-detail/' },
  { img: 'sp-007.jpg',    title: 'Tết An Tâm 007', target: '_blank', href: '/san-pham-detail/' },
  ]
</script>

<template>
  <div id="wrapper" class="home-page">
    <div class="home-page-bg" :style="{ backgroundImage: `url(${bgUrl})` }" aria-hidden="true" />
    <LayoutGlobalWidgets />

    <div class="home-main">
      <div class="container text-center">
        <div class="row">
          <div class="col-md-8 col-md-offset-4">
            <div class="row">
              <div class="col-md-12">
                <h4>{{ t('products.label') }}</h4>
              </div>

              <template v-for="(p, i) in previews" :key="p.img">
                <div class="col-md-6 mb30">
                  <a :href="detailHref(p.img)" :target="p.target" class="preview-link">
                    <img :src="imgUrl(p.img)" class="img-responsive" :alt="p.title">
                  </a>
                  <h2>{{ p.title }}</h2>
                </div>
                <div v-if="i % 2 === 1" class="clearfix" />
              </template>

              <div class="col-md-12" style="margin-top: 0px; text-align: right;">
                <NuxtLink :to="localePath('/san-pham-list')" class="see-more">
                  <span>{{ t('common.viewMore') }}</span>
                  <svg class="see-more-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <HomeNewsTicker />
    </div>

    <div class="home-footer-wrap">
      <LayoutAppFooter />
    </div>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: transparent;
}

.home-page-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-color: #333;
  background-repeat: no-repeat;
  background-position: top center;
  background-size: 100%;
}

.home-main {
  position: relative;
  z-index: 1;
  flex: 1 0 auto;
  display: flow-root;
  padding-bottom: 24px;
}

.home-footer-wrap {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  clear: both;
  margin-top: auto;
}
/* Link "Xem thêm": chữ trắng, mũi tên phải ở cuối, căn phải. */
.see-more {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #fff;
  text-decoration: none;
  font-size: 13px;
  letter-spacing: .04em;
  transition: gap .25s ease, opacity .25s ease;
}
.see-more:hover { opacity: .85; gap: 10px; }
.see-more-ic { width: 16px; height: 16px; }
@media (prefers-reduced-motion: reduce) {
  .see-more { transition: none; }
}

/* Khung preview cố định tối đa 346x197, không phụ thuộc kích thước ảnh thật.
   - max-width + aspect-ratio: khung không bao giờ vượt 346x197, tự co trên màn nhỏ.
   - overflow:hidden + object-fit:cover: ảnh lấp đầy khung, phần thừa bị cắt. */
.preview-link {
  position: relative;
  display: block;
  width: 100%;
  max-width: 346px;
  aspect-ratio: 346 / 197;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 6px;
  /* nền trà đậm phía sau ảnh, lộ ra khi ảnh phóng/sáng dần */
  background: #2a3326;
  box-shadow: 0 6px 18px rgba(0, 0, 0, .28);
  transform: translateZ(0);
  transition: transform .45s cubic-bezier(.22, .61, .36, 1),
              box-shadow .45s cubic-bezier(.22, .61, .36, 1);
  will-change: transform;
}

/* override mọi rule width/padding cũ (vd .col-md-6 img trong style.css) */
.preview-link img.img-responsive {
  width: 100%;
  height: 100%;
  max-width: 100%;
  padding: 0;
  object-fit: cover;
  display: block;
  /* zoom điện ảnh + tinh chỉnh sắc độ bằng transform/filter (GPU, không reflow) */
  transition: transform .6s cubic-bezier(.22, .61, .36, 1),
              filter .45s ease;
  will-change: transform;
}

/* Lớp phủ xanh trà dâng từ đáy — gợi hơi trà, tạo chiều sâu & nền cho tiêu đề. */
.preview-link::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(to top,
              rgba(77, 124, 58, .60) 0%,
              rgba(77, 124, 58, .18) 35%,
              transparent 68%);
  opacity: 0;
  transition: opacity .45s ease;
  pointer-events: none;
}

/* Viền trong mảnh vàng đồng — khung nhã, hiện nhẹ khi hover (thay viền bệt cũ). */
.preview-link::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 2;
  border-radius: 6px;
  box-shadow: inset 0 0 0 1px rgba(201, 168, 108, 0);
  transition: box-shadow .45s ease;
  pointer-events: none;
}

/* ── Hover: nâng nhẹ + đổ bóng sâu + zoom ảnh + phủ trà + khung phát sáng ── */
.preview-link:hover {
  transform: translateY(-4px);
  /* bóng chiều sâu + hào quang vàng ấm tỏa ra NGOÀI khung (không bị overflow cắt) */
  box-shadow: 0 16px 34px rgba(0, 0, 0, .45),
              0 0 28px rgba(201, 168, 108, .40);
}
.preview-link:hover img.img-responsive {
  transform: scale(1.06);
  /* sáng & tươi hơn để ảnh như được rọi sáng từ khung */
  filter: saturate(1.1) brightness(1.06);
}
.preview-link:hover::after { opacity: 1; }

/* Khung phát sáng: viền sắc nét + ánh sáng lan VÀO TRONG phủ lên mép ảnh,
   kèm nhịp "thở" nhẹ tạo cảm giác ánh sáng sống động. */
.preview-link:hover::before {
  animation: edge-glow 2.4s ease-in-out infinite;
}

@keyframes edge-glow {
  0%, 100% {
    box-shadow: inset 0 0 0 1px rgba(201, 168, 108, .85),
                inset 0 0 16px rgba(201, 168, 108, .35);
  }
  50% {
    box-shadow: inset 0 0 0 1px rgba(201, 168, 108, 1),
                inset 0 0 30px rgba(201, 168, 108, .60);
  }
}

/* Tôn trọng người dùng giảm chuyển động */
@media (prefers-reduced-motion: reduce) {
  .preview-link,
  .preview-link img.img-responsive,
  .preview-link::after,
  .preview-link::before {
    transition-duration: .01ms;
  }
  .preview-link:hover { transform: none; }
  .preview-link:hover img.img-responsive { transform: none; }
  /* tắt nhịp thở, giữ glow tĩnh */
  .preview-link:hover::before {
    animation: none;
    box-shadow: inset 0 0 0 1px rgba(201, 168, 108, .9),
                inset 0 0 22px rgba(201, 168, 108, .5);
  }
}

/* Trình duyệt cũ không hỗ trợ aspect-ratio: chốt chiều cao tối đa theo tỉ lệ. */
@supports not (aspect-ratio: 1) {
  .preview-link {
    max-height: 197px;
  }
}
</style>
