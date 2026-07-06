<script setup lang="ts">
defineProps<{
  label?: string
  title: string
  subtitle?: string
}>()

const { t } = useI18n()
</script>

<template>
  <div class="bg-dark">
    <LayoutPageHero :label="label" :title="title" :subtitle="subtitle" />
    <section class="section-py bg-dark-800 text-white text-center">
      <div class="container-page max-w-xl mx-auto animate-on-scroll">
        <p class="text-white/60">{{ t('blog.comingSoon') }}</p>
      </div>
    </section>
  </div>
</template>
