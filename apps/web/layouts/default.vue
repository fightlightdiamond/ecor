<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#1a1a1a]">
    <LayoutAppHeader />
    <!-- <LayoutGlobalWidgets /> -->
    <main id="main-content" class="flex-1 pt-[72px]">
      <slot />
    </main>
    <LayoutAppFooter />
  </div>
</template>
