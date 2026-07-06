<script setup lang="ts">
const { t } = useI18n()

useScrollAnimation()

useSeoMeta({
  title: () => t('nav.library'),
})
</script>

<template>
  <LayoutComingSoonSection :label="t('nav.library')" :title="t('nav.library')" />
</template>
