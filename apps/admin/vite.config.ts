import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    port: 3002,
    // Bind-mount trong Docker không bắn inotify → bật polling để Vite phát hiện
    // thay đổi file và HMR/auto-reload. (Có thể tắt khi chạy native ở host.)
    watch: { usePolling: true, interval: 300 },
    // Đảm bảo websocket HMR của trình duyệt nối đúng cổng đã map ra host.
    hmr: { clientPort: 3002 },
  },
});
