<script setup lang="ts">
import { ref, watch } from 'vue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { api } from '../lib/api';
import { MULTILANG } from '../config';

// Giá trị mặc định khi settings chưa có / thiếu field.
const DEFAULTS = {
  site: {
    name: { vi: 'Thăng Long Chè Việt', en: 'Thang Long Che Viet' },
    tagline: { vi: '', en: '' },
    description: { vi: '', en: '' },
  },
  contact: {
    address: { vi: '', en: '' },
    phone: '',
    phoneDisplay: '',
    mobile: '',
    email: '',
    mapEmbed: '',
  },
  social: { facebook: '', instagram: '', zalo: '', youtube: '' },
  hours: [] as { days: { vi: string; en: string }; time: string }[],
};

// Trộn sâu: lấy giá trị từ content nếu có, không thì dùng default.
function deepMerge(def: any, src: any): any {
  if (Array.isArray(def)) return Array.isArray(src) ? JSON.parse(JSON.stringify(src)) : JSON.parse(JSON.stringify(def));
  if (def && typeof def === 'object') {
    const out: any = {};
    for (const k of Object.keys(def)) out[k] = deepMerge(def[k], src?.[k]);
    return out;
  }
  return src == null ? def : src;
}

const qc = useQueryClient();
const { data: sections, isLoading } = useQuery({
  queryKey: ['site-settings'],
  queryFn: () => api.getSiteSettings(),
});

const fullContent = ref<any>({});
const draft = ref<any>(JSON.parse(JSON.stringify(DEFAULTS)));
const savedAt = ref(0);
const err = ref('');

function load() {
  const content = sections.value?.find((s) => s.key === 'settings')?.content ?? {};
  fullContent.value = JSON.parse(JSON.stringify(content));
  draft.value = deepMerge(DEFAULTS, content);
  savedAt.value = 0;
  err.value = '';
}
watch(sections, load, { immediate: true });

const save = useMutation({
  mutationFn: () => {
    // Giữ nguyên các phần khác (hero, promo, skills…) — chỉ ghi đè khối đang quản lý.
    const merged = {
      ...fullContent.value,
      site: draft.value.site,
      contact: draft.value.contact,
      social: draft.value.social,
      hours: draft.value.hours,
    };
    return api.putSiteSection('settings', merged);
  },
  onSuccess: () => {
    savedAt.value = Date.now();
    qc.invalidateQueries({ queryKey: ['site-settings'] });
  },
  onError: (e: any) => (err.value = e?.message || 'Lưu thất bại'),
});

function addHour() {
  draft.value.hours.push({ days: { vi: '', en: '' }, time: '' });
}
function removeHour(i: number) {
  draft.value.hours.splice(i, 1);
}

const SOCIALS: [string, keyof typeof DEFAULTS.social][] = [
  ['Facebook', 'facebook'],
  ['Instagram', 'instagram'],
  ['Zalo', 'zalo'],
  ['YouTube', 'youtube'],
];
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="mb-4 text-xl font-semibold">Cấu hình chung</h1>

    <div v-if="isLoading" class="text-gray-400">Đang tải…</div>

    <template v-else>
      <div v-if="savedAt" class="mb-3 rounded bg-green-50 px-3 py-2 text-sm text-green-700">Đã lưu thay đổi.</div>
      <div v-if="err" class="mb-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{{ err }}</div>

      <div class="space-y-6">
        <!-- Thông tin chung -->
        <div class="card p-5">
          <h2 class="mb-3 font-semibold">Thông tin chung</h2>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div><label class="label">Tên website{{ MULTILANG ? ' (VI)' : '' }}</label><input v-model="draft.site.name.vi" class="input" /></div>
            <div v-if="MULTILANG"><label class="label">Tên website (EN)</label><input v-model="draft.site.name.en" class="input" /></div>
            <div><label class="label">Slogan{{ MULTILANG ? ' (VI)' : '' }}</label><input v-model="draft.site.tagline.vi" class="input" /></div>
            <div v-if="MULTILANG"><label class="label">Slogan (EN)</label><input v-model="draft.site.tagline.en" class="input" /></div>
            <div class="md:col-span-2"><label class="label">Mô tả{{ MULTILANG ? ' (VI)' : '' }}</label><textarea v-model="draft.site.description.vi" rows="3" class="input" /></div>
            <div v-if="MULTILANG" class="md:col-span-2"><label class="label">Mô tả (EN)</label><textarea v-model="draft.site.description.en" rows="3" class="input" /></div>
          </div>
        </div>

        <!-- Liên hệ -->
        <div class="card p-5">
          <h2 class="mb-3 font-semibold">Thông tin liên hệ</h2>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div><label class="label">Địa chỉ{{ MULTILANG ? ' (VI)' : '' }}</label><input v-model="draft.contact.address.vi" class="input" /></div>
            <div v-if="MULTILANG"><label class="label">Địa chỉ (EN)</label><input v-model="draft.contact.address.en" class="input" /></div>
            <div><label class="label">Điện thoại</label><input v-model="draft.contact.phone" class="input" /></div>
            <div><label class="label">SĐT hiển thị</label><input v-model="draft.contact.phoneDisplay" class="input" /></div>
            <div><label class="label">Di động</label><input v-model="draft.contact.mobile" class="input" /></div>
            <div><label class="label">Email</label><input v-model="draft.contact.email" type="email" class="input" /></div>
            <div class="md:col-span-2"><label class="label">Google Maps (embed URL)</label><textarea v-model="draft.contact.mapEmbed" rows="2" class="input" /></div>
          </div>
        </div>

        <!-- Mạng xã hội -->
        <div class="card p-5">
          <h2 class="mb-3 font-semibold">Mạng xã hội</h2>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div v-for="[label, key] in SOCIALS" :key="key">
              <label class="label">{{ label }}</label>
              <input v-model="draft.social[key]" class="input" placeholder="https://…" />
            </div>
          </div>
        </div>

        <!-- Giờ mở cửa -->
        <div class="card p-5">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="font-semibold">Giờ mở cửa</h2>
            <button class="btn-outline" @click="addHour">+ Thêm dòng</button>
          </div>
          <p v-if="!draft.hours.length" class="text-sm text-gray-500">Chưa có. Bấm "Thêm dòng" để thêm.</p>
          <div v-for="(h, i) in draft.hours" :key="i" class="mb-2 grid grid-cols-1 gap-2 md:grid-cols-12">
            <input v-model="h.days.vi" class="input" :class="MULTILANG ? 'md:col-span-4' : 'md:col-span-8'" :placeholder="MULTILANG ? 'Ngày (VI), vd: Thứ 2 – Thứ 6' : 'Ngày, vd: Thứ 2 – Thứ 6'" />
            <input v-if="MULTILANG" v-model="h.days.en" class="input md:col-span-4" placeholder="Ngày (EN)" />
            <input v-model="h.time" class="input md:col-span-3" placeholder="Giờ, vd: 09:00 – 21:00" />
            <button class="btn-outline md:col-span-1" @click="removeHour(i)">✕</button>
          </div>
        </div>
      </div>

      <div class="mt-5 flex items-center gap-2">
        <button class="btn-primary" :disabled="save.isPending.value" @click="save.mutate()">
          {{ save.isPending.value ? 'Đang lưu…' : 'Lưu thay đổi' }}
        </button>
        <button class="btn-outline" @click="load">Khôi phục</button>
      </div>
    </template>
  </div>
</template>
