<script setup lang="ts">
const { t, locale } = useI18n()
const { salon } = useSettings()

useSeoMeta({
  titleTemplate: (title) => title ? `${title} | ${salon.value.name}` : salon.value.name,
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
