#!/usr/bin/env bash
# ==========================================================================
# [LEGACY] Rebuild stack Laravel cũ — ĐÃ VÔ HIỆU trong quá trình migration.
# Hạ tầng API mới: docker compose -f apps/api/docker-compose.yml up -d --build
# ==========================================================================
echo "⚠️  rebuild.docker.sh đã bị vô hiệu (stack Laravel cũ)."
echo "    Dùng:  docker compose -f apps/api/docker-compose.yml up -d --build"
echo "    Nếu thực sự cần rebuild Laravel cũ, bỏ comment phần dưới."
exit 0

# --- Nội dung cũ (giữ để tham chiếu) ---
# docker compose -f docker-compose.laravel.yml down
# docker compose -f docker-compose.laravel.yml up -d --build
# docker compose -f docker-compose.laravel.yml exec app sh docker-init.sh
