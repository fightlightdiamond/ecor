<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules'

const { testimonials } = useTestimonials()

const { t } = useI18n()

const modules = [Autoplay, Pagination]
</script>

<template>
  <section class="section-py bg-[#222] text-white" aria-labelledby="testimonials-heading">
    <div class="container-page">
      <div class="text-center mb-10 md:mb-14 animate-on-scroll">
        <h2 id="testimonials-heading" class="section-heading text-white mb-4">
          {{ t('testimonials.title') }}
        </h2>
        <div class="divider-gold" />
      </div>

      <ClientOnly>
        <Swiper
          :modules="modules"
          :slides-per-view="1"
          :space-between="24"
          :loop="true"
          :autoplay="{ delay: 6000, disableOnInteraction: false }"
          :pagination="{ clickable: true }"
          :breakpoints="{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 2 },
          }"
          class="testimonials-swiper pb-12 animate-on-scroll"
        >
          <SwiperSlide v-for="item in testimonials" :key="item.id">
            <blockquote class="bg-white/5 border border-white/10 p-6 md:p-8 h-full">
              <p class="text-white/70 text-sm md:text-base leading-relaxed mb-6 italic">
                "{{ item.quote }}"
              </p>
              <footer>
                <cite class="not-italic">
                  <span class="text-primary-400 font-semibold">{{ item.author }}</span>
                  <span class="text-white/40 text-sm">, {{ item.role }}</span>
                </cite>
              </footer>
            </blockquote>
          </SwiperSlide>
        </Swiper>
      </ClientOnly>
    </div>
  </section>
</template>

<style>
@import 'swiper/css';
@import 'swiper/css/pagination';

.testimonials-swiper .swiper-pagination-bullet {
  background: rgba(255, 255, 255, 0.4) !important;
}
.testimonials-swiper .swiper-pagination-bullet-active {
  background: #c9a86c !important;
}
</style>
