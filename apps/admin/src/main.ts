import { createApp } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import App from './App.vue';
import router from './router';
import { setUnauthorizedHandler } from './lib/http';
import './style.css';

// API trả 401 → token đã bị xoá, điều hướng ngay về màn hình đăng nhập.
setUnauthorizedHandler(() => {
  if (router.currentRoute.value.name !== 'login') {
    router.replace({ name: 'login' });
  }
});

createApp(App).use(router).use(VueQueryPlugin).mount('#app');
