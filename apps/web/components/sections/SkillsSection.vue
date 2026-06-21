<script setup lang="ts">
const { t } = useI18n()
const { skills } = useSettings()
</script>

<template>
  <section class="section-py bg-[#27282b] text-white" aria-labelledby="skills-heading">
    <div class="container-page">
      <div class="text-center mb-10 md:mb-14 animate-on-scroll">
        <p class="font-condensed text-primary-400 text-xs uppercase tracking-[0.25em] mb-3">
          {{ t('skills.eyebrow') }}
        </p>
        <h2 id="skills-heading" class="section-heading text-white mb-4">
          {{ t('skills.title') }}
        </h2>
        <div class="divider-gold" />
      </div>

      <div class="max-w-3xl mx-auto space-y-6 md:space-y-8">
        <div
          v-for="skill in skills"
          :key="skill.id"
          class="animate-on-scroll"
        >
          <div class="flex justify-between items-baseline mb-2">
            <h3 class="text-sm md:text-base font-medium uppercase tracking-wider text-white/80">
              {{ skill.label }}
            </h3>
            <span class="text-primary-400 text-sm font-semibold">{{ skill.percent }}%</span>
          </div>
          <div class="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full
                     transition-all duration-1000 ease-out modis-skill-bar"
              :style="{ width: `${skill.percent}%` }"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.modis-skill-bar {
  animation: growBar 1.2s ease-out forwards;
}

@keyframes growBar {
  from { width: 0 !important; }
}
</style>
