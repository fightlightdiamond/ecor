<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { X } from 'lucide-vue-next';

defineProps<{ title?: string }>();
const emit = defineEmits<{ (e: 'close'): void }>();

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close');
}
onMounted(() => window.addEventListener('keydown', onKey));
onUnmounted(() => window.removeEventListener('keydown', onKey));
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4"
      @click.self="emit('close')"
    >
      <div class="card my-8 w-full max-w-2xl">
        <div class="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <h2 class="text-lg font-semibold">{{ title }}</h2>
          <button class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700" @click="emit('close')">
            <X class="h-5 w-5" />
          </button>
        </div>
        <div class="max-h-[75vh] overflow-y-auto p-5">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>
