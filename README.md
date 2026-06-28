# Thăng Long Chè Việt — Hệ thống (Nuxt 3 + NestJS)

Monorepo pnpm. Backend đã **migrate từ Laravel sang NestJS** (xem
[docs/MIGRATION-LARAVEL-TO-NESTJS.md](docs/MIGRATION-LARAVEL-TO-NESTJS.md)).

- **`apps/web`** — Frontend **Nuxt 3** (storefront), cổng **3000**.
- **`apps/api`** — Backend **NestJS** (storefront/customer/payment API + admin REST `/api/admin`), cổng **3001**.
- **`apps/admin`** — **Admin SPA Vue 3** (Vite + TanStack Query + Tailwind/shadcn-vue), cổng **3002** (thay Filament/AdminJS).
- **`be`** — *(LEGACY)* Laravel cũ — đã ngừng dùng, chỉ giữ để tham chiếu nguồn (không nằm trong CI/CD).

Hạ tầng: PostgreSQL, Redis, Mailpit (S3 tùy chọn qua LocalStack).

---

## 🚀 Chạy dự án (dev)

**Cách 1 — full stack 1 lệnh (BE + FE + hạ tầng, chạy ở host):**
```bash
./start.api.sh            # API :3001 + Web :3000 + Postgres/Redis/Mailpit
./start.api.sh --no-web   # chỉ backend
```
> Trên WSL với source ở ổ Windows (`/mnt/...`): dùng `bash start.api.wsl.sh` (đồng bộ sang ext4 cho nhanh).

**Cách 2 — chạy mọi thứ trong Docker:**
```bash
pnpm stack:up             # docker compose --profile apps up (hạ tầng + api + web)
pnpm stack:down
```

**Cách 3 — thủ công:**
```bash
pnpm api:infra            # chỉ hạ tầng (Postgres/Redis/Mailpit)
pnpm install
pnpm prisma:push          # tạo bảng
pnpm seed:admin           # tài khoản admin
pnpm seed:content         # nạp nội dung storefront (settings/team/...)
pnpm dev:api              # API :3001  (terminal khác: pnpm dev  → Web :3000)
```

---

## 🛠 Truy cập

| Dịch vụ | URL |
|---|---|
| Web (Nuxt) | http://localhost:3000 |
| API (NestJS) | http://localhost:3001/api |
| Swagger | http://localhost:3001/api/docs |
| Admin (Vue 3 + TanStack Query) | http://localhost:3002 |
| Mailpit | http://localhost:8025 |

**Admin mặc định (dev):** `admin@tlcv.test` / `admin12345` (đổi: `ADMIN_EMAIL=… ADMIN_PASSWORD=… pnpm seed:admin`).

Chi tiết backend: [apps/api/README.md](apps/api/README.md). Biến môi trường: [apps/api/.env.example](apps/api/.env.example).

---

## 🗄️ Migrate dữ liệu thật (Laravel MySQL → PostgreSQL)

Cut-over dữ liệu (giữ cấu trúc 1-1):
```bash
# cài thêm mysql2, pg (đã khai báo ở apps/api), rồi:
MYSQL_HOST=127.0.0.1 MYSQL_USER=root MYSQL_PASSWORD=secret MYSQL_DATABASE=laravel \
  pnpm --filter @thang-long/api etl:import --truncate
```
Script: [apps/api/scripts/etl-mysql-to-postgres.cjs](apps/api/scripts/etl-mysql-to-postgres.cjs) — copy theo tên cột, tự coerce boolean/JSON, reset sequence. **Backup trước khi chạy với production.**

---

## 🚢 CI/CD

[.github/workflows/deploy.yml](.github/workflows/deploy.yml): typecheck + build image **cả web và api** (matrix) → đẩy GHCR → deploy VPS bằng `docker-compose.prod.yml`. Stack Laravel cũ **không** còn trong pipeline.

---

## 📦 Lệnh hữu ích (root `package.json`)

| Lệnh | Tác dụng |
|---|---|
| `pnpm dev` | Web (Nuxt) :3000 |
| `pnpm dev:api` | API (NestJS) :3001 |
| `pnpm dev:admin` | Admin SPA (Vue 3) :3002 |
| `pnpm stack:up` / `stack:down` | Full stack trong Docker |
| `pnpm api:infra` / `api:infra:down` | Bật/tắt hạ tầng |
| `pnpm prisma:push` / `prisma:pull` / `prisma:generate` | Prisma |
| `pnpm seed:admin` / `seed:content` | Seed admin / nội dung |

---

> **Laravel cũ (`be/`)** đã vô hiệu: `docker-compose.laravel.yml`, `start.dev.sh`, `rebuild.docker.sh` chỉ còn để tham chiếu. Đừng chạy song song với stack mới (xung đột cổng 3000/8025).
