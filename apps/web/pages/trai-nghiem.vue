<script setup lang="ts">
const { t } = useI18n()

useScrollAnimation()

useSeoMeta({
  title: () => t('nav.events'),
})
</script>

<template>
  <LayoutComingSoonSection :label="t('nav.events')" :title="t('nav.events')" />
</template>
