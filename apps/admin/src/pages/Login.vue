<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../lib/api';

const router = useRouter();
const email = ref('admin@tlcv.test');
const password = ref('');
const error = ref('');
const loading = ref(false);

async function submit() {
  error.value = '';
  loading.value = true;
  try {
    await api.login(email.value, password.value);
    router.replace('/');
  } catch (e: any) {
    error.value = e?.message || 'Đăng nhập thất bại';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
    <form class="card w-full max-w-sm p-6" @submit.prevent="submit">
      <div class="mb-1 text-lg font-bold text-brand">Thăng Long Chè Việt</div>
      <div class="mb-5 text-sm text-gray-500">Đăng nhập quản trị</div>

      <div v-if="error" class="mb-3 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{{ error }}</div>

      <label class="label">Email</label>
      <input v-model="email" type="email" required class="input mb-3" />

      <label class="label">Mật khẩu</label>
      <input v-model="password" type="password" required class="input mb-5" />

      <button class="btn-primary w-full" :disabled="loading">
        {{ loading ? 'Đang đăng nhập…' : 'Đăng nhập' }}
      </button>
    </form>
  </div>
</template>
