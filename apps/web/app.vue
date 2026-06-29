<script setup lang="ts">
const { t, locale } = useI18n()
const { site } = useSettings()

useSeoHreflang()

useSeoMeta({
  titleTemplate: (title) => title ? `${title} | ${site.value.name}` : site.value.name,
  ogSiteName: 'Thăng Long Chè Việt',
})

useHead({
  htmlAttrs: { lang: locale },
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
