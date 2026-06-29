<script setup lang="ts">
const { t } = useI18n()
const { site } = useSettings()

useScrollAnimation()

useSeoMeta({
  title: () => `${t('nav.services')} | ${site.value.name}`,
  description: () => t('services.subtitle'),
})
</script>

<template>
  <div class="bg-dark">
    <LayoutPageHero
      :label="t('services.fullServices')"
      :title="t('services.title')"
      :subtitle="t('services.subtitle')"
    />
    <SectionsServicesTabs />
  </div>
</template>
