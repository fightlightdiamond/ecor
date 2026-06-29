<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { Search, Check, Tag } from 'lucide-vue-next';
import { api } from '../lib/api';
import { localeText } from '../lib/locale';
import { rowThumbnail } from '../lib/schema';

const qc = useQueryClient();

// Tất cả sản phẩm để chọn.
const productsQ = useQuery({
  queryKey: ['promo-products'],
  queryFn: () => api.list('product', { perPage: 500, sort: 'id', order: 'desc' }),
});
// Cấu hình ưu đãi hiện tại (lưu trong site-settings, key 'promotions').
const settingsQ = useQuery({ queryKey: ['site-settings'], queryFn: () => api.getSiteSettings() });

const products = computed<any[]>(() => productsQ.data.value?.data ?? []);
const promo = computed<any>(
  () => settingsQ.data.value?.find((s) => s.key === 'promotions')?.content ?? null,
);

const title = ref('');
const selected = ref<Set<number>>(new Set());

// Nạp dữ liệu đã lưu.
watch(
  promo,
  (c) => {
    title.value = c?.title ?? '';
    selected.value = new Set(Array.isArray(c?.productIds) ? c.productIds.map(Number) : []);
  },
  { immediate: true },
);

const q = ref('');
const nameText = (p: any) => String(localeText(p.name) ?? p.slug ?? p.id);
const priceText = (p: any) => Number(p.price ?? 0).toLocaleString('vi-VN') + ' đ';

const filtered = computed(() => {
  const kw = q.value.trim().toLowerCase();
  if (!kw) return products.value;
  return products.value.filter(
    (p) => nameText(p).toLowerCase().includes(kw) || String(p.sku ?? '').toLowerCase().includes(kw),
  );
});

// Các sản phẩm đã chọn (hiển thị tóm tắt ở đầu trang).
const selectedProducts = computed(() => products.value.filter((p) => selected.value.has(p.id)));

function toggle(id: number) {
  const s = new Set(selected.value);
  if (s.has(id)) s.delete(id);
  else s.add(id);
  selected.value = s;
}

const save = useMutation({
  mutationFn: () =>
    api.putSiteSection('promotions', { title: title.value, productIds: [...selected.value] }),
  onSuccess: () => qc.invalidateQueries({ queryKey: ['site-settings'] }),
});

const loading = computed(() => productsQ.isLoading.value || settingsQ.isLoading.value);
</script>

<template>
  <div class="mx-auto max-w-5xl">
    <div class="mb-4 flex items-center justify-between">
      <div>
        <h1 class="flex items-center gap-2 text-xl font-semibold">
          <Tag class="h-5 w-5 text-brand" /> Ưu đãi trong tháng
        </h1>
        <p class="text-sm text-gray-500">Chọn các sản phẩm hiển thị trong mục ưu đãi của website.</p>
      </div>
      <button class="btn-primary" :disabled="save.isPending.value" @click="save.mutate()">
        {{ save.isPending.value ? 'Đang lưu…' : 'Lưu' }}
      </button>
    </div>

    <div v-if="save.isSuccess.value" class="mb-4 rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
      Đã lưu danh sách ưu đãi.
    </div>

    <div v-if="loading" class="text-gray-400">Đang tải…</div>

    <template v-else>
      <!-- Tiêu đề đợt ưu đãi -->
      <div class="card mb-4 p-4">
        <label class="label">Tiêu đề đợt ưu đãi</label>
        <input v-model="title" class="input" placeholder="vd: Ưu đãi tháng 6 — Trà sen Tây Hồ" />
      </div>

      <!-- Tóm tắt đã chọn -->
      <div class="card mb-4 p-4">
        <div class="mb-2 text-sm font-medium text-gray-700">
          Đã chọn {{ selected.size }} sản phẩm
        </div>
        <div v-if="selectedProducts.length" class="flex flex-wrap gap-2">
          <span
            v-for="p in selectedProducts"
            :key="p.id"
            class="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2 py-1 text-xs text-brand"
          >
            {{ nameText(p) }}
            <button class="hover:text-red-600" title="Bỏ chọn" @click="toggle(p.id)">✕</button>
          </span>
        </div>
        <p v-else class="text-sm text-gray-400">Chưa chọn sản phẩm nào.</p>
      </div>

      <!-- Danh sách sản phẩm để chọn -->
      <div class="card p-4">
        <div class="relative mb-3">
          <Search class="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <input v-model="q" class="input pl-8" placeholder="Tìm sản phẩm theo tên hoặc SKU…" />
        </div>

        <div v-if="!filtered.length" class="py-6 text-center text-sm text-gray-400">Không có sản phẩm.</div>
        <div v-else class="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            v-for="p in filtered"
            :key="p.id"
            type="button"
            class="flex items-center gap-3 rounded-md border p-2 text-left transition-colors"
            :class="selected.has(p.id) ? 'border-brand bg-brand/5' : 'border-gray-200 hover:bg-gray-50'"
            @click="toggle(p.id)"
          >
            <span
              class="flex h-5 w-5 shrink-0 items-center justify-center rounded border"
              :class="selected.has(p.id) ? 'border-brand bg-brand text-white' : 'border-gray-300'"
            >
              <Check v-if="selected.has(p.id)" class="h-3.5 w-3.5" />
            </span>
            <img
              v-if="rowThumbnail(p)"
              :src="rowThumbnail(p)!"
              class="h-12 w-12 shrink-0 rounded border border-gray-200 object-cover"
              alt=""
              loading="lazy"
            />
            <div v-else class="h-12 w-12 shrink-0 rounded border border-dashed border-gray-200 bg-gray-50"></div>
            <div class="min-w-0 flex-1">
              <div class="truncate text-sm font-medium">{{ nameText(p) }}</div>
              <div class="text-xs text-gray-500">{{ priceText(p) }}<span v-if="p.sku"> · {{ p.sku }}</span></div>
            </div>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
