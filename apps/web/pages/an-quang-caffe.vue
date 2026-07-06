<script setup lang="ts">
const { t } = useI18n()

useScrollAnimation()

useSeoMeta({
  title: () => t('nav.productsMenu.anQuangCaffe'),
})
</script>

<template>
  <LayoutComingSoonSection :label="t('nav.products')" :title="t('nav.productsMenu.anQuangCaffe')" />
</template>
