<script setup lang="ts">
import { computed, reactive, type Component } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import {
  Package, Boxes, FolderTree, Star, Warehouse, Image, Newspaper, LayoutTemplate,
  ShoppingBag, ListOrdered, TicketPercent, ShoppingCart, ListPlus, Users, CalendarClock,
  History, Mail, LifeBuoy, MessageCircle, MessagesSquare, ShieldCheck, UsersRound,
  ChevronDown, ChevronRight, LogOut, LayoutGrid, Box, FileText, Headphones, Settings,
} from 'lucide-vue-next';
import { RESOURCES } from '../resources';
import { api } from '../lib/api';
import { clearToken } from '../lib/http';
import { currentLocale, setLocale } from '../lib/locale';
import { MULTILANG } from '../config';

if (!MULTILANG) setLocale('vi');

const route = useRoute();
const router = useRouter();

// key khớp với `group` trong resources.ts; label là tên hiển thị.
const GROUPS: { key: string; label: string; icon: Component }[] = [
  { key: 'System', label: 'Hệ thống', icon: Settings },
  { key: 'Danh mục', label: 'Danh mục', icon: FolderTree },
  { key: 'product', label: 'Sản phẩm', icon: Package },
  { key: 'Bài viết', label: 'Bài viết', icon: Newspaper },
  { key: 'Sales', label: 'Bán hàng', icon: Box },
  { key: 'CRM', label: 'CRM', icon: Users },
  { key: 'Support', label: 'Hỗ trợ', icon: Headphones },
];

const ICONS: Record<string, Component> = {
  product: Package, productVariant: Boxes, category: FolderTree, review: Star,
  warehouse: Warehouse, media: Image, post: Newspaper, storefrontSection: LayoutTemplate,
  order: ShoppingBag, orderItem: ListOrdered, coupon: TicketPercent, cart: ShoppingCart,
  cartItem: ListPlus, customer: Users, appointment: CalendarClock,
  appointmentStatusHistory: History, contactInquiry: Mail, ticket: LifeBuoy,
  ticketResponse: MessageCircle, message: MessagesSquare, user: ShieldCheck, team: UsersRound,
};

const grouped = computed(() =>
  GROUPS.map((g) => ({ ...g, items: RESOURCES.filter((r) => r.group === g.key) }))
    // Giữ nhóm có resource; riêng System luôn hiển thị vì chứa link "Cấu hình chung".
    .filter((x) => x.items.length || x.key === 'System'),
);

// Trạng thái mở/thu gọn từng nhóm (lưu localStorage). Mặc định: mở.
const STORE_KEY = 'admin_nav_collapsed';
const collapsed = reactive<Record<string, boolean>>(
  JSON.parse(localStorage.getItem(STORE_KEY) || '{}'),
);
function toggle(group: string) {
  collapsed[group] = !collapsed[group];
  localStorage.setItem(STORE_KEY, JSON.stringify(collapsed));
}

// Highlight CHÍNH XÁC theo param resource (tránh /r/cartItem khớp tiền tố /r/cart).
const activeResource = computed(() => route.params.resource as string | undefined);

const { data: identity } = useQuery({ queryKey: ['me'], queryFn: () => api.me(), retry: false });

function logout() {
  clearToken();
  router.replace({ name: 'login' });
}
</script>

<template>
  <div class="flex min-h-screen">
    <aside class="flex w-64 flex-col border-r border-gray-200 bg-white">
      <div class="border-b border-gray-200 px-4 py-4">
        <div class="text-sm font-bold text-brand">Thăng Long Chè Việt</div>
        <div class="text-xs text-gray-500">Admin</div>
      </div>

      <nav class="flex-1 overflow-y-auto px-2 py-3">
        <div v-for="g in grouped" :key="g.key" class="mb-2">
          <button
            class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 hover:bg-gray-100"
            @click="toggle(g.key)"
          >
            <component :is="g.icon" class="h-4 w-4 shrink-0 text-gray-400" />
            <span class="flex-1 text-left">{{ g.label }}</span>
            <component :is="collapsed[g.key] ? ChevronRight : ChevronDown" class="h-4 w-4 shrink-0" />
          </button>

          <div v-show="!collapsed[g.key]" class="mt-1 ml-4 space-y-0.5 border-l border-gray-200 pl-2">
            <RouterLink
              v-if="g.key === 'System'"
              to="/settings"
              class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm"
              :class="route.path === '/settings' ? 'bg-brand text-white' : 'text-gray-700 hover:bg-gray-100'"
            >
              <Settings class="h-4 w-4 shrink-0" :class="route.path === '/settings' ? 'text-white' : 'text-gray-400'" />
              <span class="truncate">Cấu hình chung</span>
            </RouterLink>
            <RouterLink
              v-if="g.key === 'product'"
              to="/promotions"
              class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm"
              :class="route.path === '/promotions' ? 'bg-brand text-white' : 'text-gray-700 hover:bg-gray-100'"
            >
              <TicketPercent class="h-4 w-4 shrink-0" :class="route.path === '/promotions' ? 'text-white' : 'text-gray-400'" />
              <span class="truncate">Ưu đãi trong tháng</span>
            </RouterLink>
            <RouterLink
              v-for="r in g.items"
              :key="r.name"
              :to="`/r/${r.name}`"
              class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm"
              :class="activeResource === r.name ? 'bg-brand text-white' : 'text-gray-700 hover:bg-gray-100'"
            >
              <component
                :is="ICONS[r.name] ?? Box"
                class="h-4 w-4 shrink-0"
                :class="activeResource === r.name ? 'text-white' : 'text-gray-400'"
              />
              <span class="truncate">{{ r.label }}</span>
            </RouterLink>
          </div>
        </div>
      </nav>
    </aside>

    <div class="flex flex-1 flex-col">
      <header class="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <div class="text-sm text-gray-500">Bảng điều khiển</div>
        <div class="flex items-center gap-3">
          <div v-if="MULTILANG" class="inline-flex overflow-hidden rounded border border-gray-300 text-xs">
            <button class="px-2 py-1" :class="currentLocale === 'vi' ? 'bg-brand text-white' : 'bg-white text-gray-600'" @click="setLocale('vi')">VI</button>
            <button class="px-2 py-1" :class="currentLocale === 'en' ? 'bg-brand text-white' : 'bg-white text-gray-600'" @click="setLocale('en')">EN</button>
          </div>
          <span class="text-sm text-gray-700">{{ identity?.name || identity?.email || 'Admin' }}</span>
          <button class="btn-outline" @click="logout">
            <LogOut class="h-4 w-4" /> Đăng xuất
          </button>
        </div>
      </header>
      <main class="flex-1 overflow-y-auto p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
