<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Check, X, Folder, FolderPlus, ChevronRight, Trash2, Film, Music, File as FileIcon, Home } from 'lucide-vue-next';
import { useQuery } from '@tanstack/vue-query';
import { api } from '../lib/api';
import { pickerAccept, pickerMode, pickerOpen, resolvePick } from '../lib/mediaPicker';

const currentFolder = ref('');
const selected = ref<Set<string>>(new Set());
const newFolder = ref('');
const uploading = ref(false);

const mediaQ = useQuery({
  queryKey: ['media', currentFolder], // ref trong key → tự refetch khi đổi thư mục
  queryFn: () => api.listMedia(currentFolder.value),
  enabled: pickerOpen,
});
const folders = computed(() => mediaQ.data.value?.folders ?? []);
const files = computed(() => {
  const all = mediaQ.data.value?.files ?? [];
  return pickerAccept.value === 'all' ? all : all.filter((f) => f.type === pickerAccept.value);
});

const acceptAttr = computed(() =>
  pickerAccept.value === 'image'
    ? 'image/*'
    : pickerAccept.value === 'video'
      ? 'video/*'
      : 'image/*,video/*,audio/*',
);

// Breadcrumb từ đường dẫn thư mục hiện tại.
const crumbs = computed(() => {
  const acc: { name: string; path: string }[] = [];
  let path = '';
  for (const p of currentFolder.value ? currentFolder.value.split('/') : []) {
    path = path ? `${path}/${p}` : p;
    acc.push({ name: p, path });
  }
  return acc;
});

// Reset khi mở popup.
watch(pickerOpen, (open) => {
  if (open) {
    currentFolder.value = '';
    selected.value = new Set();
    newFolder.value = '';
  }
});

function openFolder(name: string) {
  currentFolder.value = [currentFolder.value, name].filter(Boolean).join('/');
}
function goTo(path: string) {
  currentFolder.value = path;
}

async function addFolder() {
  const name = newFolder.value.trim();
  if (!name) return;
  await api.createFolder(currentFolder.value, name).catch(() => {});
  newFolder.value = '';
  await mediaQ.refetch();
}

async function onUpload(e: Event) {
  const input = e.target as HTMLInputElement;
  const fs = Array.from(input.files ?? []);
  uploading.value = true;
  try {
    for (const f of fs) {
      const res = await api.upload(f, currentFolder.value).catch(() => null);
      if (!res) continue;
      if (pickerMode.value === 'single') {
        input.value = '';
        await mediaQ.refetch();
        resolvePick([res.url]);
        return;
      }
      selected.value = new Set(selected.value).add(res.url);
    }
  } finally {
    uploading.value = false;
  }
  input.value = '';
  await mediaQ.refetch();
}

function isChosen(url: string) {
  return selected.value.has(url);
}
function choose(url: string) {
  if (pickerMode.value === 'single') {
    resolvePick([url]);
    return;
  }
  const s = new Set(selected.value);
  if (s.has(url)) s.delete(url);
  else s.add(url);
  selected.value = s;
}
async function del(file: { path: string; url: string }) {
  if (!confirm('Xoá file này khỏi kho media?')) return;
  await api.deleteMedia(file.path).catch(() => {});
  const s = new Set(selected.value);
  s.delete(file.url);
  selected.value = s;
  await mediaQ.refetch();
}
function confirmMulti() {
  resolvePick([...selected.value]);
}
function cancel() {
  resolvePick(null);
}

// ── kéo-thả: di chuyển file vào thư mục ──
const dragging = ref<string | null>(null); // path file đang kéo
const dropTarget = ref<string | null>(null); // key vùng đang hover để thả
function folderPathOf(name: string) {
  return [currentFolder.value, name].filter(Boolean).join('/');
}
function onDragStart(path: string, e: DragEvent) {
  dragging.value = path;
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', path);
  }
}
function onDragEnd() {
  dragging.value = null;
  dropTarget.value = null;
}
async function moveTo(folderPath: string) {
  const from = dragging.value;
  dragging.value = null;
  dropTarget.value = null;
  if (!from) return;
  await api.moveMedia(from, folderPath).catch(() => {});
  await mediaQ.refetch();
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="pickerOpen"
      class="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4"
      @click.self="cancel"
    >
      <div class="card flex max-h-[85vh] w-full max-w-4xl flex-col bg-white">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <h3 class="text-lg font-semibold">
            {{ pickerMode === 'single' ? 'Chọn media' : 'Chọn media (nhiều)' }}
          </h3>
          <button class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700" @click="cancel">
            <X class="h-5 w-5" />
          </button>
        </div>

        <!-- Thanh công cụ: breadcrumb + tạo thư mục + upload -->
        <div class="flex flex-wrap items-center gap-2 border-b border-gray-100 px-5 py-2">
          <!-- breadcrumb -->
          <nav class="flex flex-1 flex-wrap items-center gap-1 text-sm text-gray-600">
            <button
              class="flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-gray-100"
              :class="dropTarget === 'home' ? 'bg-brand/10 ring-1 ring-brand' : ''"
              @click="goTo('')"
              @dragover.prevent
              @dragenter.prevent="dropTarget = 'home'"
              @dragleave="dropTarget = null"
              @drop.prevent="moveTo('')"
            >
              <Home class="h-3.5 w-3.5" /> Kho media
            </button>
            <template v-for="c in crumbs" :key="c.path">
              <ChevronRight class="h-3.5 w-3.5 text-gray-300" />
              <button
                class="rounded px-1.5 py-0.5 hover:bg-gray-100"
                :class="dropTarget === 'crumb:' + c.path ? 'bg-brand/10 ring-1 ring-brand' : ''"
                @click="goTo(c.path)"
                @dragover.prevent
                @dragenter.prevent="dropTarget = 'crumb:' + c.path"
                @dragleave="dropTarget = null"
                @drop.prevent="moveTo(c.path)"
              >{{ c.name }}</button>
            </template>
          </nav>

          <!-- tạo thư mục -->
          <div class="flex items-center gap-1">
            <input v-model="newFolder" class="input h-8 w-36 py-1 text-sm" placeholder="Thư mục mới…" @keydown.enter.prevent="addFolder" />
            <button type="button" class="btn-outline h-8 py-1" title="Tạo thư mục" @click="addFolder">
              <FolderPlus class="h-4 w-4" />
            </button>
          </div>

          <!-- upload -->
          <label class="btn-primary h-8 cursor-pointer py-1">
            {{ uploading ? 'Đang tải…' : '+ Tải lên' }}
            <input type="file" :accept="acceptAttr" :multiple="pickerMode === 'multi'" class="hidden" @change="onUpload" />
          </label>
        </div>

        <!-- Nội dung -->
        <div class="flex-1 overflow-y-auto p-5">
          <div v-if="mediaQ.isLoading.value" class="py-8 text-center text-sm text-gray-400">Đang tải…</div>
          <template v-else>
            <!-- thư mục con -->
            <div v-if="folders.length" class="mb-4 flex flex-wrap gap-2">
              <button
                v-for="f in folders"
                :key="f"
                type="button"
                class="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
                :class="dropTarget === 'folder:' + f ? 'border-brand bg-brand/10 ring-1 ring-brand' : 'border-gray-200 hover:border-brand hover:bg-brand/5'"
                :title="dragging ? `Thả vào thư mục ${f}` : ''"
                @click="openFolder(f)"
                @dragover.prevent
                @dragenter.prevent="dropTarget = 'folder:' + f"
                @dragleave="dropTarget = null"
                @drop.prevent="moveTo(folderPathOf(f))"
              >
                <Folder class="h-4 w-4 text-amber-500" /> {{ f }}
              </button>
            </div>

            <!-- media -->
            <div v-if="!files.length && !folders.length" class="py-8 text-center text-sm text-gray-500">
              Thư mục trống — hãy tải lên hoặc tạo thư mục con.
            </div>
            <div v-else-if="files.length" class="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-6">
              <div
                v-for="m in files"
                :key="m.url"
                class="group relative aspect-square cursor-move overflow-hidden rounded-md border-2"
                :class="[isChosen(m.url) ? 'border-brand' : 'border-gray-200 hover:border-gray-300', dragging === m.path ? 'opacity-50' : '']"
                draggable="true"
                @dragstart="onDragStart(m.path, $event)"
                @dragend="onDragEnd"
              >
                <button type="button" class="block h-full w-full" @click="choose(m.url)">
                  <img v-if="m.type === 'image'" :src="m.url" class="h-full w-full object-cover" :alt="m.name" loading="lazy" />
                  <video v-else-if="m.type === 'video'" :src="m.url" class="h-full w-full object-cover" muted preload="metadata" />
                  <div v-else class="flex h-full flex-col items-center justify-center gap-1 bg-gray-50 text-gray-400">
                    <component :is="m.type === 'audio' ? Music : FileIcon" class="h-6 w-6" />
                    <span class="px-1 text-[10px] line-clamp-1">{{ m.name }}</span>
                  </div>
                  <span v-if="m.type === 'video'" class="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-[10px] text-white">
                    <Film class="inline h-3 w-3" /> video
                  </span>
                  <span v-if="isChosen(m.url)" class="absolute inset-0 flex items-center justify-center bg-brand/40">
                    <Check class="h-6 w-6 text-white" />
                  </span>
                </button>
                <!-- xoá -->
                <button
                  type="button"
                  class="absolute right-1 top-1 hidden rounded bg-black/60 p-1 text-white hover:bg-red-600 group-hover:block"
                  title="Xoá file"
                  @click.stop="del(m)"
                >
                  <Trash2 class="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </template>
        </div>

        <!-- Footer -->
        <div class="flex justify-end gap-2 border-t border-gray-200 px-5 py-3">
          <button type="button" class="btn-outline" @click="cancel">Huỷ</button>
          <button v-if="pickerMode === 'multi'" type="button" class="btn-primary" :disabled="!selected.size" @click="confirmMulti">
            Chọn{{ selected.size ? ` (${selected.size})` : '' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
