<script setup lang="ts">
const { t } = useI18n()
const { site } = useSettings()

useScrollAnimation()

useSeoMeta({
  title: () => `${t('nav.blog')} | ${site.value.name}`,
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
