import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Đích proxy /api khi chạy vite TRỰC TIẾP (không qua nginx). Trong Docker đặt
// VITE_API_PROXY=http://api:3001; ở host mặc định localhost:3001.
const apiProxy = process.env.VITE_API_PROXY || 'http://localhost:3001';
// Cổng client HMR nối tới: khi truy cập qua nginx (1 domain) đặt = cổng nginx.
const hmrClientPort = Number(process.env.VITE_HMR_CLIENT_PORT || 3002);

export default defineConfig({
  plugins: [vue()],
  // Admin phục vụ dưới sub-path /admin/ (chung domain với FE qua reverse proxy).
  base: '/admin/',
  server: {
    host: true,
    port: 3002,
    // Bind-mount trong Docker không bắn inotify → bật polling để Vite phát hiện
    // thay đổi file và HMR/auto-reload. (Có thể tắt khi chạy native ở host.)
    watch: { usePolling: true, interval: 300 },
    // Đảm bảo websocket HMR của trình duyệt nối đúng cổng public (nginx hoặc vite).
    hmr: { clientPort: hmrClientPort },
    // Khi truy cập vite trực tiếp (:3002), proxy /api & /uploads → NestJS để cùng
    // origin (khỏi CORS). Khi qua nginx thì nginx lo việc này, proxy dưới đây không dùng.
    proxy: {
      '/api': { target: apiProxy, changeOrigin: true },
      '/uploads': { target: apiProxy, changeOrigin: true },
    },
  },
});
