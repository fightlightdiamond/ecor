// Media-picker dùng chung toàn cục: mount <MediaPickerModal/> 1 lần ở App.vue,
// mọi nơi gọi useMediaPicker().pickOne()/pickMany() để mở popup và nhận URL.
import { ref } from 'vue';

export type PickMode = 'single' | 'multi';
export type PickAccept = 'image' | 'video' | 'all';

export const pickerOpen = ref(false);
export const pickerMode = ref<PickMode>('single');
export const pickerAccept = ref<PickAccept>('all');
let resolver: ((urls: string[] | null) => void) | null = null;

/** Mở popup và chờ kết quả (mảng URL đã chọn, hoặc null nếu huỷ). */
export function requestPick(mode: PickMode, accept: PickAccept = 'all'): Promise<string[] | null> {
  pickerMode.value = mode;
  pickerAccept.value = accept;
  pickerOpen.value = true;
  return new Promise((resolve) => {
    resolver = resolve;
  });
}

/** MediaPickerModal gọi khi người dùng xác nhận/huỷ. */
export function resolvePick(urls: string[] | null) {
  pickerOpen.value = false;
  const r = resolver;
  resolver = null;
  r?.(urls);
}

export function useMediaPicker() {
  return {
    /** Chọn 1 media → URL (hoặc null). accept: 'image' | 'video' | 'all'. */
    async pickOne(accept: PickAccept = 'image'): Promise<string | null> {
      const urls = await requestPick('single', accept);
      return urls && urls.length ? urls[0] : null;
    },
    /** Chọn nhiều media → mảng URL (hoặc null). */
    pickMany(accept: PickAccept = 'image'): Promise<string[] | null> {
      return requestPick('multi', accept);
    },
  };
}
