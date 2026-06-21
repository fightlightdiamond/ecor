<script setup lang="ts">
const { t } = useI18n()
const { salon } = useSettings()

useScrollAnimation()

useSeoMeta({
  title: () => `${t('nav.contact')} | ${salon.value.name}`,
  description: () => t('contact.subtitle'),
})
</script>

<template>
  <div>
    <LayoutPageHero
      :label="t('nav.contact')"
      :title="t('contact.title')"
      :subtitle="t('contact.subtitle')"
    />
    <SectionsContactSection />
  </div>
</template>
