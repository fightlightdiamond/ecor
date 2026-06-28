#!/usr/bin/env bash
# ==========================================================================
# Chạy FULL stack (BE NestJS + FE Nuxt) — KHÔNG dùng Laravel cũ.
#   ./start.api.sh            # hạ tầng + prisma + seed admin + API :3001 + Web :3000
#   ./start.api.sh --no-web   # chỉ backend (API :3001)
#   ./start.api.sh --s3       # kèm LocalStack (S3 giả lập)
#   ./start.api.sh --fresh    # tạo lại schema từ đầu (xoá dữ liệu)
# (kết hợp được, vd: ./start.api.sh --no-web --s3)
#
# Dừng: Ctrl+C (dừng cả API + Web + tiến trình con). Tắt hạ tầng:  pnpm api:infra:down
# ==========================================================================
set -e
cd "$(dirname "$0")"

S3=""; RESET=""; WEB="1"
for a in "$@"; do
  [ "$a" = "--s3" ] && S3="--profile s3"
  [ "$a" = "--fresh" ] && RESET="--force-reset --accept-data-loss"
  [ "$a" = "--no-web" ] && WEB="0"
done

# Giải phóng cổng còn bị giữ bởi lần chạy trước (tránh EADDRINUSE).
free_port() {
  local port="$1"
  if command -v fuser >/dev/null 2>&1; then
    fuser -k "${port}/tcp" >/dev/null 2>&1 || true
  elif command -v lsof >/dev/null 2>&1; then
    local pids; pids=$(lsof -ti "tcp:${port}" 2>/dev/null || true)
    [ -n "$pids" ] && kill -9 $pids 2>/dev/null || true
  elif command -v ss >/dev/null 2>&1; then
    local pids; pids=$(ss -lptnH "sport = :${port}" 2>/dev/null | grep -oP 'pid=\K[0-9]+' | sort -u || true)
    [ -n "$pids" ] && kill -9 $pids 2>/dev/null || true
  fi
}

echo "==> 0/5  Dọn tiến trình/cổng cũ (tránh EADDRINUSE)"
# Kill theo pattern tiến trình (chắc ăn kể cả khi fuser/lsof/ss thiếu).
pkill -9 -f 'nest start' 2>/dev/null || true
pkill -9 -f 'apps/api/dist/main' 2>/dev/null || true
if [ "$WEB" = "1" ]; then
  pkill -9 -f 'nuxt dev' 2>/dev/null || true
  pkill -9 -f 'apps/admin' 2>/dev/null || true
fi
# Và kill theo cổng (phòng tiến trình lạ).
free_port 3001
if [ "$WEB" = "1" ]; then free_port 3000; free_port 3002; fi
sleep 1

echo "==> 1/5  Hạ tầng (PostgreSQL :5432, Redis :6379, Mailpit :8025) ${S3:+(+LocalStack :4566)}"
docker compose -f apps/api/docker-compose.yml $S3 up -d

echo "==> 2/5  Cài dependencies (pnpm)"
pnpm install

echo "==> 3/5  Đợi PostgreSQL sẵn sàng"
until docker exec tl_api_postgres pg_isready -U postgres -d thanglongcheviet >/dev/null 2>&1; do
  sleep 1; printf '.'
done; echo " OK"

echo "==> 4/5  Prisma: generate + đẩy schema + seed admin"
pnpm --filter @thang-long/api exec prisma db push $RESET
pnpm --filter @thang-long/api seed:admin

echo "==> 5/5  Khởi động dịch vụ"
echo "         • API     : http://localhost:3001/api   (Swagger /api/docs)"
echo "         • Mailpit : http://localhost:8025"
if [ "$WEB" = "1" ]; then
  echo "         • Web FE  : http://localhost:3000 (proxy /api -> :3001)"
  echo "         • Admin   : http://localhost:3002       (admin@tlcv.test / admin12345)"
fi

if [ "$WEB" = "1" ]; then
  # API + Admin chạy nền, Web foreground. `kill 0` khi thoát → dừng CẢ NHÓM
  # tiến trình (pnpm + nest + node + vite), tránh mồ côi giữ cổng.
  trap 'echo; echo "Dừng API + Web + Admin..."; kill 0 2>/dev/null' INT TERM EXIT
  pnpm --filter @thang-long/api dev &
  pnpm --filter admin dev &
  pnpm --filter web dev
else
  exec pnpm --filter @thang-long/api dev
fi
