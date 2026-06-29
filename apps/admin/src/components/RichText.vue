<script setup lang="ts">
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { useMediaPicker, type PickAccept } from '../lib/mediaPicker';

withDefaults(defineProps<{ modelValue: string; readonly?: boolean }>(), { readonly: false });
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>();

const { pickOne } = useMediaPicker();

// Chèn 1 embed (image/video) vào vị trí con trỏ.
async function insertEmbed(quill: any, kind: 'image' | 'video', accept: PickAccept) {
  const url = await pickOne(accept);
  if (!url) return;
  const range = quill.getSelection(true);
  const index = range ? range.index : quill.getLength();
  quill.insertEmbed(index, kind, url, 'user');
  quill.setSelection(index + 1, 0, 'silent');
}

// Khi Quill sẵn sàng: ghi đè nút "ảnh" và "video" để mở popup kho media.
function onReady(quill: any) {
  const toolbar = quill.getModule('toolbar');
  toolbar?.addHandler('image', () => insertEmbed(quill, 'image', 'image'));
  toolbar?.addHandler('video', () => insertEmbed(quill, 'video', 'video'));
}

// Toolbar đầy đủ (Quill "snow"): tiêu đề, cỡ chữ, định dạng, màu, danh sách,
// thụt lề, căn lề, trích dẫn, code, link/ảnh/video…
const toolbar = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ size: ['small', false, 'large', 'huge'] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ align: [] }],
  ['blockquote', 'code-block'],
  ['link', 'image', 'video'],
  ['clean'],
];
</script>

<template>
  <div class="rounded-md border border-gray-300">
    <QuillEditor
      :content="modelValue"
      contentType="html"
      theme="snow"
      :toolbar="toolbar"
      :read-only="readonly"
      @ready="onReady"
      @update:content="emit('update:modelValue', $event)"
    />
  </div>
</template>

<style>
.ql-container {
  min-height: 140px;
  font-size: 14px;
}
</style>
