<script setup lang="ts">
const { t } = useI18n()
const { salon } = useSettings()

useScrollAnimation()

useSeoMeta({
  title: () => `${t('nav.blog')} | ${salon.value.name}`,
  description: () => t('blog.subtitle'),
})
</script>

<template>
  <div class="bg-dark">
    <LayoutPageHero
      :label="t('blog.eyebrow')"
      :title="t('blog.title')"
      :subtitle="t('blog.subtitle')"
    />
    <SectionsBlogList />
  </div>
</template>
