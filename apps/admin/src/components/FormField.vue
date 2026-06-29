<script setup lang="ts">
import { computed } from 'vue';
import { Info, AlertCircle, ImagePlus, Plus } from 'lucide-vue-next';
import { useQuery } from '@tanstack/vue-query';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ColorPicker } from 'vue3-colorpicker';
import 'vue3-colorpicker/style.css';
import RichText from './RichText.vue';
import type { FieldConfig } from '../lib/schema';
import { MULTILANG } from '../config';
import { api } from '../lib/api';
import { localeText } from '../lib/locale';
import { ICON_LIST } from '../lib/icons';
import { useMediaPicker } from '../lib/mediaPicker';

const { pickOne, pickMany } = useMediaPicker();

const props = withDefaults(
  defineProps<{ cfg: FieldConfig; modelValue: any; readonly?: boolean; error?: string }>(),
  { readonly: false, error: '' },
);
const emit = defineEmits<{ (e: 'update:modelValue', v: any): void }>();

function up(v: any) {
  emit('update:modelValue', v);
}

// ── relation: nạp danh sách từ resource khác (vd danh mục theo `for`) ──
const relQ = useQuery({
  queryKey: ['rel', props.cfg.relation?.resource, props.cfg.relation?.for],
  queryFn: () => api.list(props.cfg.relation!.resource, { perPage: 200 }),
  enabled: computed(() => props.cfg.type === 'relation' && !!props.cfg.relation),
});
const relOptions = computed(() => {
  const rows = (relQ.data.value?.data ?? []) as any[];
  const f = props.cfg.relation?.for;
  return rows
    .filter((r) => !f || r.for === f)
    .map((r) => ({ value: r.id, label: String(localeText(r.name) || r.slug || r.id) }));
});

// ── chọn ảnh qua popup kho media dùng chung ──
async function pickImage() {
  const url = await pickOne('image');
  if (url) up(url);
}
async function addImages() {
  const urls = await pickMany('image');
  if (!urls || !Array.isArray(props.modelValue)) return;
  for (const u of urls) if (!props.modelValue.includes(u)) props.modelValue.push(u);
}
// ── tags: preview các chip từ chuỗi nhập (cách nhau bởi dấu phẩy) ──
const tagChips = computed(() =>
  String(props.modelValue ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
);

// ── gallery ảnh (giống trang chi tiết sản phẩm) ──
function removeImage(i: number) {
  if (Array.isArray(props.modelValue)) props.modelValue.splice(i, 1);
}
/** Đưa ảnh thứ i lên đầu (= ảnh đại diện/thumbnail). */
function makeCover(i: number) {
  if (props.readonly || !Array.isArray(props.modelValue) || i === 0) return;
  const [img] = props.modelValue.splice(i, 1);
  props.modelValue.unshift(img);
}
</script>

<template>
  <div :class="error ? '-ml-2 border-l-2 border-red-400 pl-2' : ''">
    <!-- Localized: VI (và EN nếu bật đa ngôn ngữ) -->
    <template v-if="cfg.type === 'localized' || cfg.type === 'localizedRich'">
      <div class="label flex items-center gap-1">
        {{ cfg.label }}
        <span v-if="cfg.required" class="text-red-500">*</span>
        <span v-if="cfg.hint" :title="cfg.hint" class="cursor-help"><Info class="h-3.5 w-3.5 text-gray-400" /></span>
      </div>
      <div class="space-y-2">
        <div>
          <div v-if="MULTILANG" class="mb-1 text-xs text-gray-500">{{ cfg.label }} (Tiếng Việt)</div>
          <RichText v-if="cfg.type === 'localizedRich'" v-model="modelValue.vi" :readonly="readonly" />
          <input v-else class="input" v-model="modelValue.vi" />
        </div>
        <div v-if="MULTILANG">
          <div class="mb-1 text-xs text-gray-500">{{ cfg.label }} (Tiếng Anh)</div>
          <RichText v-if="cfg.type === 'localizedRich'" v-model="modelValue.en" :readonly="readonly" />
          <input v-else class="input" v-model="modelValue.en" />
        </div>
      </div>
    </template>

    <template v-else>
      <label class="label flex items-center gap-2">
        <input
          v-if="cfg.type === 'boolean'"
          type="checkbox"
          class="h-4 w-4"
          :checked="!!modelValue"
          @change="up(($event.target as HTMLInputElement).checked)"
        />
        {{ cfg.label }}
        <span v-if="cfg.required" class="text-red-500">*</span>
        <span v-if="cfg.hint" :title="cfg.hint" class="cursor-help"><Info class="h-3.5 w-3.5 text-gray-400" /></span>
      </label>

      <RichText v-if="cfg.type === 'richtext'" :model-value="modelValue" :readonly="readonly" @update:model-value="up($event)" />

      <!-- relation: dropdown danh mục -->
      <select
        v-else-if="cfg.type === 'relation'"
        class="input"
        :value="modelValue ?? ''"
        @change="up(($event.target as HTMLSelectElement).value === '' ? null : Number(($event.target as HTMLSelectElement).value))"
      >
        <option value="">— chọn —</option>
        <option v-for="o in relOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
      </select>

      <select v-else-if="cfg.type === 'select'" class="input" :value="modelValue" @change="up(($event.target as HTMLSelectElement).value)">
        <option value="">— chọn —</option>
        <option v-for="o in cfg.options" :key="o.value" :value="o.value">{{ o.label }}</option>
      </select>

      <!-- datetime: VueDatePicker -->
      <VueDatePicker
        v-else-if="cfg.type === 'datetime'"
        :model-value="modelValue"
        model-type="iso"
        format="dd/MM/yyyy HH:mm"
        :enable-time-picker="true"
        :disabled="readonly"
        auto-apply
        @update:model-value="up($event)"
      />

      <!-- color: vue3-colorpicker -->
      <div v-else-if="cfg.type === 'color'" class="flex items-center gap-2" :class="readonly ? 'pointer-events-none opacity-70' : ''">
        <ColorPicker :pure-color="modelValue || '#166534'" format="hex" @update:pure-color="up($event)" />
        <input class="input max-w-[140px]" :value="modelValue" placeholder="#166534" @input="up(($event.target as HTMLInputElement).value)" />
      </div>

      <!-- icon: chọn từ danh sách trực quan (lưu tên icon) -->
      <div v-else-if="cfg.type === 'icon'" class="space-y-2">
        <div class="grid grid-cols-8 gap-1.5 sm:grid-cols-12">
          <button
            v-for="ic in ICON_LIST"
            :key="ic.name"
            type="button"
            :title="ic.name"
            class="flex h-9 items-center justify-center rounded-md border"
            :class="modelValue === ic.name ? 'border-brand bg-brand/10 text-brand' : 'border-gray-200 text-gray-500 hover:bg-gray-100'"
            @click="up(modelValue === ic.name ? '' : ic.name)"
          >
            <component :is="ic.comp" class="h-4 w-4" />
          </button>
        </div>
        <p v-if="modelValue" class="text-xs text-gray-400">Đã chọn: {{ modelValue }}</p>
      </div>

      <!-- boolean: checkbox (khi đặt trực tiếp trong hàng layout) -->
       <template v-else-if="cfg.type === 'boolean'">
       </template>

      <input v-else-if="cfg.type === 'number'" type="number" step="any" class="input" :value="modelValue" @input="up(($event.target as HTMLInputElement).value)" />

      <textarea v-else-if="cfg.type === 'textarea' || cfg.type === 'json'" :rows="cfg.type === 'json' ? 5 : 3" class="input" :class="cfg.type === 'json' ? 'font-mono text-xs' : ''" :value="modelValue" @input="up(($event.target as HTMLTextAreaElement).value)" />

      <!-- 1 ảnh: khung thumbnail (luôn hiện) → bấm để mở popup chọn ảnh -->
      <div v-else-if="cfg.type === 'image'">
        <div
          class="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border bg-gray-50"
          :class="readonly ? 'border-gray-200' : 'cursor-pointer border-dashed border-gray-300 hover:border-brand hover:bg-brand/5'"
          @click="!readonly && pickImage()"
        >
          <img v-if="modelValue" :src="modelValue" class="h-full w-full object-cover" alt="" />
          <div v-else class="flex h-full flex-col items-center justify-center gap-1 text-gray-400">
            <ImagePlus class="h-8 w-8" />
            <span class="text-sm">{{ readonly ? 'Chưa có ảnh' : 'Bấm để chọn ảnh' }}</span>
          </div>
          <button
            v-if="modelValue && !readonly"
            type="button"
            class="absolute right-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white hover:bg-black/80"
            title="Bỏ ảnh"
            @click.stop="up('')"
          >✕</button>
        </div>
      </div>

      <!-- nhiều ảnh: ảnh đại diện lớn + dải thumbnail; bấm khung/ô "+" để mở popup chọn ảnh -->
      <div v-else-if="cfg.type === 'images'" class="space-y-3">
        <!-- ảnh đại diện (ảnh đầu tiên). Khi CHƯA có ảnh: bấm vào khung để mở popup chọn ảnh -->
        <div
          class="relative aspect-video w-full overflow-hidden rounded-lg border bg-gray-50"
          :class="!modelValue.length && !readonly ? 'cursor-pointer border-dashed border-gray-300 hover:border-brand hover:bg-brand/5' : 'border-gray-200'"
          @click="!modelValue.length && !readonly && addImages()"
        >
          <img v-if="modelValue[0]" :src="modelValue[0]" class="h-full w-full object-cover" alt="" />
          <div v-else class="flex h-full flex-col items-center justify-center gap-1 text-gray-400">
            <ImagePlus class="h-8 w-8" />
            <span class="text-sm">{{ readonly ? 'Chưa có ảnh' : 'Bấm để chọn ảnh' }}</span>
          </div>
          <span v-if="modelValue[0]" class="absolute left-2 top-2 rounded bg-brand px-2 py-0.5 text-xs font-medium text-white">Ảnh đại diện</span>
        </div>

        <!-- dải thumbnail: ô "+" mở popup chọn ảnh + các ảnh đã chọn -->
        <div v-if="modelValue.length" class="flex flex-wrap gap-2">
          <button
            v-if="!readonly"
            type="button"
            class="flex h-16 w-16 shrink-0 flex-col items-center justify-center gap-0.5 rounded-md border-2 border-dashed border-gray-300 text-gray-400 hover:border-brand hover:text-brand"
            title="Chọn ảnh"
            @click="addImages()"
          >
            <Plus class="h-5 w-5" />
            <span class="text-[10px] leading-none">Chọn ảnh</span>
          </button>
          <div
            v-for="(img, i) in modelValue"
            :key="i"
            class="group relative h-16 w-16 overflow-hidden rounded-md border-2"
            :class="i === 0 ? 'border-brand' : 'border-gray-200'"
          >
            <img
              :src="img"
              class="h-full w-full object-cover"
              :class="readonly ? '' : 'cursor-pointer'"
              :title="i === 0 ? 'Ảnh đại diện' : 'Bấm để đặt làm ảnh đại diện'"
              alt=""
              @click="makeCover(Number(i))"
            />
            <button
              v-if="!readonly"
              type="button"
              class="absolute right-0 top-0 hidden rounded-bl bg-black/60 px-1 text-xs leading-5 text-white group-hover:block"
              title="Xoá ảnh"
              @click="removeImage(Number(i))"
            >✕</button>
          </div>
        </div>
      </div>

      <!-- tags: nhập text cách nhau bởi dấu phẩy → lưu mảng JSON -->
      <div v-else-if="cfg.type === 'tags'" class="space-y-2">
        <input
          class="input"
          placeholder="vd: trà, quà tặng, đặc sản"
          :value="modelValue"
          @input="up(($event.target as HTMLInputElement).value)"
        />
        <div v-if="tagChips.length" class="flex flex-wrap gap-1.5">
          <span v-for="(t, i) in tagChips" :key="i" class="rounded-full bg-brand/10 px-2 py-0.5 text-xs text-brand">{{ t }}</span>
        </div>
      </div>

      <input v-else class="input" :value="modelValue" @input="up(($event.target as HTMLInputElement).value)" />

      <p v-if="cfg.type === 'json'" class="mt-1 text-xs text-gray-400">Định dạng JSON</p>
    </template>

    <!-- thông báo lỗi bắt buộc tại chỗ -->
    <p v-if="error" class="mt-1 flex items-center gap-1 text-xs text-red-600">
      <AlertCircle class="h-3.5 w-3.5 shrink-0" /> {{ error }} là bắt buộc
    </p>
  </div>
</template>
