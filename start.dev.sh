#!/usr/bin/env bash
# ==========================================================================
# [LEGACY] Khởi động stack Laravel cũ — ĐÃ VÔ HIỆU trong quá trình migration.
# Hạ tầng API mới:
#   docker compose -f apps/api/docker-compose.yml up -d
#   pnpm --filter @thang-long/api dev
# ==========================================================================
echo "⚠️  start.dev.sh đã bị vô hiệu (stack Laravel cũ)."
echo "    Dùng:  docker compose -f apps/api/docker-compose.yml up -d  &&  pnpm dev:api"
echo "    Nếu thực sự cần chạy Laravel cũ, bỏ comment phần dưới."
exit 0

# --- Nội dung cũ (giữ để tham chiếu) ---
# docker compose -f docker-compose.laravel.yml down
# docker rm -f tl_che_viet
# docker compose -f docker-compose.laravel.yml up -d --build
# docker compose -f docker-compose.laravel.yml exec app sh docker-init.sh
# ./cd.auto.sh stop
# ./cd.auto.sh
