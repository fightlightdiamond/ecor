# Kế hoạch Migration: Laravel (`be/`) → NestJS (`apps/api/`)

> **Cập nhật:** 2026-06-28
> **Quyết định nền tảng:**
> 1. **Admin:** Bỏ hẳn Laravel/Filament → xây admin mới (AdminJS, xem §6).
> 2. **Phạm vi:** Cắt theo **domain nghiệp vụ**, mỗi domain xong là deploy được.
> 3. **Dữ liệu:** Giữ cấu trúc bảng 1-1 (introspect / `prisma db pull`), không tái chuẩn hoá.

---

## 0. Trạng thái triển khai (cập nhật 2026-06-28)

| Phase | Nội dung | Trạng thái |
|---|---|---|
| 0 | Nền tảng (Prisma/Redis/S3, envelope, JWT, Swagger, health) | ✅ verified |
| 1 | Catalog (categories, products, reviews) | ✅ verified live |
| 2 | Content/Site (site, sitemap, posts, payment-methods) | ✅ verified live |
| 3 | Cart & Coupon | ✅ verified live |
| 4 | Order & Checkout | ✅ verified live |
| 5 | Payment VNPay (return/IPN/cron, cô lập lỗi) | ✅ verified live |
| 6 | Booking (availability/booking/contact + mail best-effort) | ✅ verified live |
| 7 | Customer/CRM (JWT, orders, appointments) — gỡ Sanctum | ✅ verified live |
| 8 | Support (Ticket/TicketResponse/Message) — models cho admin | ✅ models |
| 9 | Users/Teams — models + admin auth | ✅ models |
| 10 | Admin — **Vue 3 SPA (Vite + TanStack Query + Tailwind, `apps/admin` :3002)** + admin REST `/api/admin` (22 resources, auth User+bcrypt) | ✅ |
| 11 | Cắt đuôi: Laravel disabled, CI matrix web+api, Dockerfile prod, ETL, README | ✅ |

**Phase 11 đã làm:** vô hiệu stack Laravel (`docker-compose.laravel.yml`, scripts), CI `.github/workflows/deploy.yml` build cả web+api (bỏ Laravel khỏi pipeline), [Dockerfile prod API](../apps/api/Dockerfile) + `.dockerignore`, script ETL MySQL→PostgreSQL ([etl-mysql-to-postgres.cjs](../apps/api/scripts/etl-mysql-to-postgres.cjs)), gỡ scaffold `/storefront/ping`, viết lại README.

**Còn lại (ops, tùy môi trường thật):** chạy ETL với dữ liệu production + đối soát; migrate `activity_log`/media files sang S3; dựng `docker-compose.prod.yml` trên VPS; sau khi ổn định, xoá hẳn `be/`.

---

## 1. Hiện trạng

### Nguồn — Laravel `be/`
- Laravel 13.8 / PHP 8.3, **MySQL** (`DB_DATABASE=laravel`), cache **Redis**, queue **database**, filesystem **local**.
- **26 models**, 54 migrations.
- **API public** (contract mà `apps/web` Nuxt đang gọi — xem [routes/api.php](../be/routes/api.php)):
  - `StorefrontController` (801 dòng) — site bundle, catalog, posts, cart, checkout, coupon, booking, contact, order lookup, retry payment.
  - `CustomerAuthController` / `CustomerOrderController` / `CustomerAppointmentController` — auth + khu vực khách hàng (Sanctum).
  - `PaymentController` — VNPay return + IPN.
  - `HealthController`.
- **6 service**: `VNPayService`, `OrderService`, `CouponService`, `AppointmentService`, `BookingAvailabilityService`, `StorefrontNotifier`.
- **Support/Presenter**: `OrderPresenter`, `ProductPresenter`, `StorefrontContent`, `StorefrontLocale`, `StorefrontCache` (logic format + i18n + cache key).
- **Admin Filament** (13 Resource + widgets + pages), Spatie permission/activitylog/media, tomatophp CMS (Category/Post/Page/settings/forms/themes), L5-Swagger, 2FA, impersonate.
- **Console**: `ExpireUnpaidVnpayOrders` (scheduled), `ImportStorefrontSections`.

### Đích — NestJS `apps/api/`
- Mới ở mức scaffold. Hạ tầng đã từng dựng (còn artifact trong `dist/`, **`src/` hiện trống**): Prisma + **PostgreSQL**, Redis, S3, ConfigModule, common filters/interceptors/pipes.
- `.env` đã trỏ PostgreSQL / Redis / S3, JWT ghi chú cho "Sprint 2".
- **Chưa có `package.json`** ở `apps/api/` → cần dựng lại scaffold trước khi code.

### Khoảng cách phải vượt
| Hạng mục | Laravel | NestJS | Độ khó |
|---|---|---|---|
| DB engine | MySQL | PostgreSQL | Trung bình (kiểu dữ liệu, enum, JSON) |
| ORM | Eloquent | Prisma | Cao (quan hệ, scope, accessor) |
| Auth | Sanctum token | JWT | Trung bình |
| Cache | Redis (Laravel facade) | Redis (ioredis/nest) | Thấp |
| Media | Spatie Media + local | S3 | Trung bình |
| Admin | Filament (auto-CRUD) | AdminJS | Cao (13 resource) |
| Queue/Cron | database queue + scheduler | BullMQ + `@nestjs/schedule` | Trung bình |
| i18n nội dung | translations cột JSON | giữ nguyên cột | Thấp |
| OpenAPI | L5-Swagger / OA attrs | `@nestjs/swagger` | Thấp |

---

## 2. Kiến trúc đích NestJS

```
apps/api/src/
├── main.ts                      # bootstrap, global pipes/filters/interceptors, swagger
├── app.module.ts
├── config/                      # config + validation env (zod/joi)
├── common/
│   ├── filters/                 # all-exceptions → format lỗi giống Laravel
│   ├── interceptors/            # transform → envelope { success, data }
│   ├── pipes/                   # ValidationPipe (class-validator)
│   ├── decorators/              # @CurrentCustomer, @Public, @Lang
│   └── guards/                  # JwtAuthGuard, OptionalJwtGuard, RolesGuard, ThrottlerGuard
├── modules/
│   ├── database/                # PrismaService (đã có trong dist)
│   ├── redis/                   # RedisService (đã có)
│   ├── s3/                      # S3Service (đã có)
│   ├── mail/                    # thay StorefrontNotifier
│   ├── i18n/                    # StorefrontLocale tương đương
│   ├── catalog/                 # Category, Product, Variant, Warehouse, Review, Banner, StorefrontSection
│   ├── content/                 # Post, Page, Comment (CMS)
│   ├── cart/                    # Cart, CartItem
│   ├── order/                   # Order, OrderItem, OrderLog, Coupon, Checkout
│   ├── booking/                 # Appointment, AppointmentStatusHistory, availability
│   ├── customer/                # Customer auth + profile + khu vực khách
│   ├── support/                 # Ticket, TicketReply/Response, Message, ContactInquiry
│   ├── payment/                 # VNPay (return/IPN)
│   └── storefront/              # façade: site bundle, sitemap, presenter, cache
└── prisma/schema.prisma         # introspect từ DB
```

**Nguyên tắc giữ contract:** một `TransformInterceptor` toàn cục bọc mọi response thành `{ success: true, data }`, và `AllExceptionsFilter` trả lỗi đúng shape Laravel hiện tại (`{ success: false, message, errors }`). Đây là điều kiện để Nuxt không phải sửa.

---

## 3. Cross-cutting (làm TRƯỚC khi port domain)

Đây là Phase 0 — nền móng dùng chung cho mọi domain.

1. **Dựng lại scaffold** `apps/api`: `package.json`, `tsconfig`, NestJS CLI, ESLint/Prettier, đưa vào `pnpm-workspace`, script `dev/build/start` ở root.
2. **Prisma + DB**:
   - Replicate cấu trúc bảng MySQL sang PostgreSQL (giữ tên bảng/cột 1-1 để tương thích & cho phép chạy song song khi cần).
   - `prisma db pull` → sinh `schema.prisma`; tinh chỉnh quan hệ, enum, `@map`, cột JSON (translations), timestamps.
   - `PrismaService` (đã có trong dist) + module hoá.
3. **Envelope & lỗi**: `TransformInterceptor` + `AllExceptionsFilter` khớp output Laravel.
4. **Validation**: global `ValidationPipe` + DTO `class-validator` (thay FormRequest).
5. **Auth JWT**: thay Sanctum. Bảng `personal_access_tokens` không cần; dùng access/refresh JWT. `JwtAuthGuard`, `OptionalJwtGuard` (cho `/checkout` sanctum.optional), `@CurrentCustomer`.
6. **Rate limit**: `@nestjs/throttler` map đúng các `throttle:x,1` trong routes.
7. **Cache**: `RedisService` + helper cache key giống `StorefrontCache`; tái tạo middleware `storefront.cache` thành interceptor.
8. **i18n**: cổng `StorefrontLocale` (đọc `?lang=`, fallback) → decorator `@Lang`.
9. **Mail**: module mail (nodemailer) thay `StorefrontNotifier`.
10. **Queue/Cron**: `@nestjs/schedule` cho `ExpireUnpaidVnpayOrders`; BullMQ nếu cần job nền.
11. **OpenAPI**: `@nestjs/swagger` — port dần annotation, giữ `operationId` để client types ổn định.
12. **Health**: `@nestjs/terminus` thay `HealthController`.

---

## 4. Lộ trình theo domain

Mỗi domain = Prisma models + DTO + service (port từ Laravel service/presenter) + controller (giữ path & envelope) + admin resource + test contract. Thứ tự chọn để **storefront chạy được sớm nhất** rồi mở rộng CRM.

### Phase 0 — Nền móng (cross-cutting §3)
- **DoD:** `apps/api` chạy `dev`, `/api/health` xanh, Prisma kết nối PostgreSQL, envelope/lỗi/auth/swagger hoạt động, có 1 endpoint mẫu pass test.

### Phase 1 — Catalog (đọc) ⭐ ưu tiên cao
- Models: Category, Product, ProductVariant, Warehouse, Review, Banner, StorefrontSection.
- Endpoints: `/storefront/categories`, `/products`, `/products/featured`, `/products/{slug}`, `/products/{slug}/reviews`.
- Port `ProductPresenter`, translations, cache.
- **DoD:** Nuxt render trang sản phẩm/danh mục từ NestJS (đổi base URL), so khớp byte-to-byte với Laravel.

### Phase 2 — Content/Site (đọc)
- Models: Post, Page, Comment (CMS). Service: `StorefrontContent`.
- Endpoints: `/storefront/site`, `/sitemap`, `/posts`, `/posts/latest`, `/posts/{slug}`, `/payment-methods`.
- **DoD:** trang chủ + blog Nuxt chạy trên NestJS.

### Phase 3 — Cart & Coupon
- Models: Cart, CartItem, Coupon. Service: `CouponService`.
- Endpoints: `/cart`, `/cart/add|update|remove`, `/coupons/validate`.
- **DoD:** giỏ hàng Nuxt hoạt động đầy đủ qua NestJS.

### Phase 4 — Order & Checkout
- Models: Order, OrderItem, OrderLog. Service: `OrderService`, `OrderPresenter`.
- Endpoints: `/checkout` (OptionalJwt), `/orders/lookup`, `/orders/retry-payment`.
- **DoD:** đặt hàng tạo Order đúng, trạng thái/log khớp Laravel.

### Phase 5 — Payment (VNPay)
- Service: `VNPayService` (ký HMAC, build URL, verify return/IPN). Cron `ExpireUnpaidVnpayOrders`.
- Endpoints: `/payments/vnpay/return`, `/payments/vnpay/ipn`.
- **DoD:** thanh toán sandbox VNPay end-to-end, IPN cập nhật order, đơn quá hạn tự huỷ. ⚠️ Phải khớp chữ ký tuyệt đối.

### Phase 6 — Booking
- Models: Appointment, AppointmentStatusHistory, ContactInquiry. Service: `AppointmentService`, `BookingAvailabilityService`.
- Endpoints: `/booking/availability`, `/booking`, `/contact`.
- **DoD:** đặt lịch + gửi mail thông báo chạy.

### Phase 7 — Customer (CRM khách hàng)
- Models: Customer. Auth JWT.
- Endpoints: `/customer/register|login|logout|profile`, `/customer/appointments`, `/customer/orders`.
- **DoD:** đăng nhập/khu vực khách trên Nuxt chạy qua NestJS; **gỡ Sanctum**.

### Phase 8 — Support/Messaging
- Models: Ticket, TicketReply/Response, Message. (Chủ yếu phục vụ admin.)

### Phase 9 — Users/Auth nội bộ + Permissions
- Models: User, Team, roles/permissions (Spatie → bảng `roles`/`permissions`/`model_has_*`).
- Auth admin + RBAC (`RolesGuard`). Cần cho admin Phase 10.

### Phase 10 — Admin mới (AdminJS) — xem §6
- Cấu hình AdminJS với Prisma adapter cho toàn bộ resource đã port (Catalog, Content, Order, Coupon, Booking, Customer, Support, User/Role, Media, StorefrontSection).
- Auth admin + RBAC + activity log + upload S3.
- **DoD:** admin thay thế hoàn toàn Filament; **tắt `be/`**.

### Phase 11 — Dọn dẹp & cắt đuôi
- Gỡ Sanctum/Filament/Laravel khỏi deploy; cập nhật docker-compose, CI/CD, README.
- Activity log + media migrate xong; xoá `be/` khỏi pipeline.

---

## 5. Dữ liệu (MySQL → PostgreSQL, giữ 1-1)

1. Tạo schema PostgreSQL phản chiếu cấu trúc bảng Laravel (đặt tên/cột giống hệt).
2. `prisma db pull` để introspect → `schema.prisma`; xử lý khác biệt kiểu:
   - `enum` (MySQL ENUM → Postgres enum hoặc `@db.VarChar` + check).
   - `JSON`/translations → `Json` (Prisma) hoặc `jsonb`.
   - `tinyint(1)` boolean, `unsigned`, `datetime` → `timestamptz`.
   - Cột Spatie media/activitylog/permission giữ nguyên schema package.
3. Khi có dữ liệu thật: script ETL (pgloader hoặc script Node theo bảng) — **chạy sau khi mỗi domain ổn định**, không cần một lần.
4. **Pseudo-data-parity test**: với mỗi endpoint đọc, so sánh JSON output Laravel vs NestJS trên cùng dataset (xem §7).

> Lưu ý: `.env` đích đã là PostgreSQL nên Laravel (MySQL) và NestJS (PostgreSQL) là **2 DB khác nhau** — giai đoạn chuyển tiếp cần đồng bộ dữ liệu nếu chạy song song, hoặc cắt dứt điểm theo domain.

---

## 6. Admin mới — khuyến nghị AdminJS

| Tiêu chí | **AdminJS** (khuyến nghị) | React-admin |
|---|---|---|
| Tích hợp | Nhúng thẳng vào NestJS, adapter Prisma | App React riêng + data provider |
| Tốc độ đạt parity Filament | Nhanh (auto-CRUD từ model) | Chậm (tự code UI/CRUD) |
| Tuỳ biến UI sâu | Hạn chế hơn | Rất linh hoạt |
| RBAC/upload/log | Có hooks, cần cấu hình | Tự xây |

**Khuyến nghị:** Dùng **AdminJS** vì nó là analog gần nhất với Filament (sinh CRUD từ Prisma model, ít code), rút ngắn 13 resource. Chỉ chuyển sang React-admin nếu cần UX admin tuỳ biến cao mà AdminJS chặn. Admin nằm trong `apps/api` (hoặc `apps/admin` nếu tách); auth dùng RBAC ở Phase 9.

---

## 7. Bảo toàn contract & kiểm thử

- **Snapshot contract:** trước khi port mỗi endpoint, capture response Laravel (golden file) → so khớp với NestJS (cùng input, cùng dataset). Khác biệt phải có chủ đích.
- **E2E qua Nuxt:** sau mỗi domain, trỏ `apps/web` sang NestJS và chạy luồng người dùng thật (skill `/verify`).
- **OpenAPI diff:** giữ `operationId`; so sánh spec cũ (`be/api.json`) với spec NestJS.
- **Unit test** cho logic nhạy cảm: VNPay signature, coupon, booking availability, order total.
- Giữ envelope `{ success, data }` và shape lỗi là bất biến xuyên suốt.

---

## 8. Rủi ro chính

| Rủi ro | Giảm thiểu |
|---|---|
| VNPay signature lệch → mất thanh toán | Test sandbox sớm, so từng tham số ký với Laravel |
| Eloquent accessor/scope ẩn (translations, presenter) | Đọc kỹ Support/* trước khi port; golden file |
| 2 DB khác engine khi chạy song song | Cắt dứt điểm theo domain hoặc đồng bộ có kiểm soát |
| Filament features ẩn (impersonate, 2FA, shield) | Liệt kê tính năng admin thực dùng, bỏ cái không cần |
| `dist/` cũ không khớp `src/` trống | Dựng lại scaffold sạch (Phase 0), bỏ dist cũ |
| CMS tomatophp (Category/Post) coupling | Port thành bảng/Prisma thuần, bỏ phụ thuộc package |

---

## 9. Ước lượng (1 dev full-stack)

| Phase | Nội dung | Ước lượng |
|---|---|---|
| 0 | Nền móng | 1–1.5 tuần |
| 1–2 | Catalog + Content (đọc) | 1.5–2 tuần |
| 3–4 | Cart + Order/Checkout | 2 tuần |
| 5 | Payment VNPay | 1 tuần |
| 6–7 | Booking + Customer | 1.5–2 tuần |
| 8–9 | Support + Users/RBAC | 1.5 tuần |
| 10 | Admin AdminJS (13 resource) | 2–3 tuần |
| 11 | Cắt đuôi & dọn dẹp | 0.5–1 tuần |
| **Tổng** | | **~11–14 tuần** |

---

## 10. Việc làm ngay (Phase 0, theo thứ tự)

1. Dựng scaffold `apps/api` (NestJS CLI), thêm vào pnpm workspace, xoá `dist/` cũ.
2. Replicate schema sang PostgreSQL + `prisma db pull` → `schema.prisma`.
3. `TransformInterceptor` + `AllExceptionsFilter` (khớp envelope Laravel).
4. `ValidationPipe` + cấu trúc DTO mẫu.
5. JWT auth + guards (Jwt/Optional/Roles) + Throttler.
6. RedisService cache helper + `/api/health` (terminus).
7. Swagger + 1 endpoint mẫu (`GET /storefront/categories`) + golden-file test đầu tiên.
