// Trạng thái overlay dùng chung cho các widget nổi (lang switch, connect...).
// Khi có ít nhất 1 widget mở -> backdrop làm mờ toàn trang được bật.
const openIds = reactive(new Set<string>())
const closeEpoch = ref(0)

export function useUiOverlay() {
  const active = computed(() => openIds.size > 0)

  const setOpen = (id: string, open: boolean) => {
    if (open) openIds.add(id)
    else openIds.delete(id)
  }

  const closeAll = () => {
    if (!openIds.size) return
    openIds.clear()
    closeEpoch.value++
  }

  return { active, setOpen, closeEpoch, closeAll }
}
