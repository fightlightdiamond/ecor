<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { AlertCircle } from 'lucide-vue-next';
import Modal from './Modal.vue';
import FormField from './FormField.vue';
import { api } from '../lib/api';
import { editableKeys } from '../lib/fields';
import {
  autofill, column, composeValue, getLayout, getPath, getVirtual, initValue, isFieldEmpty,
  OPTIONS_TOKEN, resolveField, setPath, type FieldConfig, type FieldType,
} from '../lib/schema';
import { RESOURCE_TITLE } from '../resources';

const props = defineProps<{
  resource: string;
  mode: 'create' | 'edit' | 'show';
  id?: string | number | null;
}>();
const emit = defineEmits<{ (e: 'close'): void; (e: 'saved'): void }>();

const isCreate = computed(() => props.mode === 'create');
const isShow = computed(() => props.mode === 'show');
const layout = computed(() => getLayout(props.resource));
// Quy về danh sách "vùng" để render: 1 vùng (1 cột) hoặc 2 vùng (trái/phải).
const regions = computed(() => {
  const l = layout.value;
  if (!l) return null;
  if (Array.isArray(l)) return [{ rows: l, span: '' }];
  return [
    { rows: l.left, span: 'lg:col-span-2' },
    { rows: l.right, span: '' },
  ];
});
const layoutGrid = computed(() => !!regions.value && regions.value.length > 1);
const { data: identity } = useQuery({ queryKey: ['me'], queryFn: () => api.me(), retry: false });

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

interface Item { key: string; cfg: FieldConfig; path?: string }
const allItems = computed<Item[]>(() => {
  const r = record.value;
  if (!r) return [];
  const real: Item[] = editableKeys(r)
    .map((key) => ({ key, cfg: resolveField(props.resource, key, r[key]) }))
    .filter((i) => i.cfg.type !== 'hidden');
  const virt: Item[] = getVirtual(props.resource).map((v) => ({
    key: v.key,
    path: v.path,
    cfg: { label: v.label, type: v.type, required: v.required, hint: v.hint, readonly: v.readonly },
  }));
  return [...real, ...virt];
});
// Cột bố cục: ưu tiên override cfg.col, mặc định theo loại field.
const colOf = (i: Item) => i.cfg.col ?? column(i.cfg.type);
const leftItems = computed(() => allItems.value.filter((i) => colOf(i) === 'left'));
const rightItems = computed(() =>
  allItems.value.filter((i) => colOf(i) === 'right' && i.cfg.type !== 'boolean'),
);
const boolItems = computed(() => allItems.value.filter((i) => i.cfg.type === 'boolean'));
// Tra cứu item theo key cho bố cục tuỳ biến (layout).
const itemByKey = computed<Record<string, Item>>(() =>
  Object.fromEntries(allItems.value.map((i) => [i.key, i])),
);

const values = ref<Record<string, any>>({});
function blank(type: FieldType) {
  if (type === 'localized' || type === 'localizedRich') return { vi: '', en: '' };
  if (type === 'images') return [];
  if (type === 'boolean') return false;
  return '';
}
watch(
  record,
  (r) => {
    if (!r) return;
    const v: Record<string, any> = {};
    for (const item of allItems.value) {
      const raw = item.path ? getPath(r, item.path) : r[item.key];
      // Tạo mới: ưu tiên defaultValue (vd status='published'), nếu không thì giá trị rỗng theo type.
      v[item.key] = isCreate.value
        ? item.cfg.defaultValue ?? blank(item.cfg.type)
        : initValue(item.cfg.type, raw);
    }
    values.value = v;
  },
  { immediate: true },
);

const loading = computed(() => (isCreate.value ? sampleQ.isLoading.value : oneQ.isLoading.value));
const title = computed(
  () =>
    `${props.mode === 'create' ? 'Thêm' : props.mode === 'edit' ? 'Sửa' : 'Chi tiết'} — ${
      RESOURCE_TITLE[props.resource] ?? props.resource
    }`,
);
const err = ref('');
// Lỗi từng trường bắt buộc (key → nhãn), để tô đỏ tại chỗ.
const fieldErrors = ref<Record<string, string>>({});

/** Trả về map { key: label } các trường bắt buộc còn bỏ trống. */
function validate(): Record<string, string> {
  const miss: Record<string, string> = {};
  for (const item of allItems.value) {
    if (!item.cfg.required) continue;
    if (isFieldEmpty(item.cfg.type, values.value[item.key])) miss[item.key] = item.cfg.label;
  }
  return miss;
}

// Khi người dùng nhập, gỡ lỗi cho các trường đã có giá trị (phản hồi tức thì).
watch(
  values,
  (v) => {
    if (!Object.keys(fieldErrors.value).length) return;
    const next = { ...fieldErrors.value };
    for (const key of Object.keys(next)) {
      const item = itemByKey.value[key];
      if (item && !isFieldEmpty(item.cfg.type, v[key])) delete next[key];
    }
    fieldErrors.value = next;
  },
  { deep: true },
);

const save = useMutation({
  mutationFn: () => {
    const payload: Record<string, any> = {};
    for (const item of allItems.value) {
      if (item.path) continue; // virtual xử lý sau
      payload[item.key] = composeValue(item.cfg.type, values.value[item.key]);
    }
    if (isCreate.value) Object.assign(payload, autofill(props.resource, identity.value));
    for (const item of allItems.value) {
      if (!item.path) continue;
      setPath(payload, item.path, composeValue(item.cfg.type, values.value[item.key]));
    }
    return isCreate.value
      ? api.create(props.resource, payload)
      : api.update(props.resource, props.id!, payload);
  },
  onSuccess: () => emit('saved'),
  onError: (e: any) => {
    err.value = e?.errors ? Object.values(e.errors).flat().join(', ') : e?.message || 'Lưu thất bại';
  },
});

function submit() {
  err.value = '';
  const miss = validate();
  fieldErrors.value = miss;
  const labels = Object.values(miss);
  if (labels.length) {
    err.value = `Vui lòng nhập đầy đủ ${labels.length} trường bắt buộc: ${labels.join(', ')}.`;
    return;
  }
  save.mutate();
}
</script>

<template>
  <Modal :title="title" fullscreen @close="emit('close')">
    <div v-if="loading" class="text-gray-400">Đang tải…</div>

    <div v-else-if="isCreate && !record" class="text-sm text-gray-600">
      Chưa có bản ghi mẫu để suy ra trường nhập.
    </div>

    <!-- XEM / THÊM / SỬA — dùng chung 1 bố cục; chế độ Xem chỉ khoá nhập liệu -->
    <form v-else class="mx-auto max-w-6xl pb-12" @submit.prevent="submit">
      <div v-if="err" class="mb-4 flex items-start gap-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        <AlertCircle class="mt-0.5 h-4 w-4 shrink-0" />
        <span>{{ err }}</span>
      </div>

      <fieldset :disabled="isShow" class="m-0 min-w-0 border-0 p-0">
        <!-- Bố cục tuỳ biến theo resource (vd Danh mục): 1 vùng (1 cột) hoặc 2 vùng (trái/phải) -->
        <div v-if="regions" :class="layoutGrid ? 'grid grid-cols-1 gap-6 lg:grid-cols-3' : ''">
          <div v-for="(region, idx) in regions" :key="idx" class="space-y-5" :class="region.span">
          <template v-for="(row, ri) in region.rows" :key="ri">
            <!-- Hộp tuỳ chọn (các trường boolean) -->
            <div
              v-if="row.length === 1 && row[0] === OPTIONS_TOKEN"
              v-show="boolItems.length"
              class="rounded-md border border-gray-200 p-3"
            >
              <div class="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">Tuỳ chọn</div>
              <div class="flex flex-wrap gap-4">
                <label v-for="item in boolItems" :key="item.key" class="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" v-model="values[item.key]" class="h-4 w-4" />
                  {{ item.cfg.label }}
                </label>
              </div>
            </div>
            <!-- Hàng field thường: 1 hoặc 2 ô/hàng -->
            <div v-else class="grid gap-5" :class="row.length >= 2 ? 'sm:grid-cols-2' : 'grid-cols-1'">
              <template v-for="key in row" :key="key">
                <FormField
                  v-if="itemByKey[key]"
                  :cfg="itemByKey[key].cfg"
                  v-model="values[key]"
                  :readonly="isShow || !!itemByKey[key].cfg.readonly"
                  :error="fieldErrors[key]"
                />
              </template>
            </div>
          </template>
          </div>
        </div>

        <!-- Bố cục mặc định: trái 2/3 (nội dung) — phải 1/3 (cấu hình) -->
        <div v-else class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div class="space-y-5 lg:col-span-2">
            <FormField v-for="item in leftItems" :key="item.key" :cfg="item.cfg" v-model="values[item.key]" :readonly="isShow || !!item.cfg.readonly" :error="fieldErrors[item.key]" />
          </div>

          <div class="space-y-5">
            <FormField v-for="item in rightItems" :key="item.key" :cfg="item.cfg" v-model="values[item.key]" :readonly="isShow || !!item.cfg.readonly" :error="fieldErrors[item.key]" />

            <div v-if="boolItems.length" class="rounded-md border border-gray-200 p-3">
              <div class="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">Tuỳ chọn</div>
              <div class="flex flex-wrap gap-4">
                <label v-for="item in boolItems" :key="item.key" class="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" v-model="values[item.key]" class="h-4 w-4" />
                  {{ item.cfg.label }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </fieldset>

      <div class="fixed w-full bottom-0 mt-6 flex justify-end gap-2 border-t border-gray-200 bg-white py-3 mx-0 left-0 px-6">
        <button type="button" class="btn-outline" @click="emit('close')">{{ isShow ? 'Đóng' : 'Huỷ' }}</button>
        <button v-if="!isShow" class="btn-primary" :disabled="save.isPending.value">
          {{ save.isPending.value ? 'Đang lưu…' : 'Lưu' }}
        </button>
      </div>
    </form>
  </Modal>
</template>
