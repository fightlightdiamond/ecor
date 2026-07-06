<script setup lang="ts">
const { t } = useI18n()

useScrollAnimation()

useSeoMeta({
  title: () => t('nav.blogMenu.vietTea'),
})
</script>

<template>
  <LayoutComingSoonSection :label="t('nav.blog')" :title="t('nav.blogMenu.vietTea')" />
</template>
