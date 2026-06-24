<script setup lang="ts">
const { t, locale } = useI18n()

// Danh sách sản phẩm ưu đãi (tạm thời hardcode, sau sẽ fetch từ API)
const promotions = computed(() => [
  {
    id: 1,
    name: { vi: 'Trà Shan Tuyết Cổ Thụ', en: 'Ancient Shan Tuyet Tea' },
    originalPrice: 850000,
    discountPrice: 595000,
    discount: 30,
    image: 'tlcv_nep_che_viet.jpg',
  },
  {
    id: 2,
    name: { vi: 'Trà Sen Hồ Tây', en: 'Lotus Tea West Lake' },
    originalPrice: 650000,
    discountPrice: 455000,
    discount: 30,
    image: 'tlcv_san_pham.jpg',
  },
  {
    id: 3,
    name: { vi: 'Trà Ô Long Đài Loan', en: 'Taiwan Oolong Tea' },
    originalPrice: 580000,
    discountPrice: 406000,
    discount: 30,
    image: 'tlcv_can_tinh_viet_001.jpg',
  },
  {
    id: 4,
    name: { vi: 'Trà Móc Câu Kim Tuyên', en: 'Kim Tuyen Hooked Tea' },
    originalPrice: 720000,
    discountPrice: 504000,
    discount: 30,
    image: 'kp_thang_long_che_viet.jpg',
  },
  {
    id: 5,
    name: { vi: 'Trà Thái Nguyên Đặc Biệt', en: 'Thai Nguyen Special Tea' },
    originalPrice: 480000,
    discountPrice: 336000,
    discount: 30,
    image: 'tlcv_van_hoa_truyen_thong_001.jpg',
  },
])

const imgModules = import.meta.glob('~/assets/images/*.jpg', {
  eager: true,
  import: 'default',
}) as Record<string, string>
const imgUrl = (name: string) =>
  Object.entries(imgModules).find(([k]) => k.endsWith(`/${name}`))?.[1] ?? ''

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
}

const getLocalizedName = (item: typeof promotions.value[0]) => {
  return item.name[locale.value as 'vi' | 'en'] ?? item.name.vi
}
</script>

<template>
  <div class="promotions-card" role="group" :aria-label="t('home.pillars.promotions')">
    <div class="promo-viewport">
      <!-- Hai bản giống nhau xếp chồng để vòng lặp liền mạch (CSS-only) -->
      <div class="promo-track">
        <div v-for="n in 2" :key="n" class="promo-set" :aria-hidden="n === 2 ? 'true' : undefined">
          <div v-for="item in promotions" :key="`${n}-${item.id}`" class="promo-item">
            <div class="promo-badge">-{{ item.discount }}%</div>
            <div class="promo-image">
              <img :src="imgUrl(item.image)" :alt="getLocalizedName(item)" />
            </div>
            <div class="promo-info">
              <h4 class="promo-name">{{ getLocalizedName(item) }}</h4>
              <div class="promo-prices">
                <span class="promo-price-old">{{ formatPrice(item.originalPrice) }}</span>
                <span class="promo-price-new">{{ formatPrice(item.discountPrice) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Header title overlay -->
    <div class="promo-header">
      <span class="promo-icon" aria-hidden="true">🎁</span>
      <span class="promo-title">{{ t('home.pillars.promotions') }}</span>
    </div>
  </div>
</template>

<style scoped>
.promotions-card {
  position: relative;
  display: block;
  width: calc(100% - var(--pillar-gutter, 0px) * 2);
  margin-left: auto;
  margin-right: auto;
  max-width: none;
  aspect-ratio: 346 / 197;
  overflow: hidden;
  border-radius: 6px;
  background:
    radial-gradient(120% 90% at 82% 0%, rgba(196, 30, 58, .18), transparent 60%),
    linear-gradient(160deg, #1f1512 0%, #120e0c 100%);
  box-shadow: 1px 1px 6px 1px #666666;
}

@media (min-width: 1024px) {
  .promotions-card {
    max-width: 346px;
  }
}

/* Header title cố định ở đỉnh */
.promo-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background: linear-gradient(
    to bottom,
    rgba(196, 30, 58, .88) 0%,
    rgba(161, 12, 37, .72) 65%,
    rgba(161, 12, 37, 0) 100%
  );
  border-bottom: 1px solid rgba(255, 255, 255, .1);
}

.promo-icon {
  font-size: 16px;
  line-height: 1;
}

.promo-title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, .5);
}

/* Viewport cuộn */
.promo-viewport {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: 6px;
  padding-top: 48px; /* Chừa chỗ cho header */
  /* Làm mờ mép trên/dưới để item trôi vào/ra êm */
  -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 52px, #000 calc(100% - 16px), transparent 100%);
          mask-image: linear-gradient(to bottom, transparent 0, #000 52px, #000 calc(100% - 16px), transparent 100%);
}

/* Track = 2 bản .promo-set xếp chồng; dịch -50% là tròn đúng 1 bản -> lặp liền mạch */
.promo-track {
  display: flex;
  flex-direction: column;
  animation: promo-scroll 25s linear infinite;
  will-change: transform;
}

.promotions-card:hover .promo-track {
  animation-play-state: paused;
}

@keyframes promo-scroll {
  from { transform: translateY(0); }
  to   { transform: translateY(-50%); }
}

/* Mỗi bản tự chứa khoảng cách dẫn (padding + gap) đồng đều -> điểm nối phẳng */
.promo-set {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 12px 0;
}

/* Item sản phẩm */
.promo-item {
  position: relative;
  display: flex;
  gap: 10px;
  padding: 8px;
  background: rgba(255, 255, 255, .03);
  border: 1px solid rgba(255, 255, 255, .06);
  border-radius: 8px;
  transition: background .3s ease, border-color .3s ease;
}

.promo-item:hover {
  background: rgba(255, 255, 255, .06);
  border-color: rgba(196, 30, 58, .4);
}

/* Badge giảm giá */
.promo-badge {
  position: absolute;
  top: 4px;
  left: 4px;
  z-index: 2;
  padding: 3px 7px;
  background: linear-gradient(135deg, #c41e3a 0%, #a10c25 100%);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .03em;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(196, 30, 58, .5);
}

/* Ảnh sản phẩm */
.promo-image {
  position: relative;
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  background: #1a1a1a;
}

.promo-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Thông tin sản phẩm */
.promo-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0; /* Cho phép text truncate */
}

.promo-name {
  margin: 0;
  font-size: 11.5px;
  font-weight: 600;
  line-height: 1.3;
  color: #fff;
  /* Truncate tên sản phẩm nếu quá dài */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Giá */
.promo-prices {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: 4px;
}

.promo-price-old {
  font-size: 10px;
  color: rgba(255, 255, 255, .4);
  text-decoration: line-through;
}

.promo-price-new {
  font-size: 13px;
  font-weight: 700;
  color: #c41e3a;
  font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: reduce) {
  .promo-track {
    animation: none;
  }

  /* Không có chuyển động: cho phép cuộn tay để xem đủ nội dung */
  .promo-viewport {
    overflow-y: auto;
  }
}
</style>