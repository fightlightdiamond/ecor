<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const toast = useState<string | null>('cart_toast', () => null)

let hideTimer: ReturnType<typeof setTimeout> | undefined

watch(toast, (value) => {
  if (!value) return
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    toast.value = null
  }, 3500)
})

onUnmounted(() => {
  if (hideTimer) clearTimeout(hideTimer)
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-300"
    enter-from-class="opacity-0 translate-y-3"
    leave-active-class="transition duration-200"
    leave-to-class="opacity-0 translate-y-3"
  >
    <div
      v-if="toast"
      class="fixed bottom-5 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-4
             bg-dark-700 border border-primary-500/50 text-white text-sm
             px-5 py-3.5 rounded-lg shadow-2xl"
      role="status"
      aria-live="polite"
    >
      <svg class="w-5 h-5 text-primary-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M20 6 9 17l-5-5" />
      </svg>
      <span>{{ toast }}</span>
      <NuxtLink
        :to="localePath('/gio-hang')"
        class="text-primary-400 hover:text-primary-300 font-medium whitespace-nowrap"
        @click="toast = null"
      >
        {{ t('cart.view') }}
      </NuxtLink>
    </div>
  </Transition>
</template>
