# Thang Long Che Viet — API (NestJS)

Backend NestJS, đang migrate từ Laravel `be/`. Xem lộ trình:
[`docs/MIGRATION-LARAVEL-TO-NESTJS.md`](../../docs/MIGRATION-LARAVEL-TO-NESTJS.md).

## Yêu cầu
- Node >= 20, pnpm >= 9
- PostgreSQL + Redis (qua Docker — dùng compose riêng `apps/api/docker-compose.yml`,
  KHÔNG dính tới stack Laravel cũ ở root)

## Chạy nhanh (1 lệnh)

```bash
./start.api.sh            # hạ tầng + prisma + seed admin + API (watch)
./start.api.sh --s3       # kèm LocalStack (S3 giả lập)
./start.api.sh --fresh    # tạo lại schema từ đầu (xoá dữ liệu)
```

## Chạy thủ công (từng bước)

> ⚠️ Chạy `prisma` (generate/push) **trước khi** bật `dev:api`. Watch server giữ
> file engine của Prisma → nếu đang chạy thì lệnh prisma sẽ lỗi EPERM (Windows).

```bash
# 1) Hạ tầng: PostgreSQL :5432, Redis :6379, Mailpit :8025/:1025
pnpm api:infra            # = docker compose -f apps/api/docker-compose.yml up -d
#   (S3: pnpm api:infra:s3   ·   tắt: pnpm api:infra:down)

# 2) Cài deps (root monorepo)
pnpm install

# 3) Đẩy schema xuống DB (tạo bảng) — hoặc prisma:pull nếu DB đã có bảng
pnpm prisma:push

# 4) Tạo tài khoản admin (đăng nhập SPA apps/admin :3002)
pnpm seed:admin           # mặc định admin@tlcv.test / admin12345
#   tuỳ biến: ADMIN_EMAIL=… ADMIN_PASSWORD=… pnpm seed:admin

# 5) Chạy API (watch)
pnpm dev:api              # = pnpm --filter @thang-long/api dev
```

## Truy cập

| URL | Mô tả |
|---|---|
| http://localhost:3001/api | Base API (envelope `{ success, data }`) |
| http://localhost:3001/api/health | Health (DB + Redis) |
| http://localhost:3001/api/docs | Swagger UI (mọi endpoint storefront/customer/payment) |
| http://localhost:3001/api/admin | Admin REST API (cho SPA `apps/admin`) |
| http://localhost:3002 | Admin SPA Vue 3 (Vite + TanStack Query + Tailwind) — `admin@tlcv.test` / `admin12345` |
| http://localhost:8025 | Mailpit — xem mail đặt lịch/đơn hàng |

Cổng **3001** tách khỏi Nuxt frontend (3000). Dừng API: `Ctrl+C`; tắt hạ tầng: `pnpm api:infra:down`.

### Nhóm endpoint chính
- **Storefront**: `categories`, `products*`, `posts*`, `site`, `sitemap`, `cart*`, `coupons/validate`, `checkout`, `orders/lookup`, `orders/retry-payment`, `booking*`, `contact`, `payment-methods`
- **Customer** (JWT): `customer/register|login|logout|profile|orders|appointments`
- **Payment**: `payments/vnpay/return`, `payments/vnpay/ipn`

## Cấu trúc (Phase 0)

```
src/
├── main.ts                  # bootstrap, global prefix /api, swagger, pipes/filters/interceptors
├── app.module.ts            # ConfigModule, Throttler, các module hạ tầng
├── config/                  # redis/s3/jwt config (registerAs)
├── common/
│   ├── interceptors/        # TransformInterceptor → envelope { success, data }
│   ├── filters/             # AllExceptionsFilter → shape lỗi giống Laravel
│   ├── guards/              # JwtAuthGuard, OptionalJwtAuthGuard, RolesGuard
│   └── decorators/          # @Public, @Roles, @CurrentUser, @Lang
└── modules/
    ├── database/            # PrismaService (PostgreSQL)
    ├── redis/               # RedisService (ioredis)
    ├── s3/                  # S3Service (presigned URL)
    ├── auth/                # JwtModule + JwtStrategy (thay Sanctum)
    ├── health/             # GET /health
    └── storefront/          # endpoint mẫu (catalog/content... thêm ở Phase 1+)
```

## Quy ước contract
- Response thành công: `{ success: true, data }` (giữ tương thích Nuxt `apps/web`).
  Controller có thể tự trả object chứa `success` (kèm `meta` phân trang) — interceptor giữ nguyên.
- Lỗi: `{ success: false, statusCode, message, errors? }`. Validation (422) trả `errors: { field: string[] }`.
- Auth: Bearer JWT. Route công khai dùng `@Public()`; route cần đăng nhập dùng `@UseGuards(JwtAuthGuard)`.

## Scripts
| Lệnh | Tác dụng |
|---|---|
| `pnpm dev:api` | chạy watch |
| `pnpm build:api` | build production (`dist/`) |
| `pnpm typecheck:api` | kiểm tra type |
| `pnpm prisma:generate` | sinh Prisma Client |
| `pnpm prisma:pull` / `prisma:push` | introspect / đẩy schema |
