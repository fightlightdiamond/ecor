<script setup lang="ts">
import MediaPickerModal from './components/MediaPickerModal.vue';
</script>

<template>
  <RouterView />
  <!-- Popup kho media dùng chung (RichText chèn ảnh/video, FormField chọn ảnh, …) -->
  <MediaPickerModal />
</template>
