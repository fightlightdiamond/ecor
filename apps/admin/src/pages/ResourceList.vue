<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { Eye, Pencil, Trash2, MoreVertical } from 'lucide-vue-next';
import { api } from '../lib/api';
import { cellText, currentLocale } from '../lib/locale';
import { getListColumns, labelOf, listShowsThumbnail, resolveField, rowThumbnail } from '../lib/schema';
import { RESOURCE_TITLE } from '../resources';
import ResourceFormModal from '../components/ResourceFormModal.vue';

const route = useRoute();
const qc = useQueryClient();
const resource = computed(() => route.params.resource as string);

const page = ref(1);
const pageSize = 25;
const q = ref('');
const searchApplied = ref('');

const modal = reactive<{ open: boolean; mode: 'create' | 'edit' | 'show'; id: number | null }>({
  open: false,
  mode: 'create',
  id: null,
});

// Menu thao tác đang mở (theo id dòng); null = không mở.
// Dùng toạ độ cố định + Teleport ra body để không bị card (overflow) cắt mất.
const menuOpen = ref<number | null>(null);
const menuPos = reactive({ top: 0, left: 0 });
function toggleMenu(id: number, e: MouseEvent) {
  if (menuOpen.value === id) {
    menuOpen.value = null;
    return;
  }
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  menuPos.top = rect.bottom + 4;
  menuPos.left = rect.right - 144; // 144px = bề rộng menu (w-36)
  menuOpen.value = id;
}

watch(resource, () => {
  page.value = 1;
  q.value = '';
  searchApplied.value = '';
  modal.open = false;
  menuOpen.value = null;
});

const { data, isFetching, isError, error } = useQuery({
  queryKey: ['list', resource, page, searchApplied],
  queryFn: () =>
    api.list(resource.value, { page: page.value, perPage: pageSize, q: searchApplied.value || undefined }),
  placeholderData: (prev) => prev,
});

const rows = computed<Record<string, any>[]>(() => data.value?.data ?? []);
const total = computed(() => data.value?.total ?? 0);
const lastPage = computed(() => Math.max(1, Math.ceil(total.value / pageSize)));
// Cột hiển thị:
//  - Nếu resource khai báo LIST_COLUMNS → dùng đúng danh sách + thứ tự đó.
//  - Ngược lại tự suy ra: bỏ field kiểu 'hidden' (vd translations) rồi lấy 7 cột đầu.
const columns = computed(() => {
  const custom = getListColumns(resource.value);
  if (custom) return custom;
  if (!rows.value.length) return ['id'];
  return Object.keys(rows.value[0])
    .filter((k) => resolveField(resource.value, k, rows.value[0][k]).type !== 'hidden')
    .slice(0, 7);
});
const showThumb = computed(() => listShowsThumbnail(resource.value));
// Tổng số cột (gồm thumbnail nếu có + cột thao tác) — dùng cho colspan.
const colCount = computed(() => columns.value.length + (showThumb.value ? 1 : 0) + 1);

const del = useMutation({
  mutationFn: (id: number) => api.remove(resource.value, id),
  onSuccess: () => qc.invalidateQueries({ queryKey: ['list'] }),
});

function applySearch() {
  page.value = 1;
  searchApplied.value = q.value;
}
function confirmDelete(id: number) {
  menuOpen.value = null;
  if (confirm('Xoá bản ghi này?')) del.mutate(id);
}
function openCreate() {
  modal.mode = 'create';
  modal.id = null;
  modal.open = true;
}
function openEdit(id: number) {
  menuOpen.value = null;
  modal.mode = 'edit';
  modal.id = id;
  modal.open = true;
}
function openShow(id: number) {
  menuOpen.value = null;
  modal.mode = 'show';
  modal.id = id;
  modal.open = true;
}
function onSaved() {
  modal.open = false;
  qc.invalidateQueries({ queryKey: ['list'] });
}
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <h1 class="text-xl font-semibold">{{ RESOURCE_TITLE[resource] ?? resource }}</h1>
      <button class="btn-primary" @click="openCreate">+ Thêm mới</button>
    </div>

    <form class="mb-3 flex gap-2" @submit.prevent="applySearch">
      <input v-model="q" class="input max-w-xs" placeholder="Tìm kiếm…" />
      <button class="btn-outline">Tìm</button>
    </form>

    <div class="card overflow-x-auto">
      <div v-if="isError" class="p-4 text-sm text-red-600">Lỗi: {{ (error as any)?.message }}</div>
      <table class="min-w-full text-sm">
        <thead class="border-b border-gray-200 bg-gray-50 text-left text-gray-600">
          <tr>
            <th v-if="showThumb" class="px-3 py-2 font-medium">Ảnh</th>
            <th v-for="c in columns" :key="c" class="px-3 py-2 font-medium">{{ labelOf(c) }}</th>
            <th class="px-3 py-2 text-right font-medium">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isFetching && !rows.length">
            <td class="px-3 py-4 text-gray-400" :colspan="colCount">Đang tải…</td>
          </tr>
          <tr v-else-if="!rows.length">
            <td class="px-3 py-4 text-gray-400" :colspan="colCount">Không có dữ liệu</td>
          </tr>
          <tr v-for="row in rows" :key="row.id" class="border-b border-gray-100 hover:bg-gray-50">
            <td v-if="showThumb" class="px-3 py-2">
              <img
                v-if="rowThumbnail(row)"
                :src="rowThumbnail(row)!"
                class="h-10 w-10 rounded border border-gray-200 object-cover"
                alt=""
                loading="lazy"
              />
              <div v-else class="h-10 w-10 rounded border border-dashed border-gray-200 bg-gray-50"></div>
            </td>
            <td v-for="c in columns" :key="c" class="px-3 py-2">{{ cellText(row[c], currentLocale) }}</td>
            <td class="px-3 py-2 text-right">
              <button
                class="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                title="Thao tác"
                @click.stop="toggleMenu(row.id, $event)"
              >
                <MoreVertical class="h-4 w-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-3 flex items-center justify-between text-sm text-gray-600">
      <span>Tổng: {{ total }}</span>
      <div class="flex items-center gap-2">
        <button class="btn-outline" :disabled="page <= 1" @click="page--">← Trước</button>
        <span>{{ page }}/{{ lastPage }}</span>
        <button class="btn-outline" :disabled="page >= lastPage" @click="page++">Sau →</button>
      </div>
    </div>

    <!-- menu thao tác: teleport ra body + toạ độ cố định để không bị bảng cắt -->
    <Teleport to="body">
      <template v-if="menuOpen !== null">
        <div class="fixed inset-0 z-40" @click="menuOpen = null"></div>
        <div
          class="fixed z-50 w-36 overflow-hidden rounded-md border border-gray-200 bg-white py-1 text-left shadow-lg"
          :style="{ top: menuPos.top + 'px', left: menuPos.left + 'px' }"
        >
          <button class="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100" @click="openShow(menuOpen!)">
            <Eye class="h-4 w-4 text-gray-400" /> Xem
          </button>
          <button class="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100" @click="openEdit(menuOpen!)">
            <Pencil class="h-4 w-4 text-gray-400" /> Sửa
          </button>
          <button class="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50" @click="confirmDelete(menuOpen!)">
            <Trash2 class="h-4 w-4" /> Xoá
          </button>
        </div>
      </template>
    </Teleport>

    <ResourceFormModal
      v-if="modal.open"
      :resource="resource"
      :mode="modal.mode"
      :id="modal.id"
      @close="modal.open = false"
      @saved="onSaved"
    />
  </div>
</template>
