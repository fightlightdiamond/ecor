<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { api } from '../lib/api';
import { displayCell } from '../lib/fields';
import { RESOURCE_LABEL } from '../resources';
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

watch(resource, () => {
  page.value = 1;
  q.value = '';
  searchApplied.value = '';
  modal.open = false;
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
const columns = computed(() => (rows.value.length ? Object.keys(rows.value[0]).slice(0, 7) : ['id']));

const del = useMutation({
  mutationFn: (id: number) => api.remove(resource.value, id),
  onSuccess: () => qc.invalidateQueries({ queryKey: ['list'] }),
});

function applySearch() {
  page.value = 1;
  searchApplied.value = q.value;
}
function confirmDelete(id: number) {
  if (confirm('Xoá bản ghi này?')) del.mutate(id);
}
function openCreate() {
  modal.mode = 'create';
  modal.id = null;
  modal.open = true;
}
function openEdit(id: number) {
  modal.mode = 'edit';
  modal.id = id;
  modal.open = true;
}
function openShow(id: number) {
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
      <h1 class="text-xl font-semibold">{{ RESOURCE_LABEL[resource] ?? resource }}</h1>
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
            <th v-for="c in columns" :key="c" class="px-3 py-2 font-medium">{{ c }}</th>
            <th class="px-3 py-2 text-right font-medium">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isFetching && !rows.length">
            <td class="px-3 py-4 text-gray-400" :colspan="columns.length + 1">Đang tải…</td>
          </tr>
          <tr v-else-if="!rows.length">
            <td class="px-3 py-4 text-gray-400" :colspan="columns.length + 1">Không có dữ liệu</td>
          </tr>
          <tr v-for="row in rows" :key="row.id" class="border-b border-gray-100 hover:bg-gray-50">
            <td v-for="c in columns" :key="c" class="px-3 py-2">{{ displayCell(row[c]) }}</td>
            <td class="px-3 py-2 text-right">
              <span class="inline-flex gap-2">
                <button class="text-brand hover:underline" @click="openShow(row.id)">Xem</button>
                <button class="text-blue-600 hover:underline" @click="openEdit(row.id)">Sửa</button>
                <button class="text-red-600 hover:underline" @click="confirmDelete(row.id)">Xoá</button>
              </span>
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
