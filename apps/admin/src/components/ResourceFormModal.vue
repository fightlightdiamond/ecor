<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useMutation, useQuery } from '@tanstack/vue-query';
import Modal from './Modal.vue';
import { api } from '../lib/api';
import { coerce, displayCell, editableKeys, kindOf, type FieldKind } from '../lib/fields';
import { RESOURCE_LABEL } from '../resources';

const props = defineProps<{
  resource: string;
  mode: 'create' | 'edit' | 'show';
  id?: string | number | null;
}>();
const emit = defineEmits<{ (e: 'close'): void; (e: 'saved'): void }>();

const isCreate = computed(() => props.mode === 'create');

const oneQ = useQuery({
  queryKey: ['one', props.resource, props.id],
  queryFn: () => api.getOne(props.resource, props.id!),
  enabled: computed(() => !isCreate.value && props.id != null),
});
const sampleQ = useQuery({
  queryKey: ['sample', props.resource],
  queryFn: () => api.list(props.resource, { perPage: 1 }),
  enabled: isCreate,
});

const record = computed<Record<string, any> | undefined>(() =>
  isCreate.value ? sampleQ.data.value?.data?.[0] : (oneQ.data.value as any),
);
const kinds = computed<Record<string, FieldKind>>(() => {
  const k: Record<string, FieldKind> = {};
  const r = record.value;
  if (r) for (const key of editableKeys(r)) k[key] = kindOf(r[key]);
  return k;
});

const values = ref<Record<string, any>>({});
watch(
  record,
  (r) => {
    if (!r) return;
    if (isCreate.value) {
      const blank: Record<string, any> = {};
      for (const key of editableKeys(r)) blank[key] = kindOf(r[key]) === 'bool' ? false : '';
      values.value = blank;
    } else {
      const v: Record<string, any> = {};
      for (const key of editableKeys(r)) {
        v[key] = kinds.value[key] === 'json' && r[key] != null ? JSON.stringify(r[key], null, 2) : r[key];
      }
      values.value = v;
    }
  },
  { immediate: true },
);

const loading = computed(() => (isCreate.value ? sampleQ.isLoading.value : oneQ.isLoading.value));
const title = computed(
  () =>
    `${props.mode === 'create' ? 'Thêm' : props.mode === 'edit' ? 'Sửa' : 'Chi tiết'} — ${
      RESOURCE_LABEL[props.resource] ?? props.resource
    }`,
);
const errorMsg = ref('');

const save = useMutation({
  mutationFn: (payload: Record<string, any>) =>
    isCreate.value ? api.create(props.resource, payload) : api.update(props.resource, props.id!, payload),
  onSuccess: () => emit('saved'),
  onError: (e: any) => {
    errorMsg.value = e?.errors
      ? Object.values(e.errors).flat().join(', ')
      : e?.message || 'Lưu thất bại';
  },
});

function submit() {
  errorMsg.value = '';
  const payload: Record<string, any> = {};
  for (const key of Object.keys(values.value)) payload[key] = coerce(values.value[key], kinds.value[key] ?? 'text');
  save.mutate(payload);
}
</script>

<template>
  <Modal :title="title" @close="emit('close')">
    <div v-if="loading" class="text-gray-400">Đang tải…</div>

    <div v-else-if="isCreate && !record" class="text-sm text-gray-600">
      Chưa có bản ghi mẫu để suy ra trường nhập. Hãy tạo 1 bản ghi mẫu trong DB trước.
    </div>

    <!-- SHOW (chỉ đọc) -->
    <div v-else-if="mode === 'show' && record" class="divide-y divide-gray-100">
      <div v-for="(val, key) in record" :key="key" class="grid grid-cols-3 gap-3 py-2 text-sm">
        <div class="font-medium text-gray-500">{{ key }}</div>
        <div class="col-span-2 whitespace-pre-wrap break-words">{{ displayCell(val) }}</div>
      </div>
    </div>

    <!-- CREATE / EDIT -->
    <form v-else class="space-y-4" @submit.prevent="submit">
      <div v-if="errorMsg" class="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{{ errorMsg }}</div>

      <div v-for="(_, key) in values" :key="key">
        <label class="label">
          {{ key }} <span class="text-xs text-gray-400">({{ kinds[key] ?? 'text' }})</span>
        </label>
        <input v-if="kinds[key] === 'bool'" type="checkbox" v-model="values[key]" class="h-4 w-4" />
        <textarea v-else-if="kinds[key] === 'json'" v-model="values[key]" rows="5" class="input font-mono" />
        <input v-else-if="kinds[key] === 'number'" type="number" v-model="values[key]" class="input" />
        <input v-else v-model="values[key]" class="input" />
      </div>

      <div class="flex justify-end gap-2 border-t border-gray-100 pt-4">
        <button type="button" class="btn-outline" @click="emit('close')">Huỷ</button>
        <button class="btn-primary" :disabled="save.isPending.value">
          {{ save.isPending.value ? 'Đang lưu…' : 'Lưu' }}
        </button>
      </div>
    </form>

    <!-- footer cho SHOW -->
    <div v-if="mode === 'show'" class="flex justify-end border-t border-gray-100 pt-4">
      <button class="btn-outline" @click="emit('close')">Đóng</button>
    </div>
  </Modal>
</template>
