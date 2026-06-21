<script setup lang="ts">
const { t } = useI18n()
const { salon } = useSettings()

useScrollAnimation()

useSeoMeta({
  title: () => `${t('nav.team')} | ${salon.value.name}`,
  description: () => t('team.subtitle'),
})
</script>

<template>
  <div class="bg-dark">
    <LayoutPageHero
      :label="t('team.specialist')"
      :title="t('team.title')"
      :subtitle="t('team.subtitle')"
    />
    <SectionsTeamFull />
  </div>
</template>
