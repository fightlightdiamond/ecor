# Plan refactor: LunarPHP + Filament v4

> **Mục tiêu:** Thay toàn bộ e-commerce tự xây bằng LunarPHP, giữ nguyên CRM đặt lịch + CMS + storefront Nuxt.
> **Thời gian ước tính:** 4–6 tuần (1 dev full-stack)
> **Cập nhật:** 2026-06-26
> **Trạng thái:** Draft — chờ review trước khi triển khai

---

## 1. Tóm tắt quyết định

| Hạng mục | Quyết định |
|----------|------------|
| E-commerce engine | **LunarPHP** (`lunarphp/core` + `lunarphp/lunar`) |
| Admin commerce | Lunar Filament resources (mở rộng trong panel `admin` hiện tại) |
| Storefront | **Giữ Nuxt 3** — headless qua API adapter layer |
| CRM đặt lịch | **Giữ custom** (`Appointment`, `Customer`, booking API) |
| CMS / Blog | **Giữ TomatoPHP FilamentCms** |
| Payment VNPay | Custom driver trên Lunar payment pipeline |
| Legacy Blade shop | **Xóa** (`StorefrontController` web, views `storefront/shop/*`) |

**Lý do refactor ngay (đang develop sớm):**
- Custom e-commerce còn nợ kỹ thuật (variant không dùng trong cart, `Warehouse` stub, không test).
- Lunar + Filament trùng stack — không đổi paradigm.
- Chi phí migration thấp hơn nhiều so với sau khi có dữ liệu production.

---

## 2. Kiến trúc mục tiêu

```
┌─────────────────────────────────────────────────────────────────┐
│  Nuxt 3 (apps/web) — không đổi URL, đổi contract API từ từ    │
└────────────────────────────┬────────────────────────────────────┘
                             │ /api/storefront/*  (giữ path cũ)
                             │ /api/customer/*
                             │ /api/payments/vnpay/*
┌────────────────────────────▼────────────────────────────────────┐
│  Laravel 13 (be/)                                               │
│                                                                 │
│  ┌──────────────────┐  ┌─────────────────────────────────────┐ │
│  │ Storefront API   │  │ Lunar Core                          │ │
│  │ (Adapter Layer)  │──│ Products, Variants, Cart, Orders,   │ │
│  │ ProductPresenter │  │ Pricing, Discounts, Channels, Tax   │ │
│  │ CartPresenter    │  └─────────────────────────────────────┘ │
│  └──────────────────┘                                           │
│                                                                 │
│  ┌──────────────────┐  ┌─────────────────────────────────────┐ │
│  │ CRM (custom)     │  │ CMS (TomatoPHP)                     │ │
│  │ Appointment      │  │ Posts, Categories (blog)            │ │
│  │ Customer auth    │  │ StorefrontSection                   │ │
│  └──────────────────┘  └─────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Filament v4 — 1 panel `/admin`                           │  │
│  │ Lunar commerce + Appointment + CMS + Settings            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Nguyên tắc adapter:** Phase đầu giữ **cùng response shape** cho Nuxt (`RawProduct`, `CartItem`, `OrderLookup`). Sau khi ổn định mới refactor Nuxt sang Lunar-native types (phase tùy chọn).

---

## 3. Phạm vi XÓA vs GIỮ

### 3.1 Xóa sau migration (e-commerce cũ)

| Loại | Files / tables |
|------|----------------|
| Models | `Product`, `ProductVariant`, `Cart`, `CartItem`, `Order`, `OrderItem`, `Coupon`, `Warehouse`, `OrderLog` |
| Migrations | `products`, `product_variants`, `carts`, `cart_items`, `orders`, `order_items`, `coupons`, `warehouses`, `reviews` (xem §3.3) |
| Filament | `ProductResource`, `OrderResource`, `CouponResource`, `WarehouseResource`, `ReviewResource` + policies |
| Widgets | `StockStatsWidget`, `LatestOrdersWidget`, `TopProductsWidget`, `TopCustomersWidget`, `RevenueChartWidget` (thay bằng Lunar hoặc query mới) |
| Controllers | `Http/Controllers/StorefrontController.php` (Blade legacy) |
| Views | `resources/views/storefront/shop/*`, `cart/*`, `checkout/*` |
| Routes | `routes/web.php` storefront routes |
| Services | `CouponService` (→ Lunar discounts), phần order create trong `StorefrontController` |
| Observers | `OrderObserver` (→ Lunar order events + custom listener) |

### 3.2 Giữ & mở rộng

| Domain | Giữ nguyên |
|--------|------------|
| CRM | `Customer`, `Appointment`, `AppointmentStatusHistory`, booking API |
| CMS | TomatoPHP posts, `StorefrontSection`, `Page`, `Banner` |
| Support | `Ticket`, `Message`, `ContactInquiry` |
| Admin infra | Filament Shield, 2FA, Curator media, Activity Log |
| Payment | `VNPayService` — refactor thành Lunar payment driver |
| Mail | `OrderConfirmationMail`, `OrderStatusUpdatedMail` — hook vào Lunar order events |
| Cache | `StorefrontCache` — invalidate khi Lunar product/order thay đổi |

### 3.3 Reviews — quyết định

**Khuyến nghị:** Giữ `reviews` table custom, link `lunar_product_id` (FK mới) thay vì `product_id` cũ.

Lunar không có review module sẵn; giữ Filament `ReviewResource` nhưng query Lunar `Product`.

---

## 4. Mapping dữ liệu: Custom → Lunar

| Custom hiện tại | Lunar tương đương | Ghi chú migration |
|-----------------|-------------------|-------------------|
| `products` | `lunar_products` + `lunar_product_variants` | Mỗi product custom → 1 Lunar product; nếu không có variant → tạo 1 default variant |
| `products.translations` JSONB | Lunar Attributes / `json` meta hoặc custom `Product` extension | Dùng Lunar [Product Options + Attributes](https://docs.lunarphp.com) hoặc `meta` field cho vi/en name |
| `products.price` | `lunar_prices` (channel + currency VND) | 1 price record per variant, channel `web` |
| `products.stock` | Lunar inventory (`stock` trên variant hoặc inventory table) | |
| `products.images` (Curator IDs) | Lunar Media / Spatie Media Library | Lunar dùng media library — map Curator → Lunar media hoặc giữ URL trong meta |
| `categories` (for=products) | Lunar **Collections** | Không dùng TomatoPHP category cho product nữa |
| `coupons` | Lunar **Discounts** | `WELCOME10` → discount code |
| `carts` / `cart_items` | Lunar **Cart** (session-based) | Session ID map qua cart `meta` hoặc custom cart session middleware |
| `orders` / `order_items` | Lunar **Orders** | Map status: `new`→`awaiting-payment`, `processing`→`processing`, etc. |
| `customers` (CRM) | Lunar **Customers** (riêng) hoặc bridge | **Khuyến nghị:** 1 bảng `customers` CRM, sync sang Lunar Customer khi checkout lần đầu |
| `payment_meta` VNPay | Lunar order `meta` JSON | Giữ logic IPN hiện tại |

### Seeder migration script

Tạo `database/seeders/MigrateToLunarSeeder.php`:
1. Tạo Lunar Channel `web`, Currency `VND`, Language `vi` + `en`
2. Migrate collections từ product categories
3. Migrate products + default variant + prices
4. Migrate coupons → discounts
5. (Optional) Migrate historical orders nếu cần — dev có thể `migrate:fresh` thay vì migrate orders

---

## 5. Lộ trình triển khai (6 phase)

```
Phase 0 ──► Phase 1 ──► Phase 2 ──► Phase 3 ──► Phase 4 ──► Phase 5 ──► Phase 6
 Prep       Filament v4   Lunar       API         Nuxt        Admin       Cleanup
 (2 ngày)   (3–5 ngày)    (3–4 ngày)  (5–7 ngày)  (3–4 ngày)  (2–3 ngày)  (2 ngày)
```

---

### Phase 0 — Chuẩn bị (2 ngày)

**Mục tiêu:** Freeze scope, branch, baseline test.

- [ ] Tạo branch `feat/lunar-migration`
- [ ] Cập nhật `docs/ARCHITECTURE.md` — ghi nhận stack thực tế là Laravel (không NestJS)
- [ ] Snapshot DB hiện tại (`php artisan db:seed` + export nếu cần)
- [ ] Liệt kê Filament plugins cần tương thích Filament v4:

| Package | Hiện tại | Action |
|---------|----------|--------|
| `filament/filament` | v3.2 | → v4 |
| `bezhansalleh/filament-shield` | v3.9 | Kiểm tra bản v4 |
| `awcodes/filament-curator` | v3.7 | Kiểm tra bản v4 hoặc thay bằng Lunar media |
| `tomatophp/filament-cms` | v1 | **Rủi ro cao** — test trên branch riêng trước |
| `bezhansalleh/filament-language-switch` | * | Kiểm tra v4 |
| `stechstudio/filament-impersonate` | v3 | Kiểm tra v4 |
| `stephenjude/filament-two-factor-authentication` | v1 | Kiểm tra v4 |

- [ ] Quyết định: nếu TomatoPHP chưa hỗ trợ Filament v4 → tạm giữ CMS resources, upgrade commerce trước (2 panel tạm thời) HOẶC fork/pin version

**DoD:** Branch sẵn sàng, matrix tương thích plugin đã xác nhận.

---

### Phase 1 — Nâng Filament v3 → v4 (3–5 ngày)

**Mục tiêu:** Toàn bộ admin CRM/CMS chạy Filament v4 trước khi cài Lunar.

```bash
cd be
composer require filament/filament:"^4.0" -W --no-update
# Chạy filament upgrade tool theo docs chính thức
composer update
php artisan filament:upgrade
```

**Tasks:**
- [ ] Chạy `vendor/bin/filament-v4` (nếu có) migrate resources tự động
- [ ] Sửa thủ công 13 Filament Resources + custom Auth pages
- [ ] Cập nhật namespace: `Filament\Forms\Form` → `Filament\Schemas\Schema` (theo Filament v4)
- [ ] Cập nhật Actions namespace
- [ ] Test toàn bộ admin: Appointment, Customer, CMS, Settings, Shield permissions
- [ ] CI: `php artisan test` + smoke test `/admin`

**DoD:** Admin panel hoạt động trên Filament v4, không regression CRM/CMS.

---

### Phase 2 — Cài LunarPHP (3–4 ngày)

**Mục tiêu:** Lunar core + admin hub chạy trong project.

```bash
composer require lunarphp/lunar
php artisan lunar:install
php artisan migrate
```

**Tasks:**
- [ ] Cấu hình `config/lunar.php`:
  - Default channel: `web`
  - Default currency: `VND` (decimal places: 0)
  - Default locale: `vi`, supported: `vi`, `en`
- [ ] **Gộp panel:** Đăng ký Lunar admin vào `AdminPanelProvider` hiện tại (không tạo `/lunar` panel riêng)
  - Publish Lunar Filament resources vào `app/Filament/`
  - Nhóm navigation: `E-commerce` (Lunar) vs `CRM` vs `Nội dung`
- [ ] Tắt/ẩn custom `ProductResource`, `OrderResource`… (sẽ xóa ở Phase 6)
- [ ] Cấu hình tax: Tax zone Vietnam (hoặc tax inclusive pricing nếu giá đã gồm thuế)
- [ ] Chạy `MigrateToLunarSeeder` — import 100 sản phẩm mẫu
- [ ] Verify trong admin Lunar: product list, tạo order thủ công, discount code

**i18n sản phẩm trên Lunar:**

Option A (khuyến nghị giai đoạn 1): **Adapter layer** — Lunar lưu `name` tiếng Việt; field `meta.translations.en` cho English; `ProductPresenter` đọc theo `?lang=`.

Option B (dài hạn): Lunar Attributes localized hoặc package translation.

**DoD:** Admin quản lý sản phẩm/đơn hàng qua Lunar; dữ liệu mẫu đã import.

---

### Phase 3 — API Adapter Layer (5–7 ngày) — **Phase quan trọng nhất**

**Mục tiêu:** Nuxt không cần đổi ngay — API giữ contract cũ, backend dùng Lunar.

#### 3.1 Tách controller

```
be/app/Http/Controllers/Api/Storefront/
├── SiteController.php          # getSite, sections (giữ)
├── BlogController.php          # posts (giữ)
├── BookingController.php       # booking (giữ)
├── ContactController.php       # contact (giữ)
├── ProductController.php       # NEW — wrap Lunar
├── CartController.php          # NEW — Lunar cart
├── CheckoutController.php      # NEW — Lunar order pipeline
├── CouponController.php        # NEW — Lunar discounts
├── OrderController.php         # NEW — lookup, retry payment
└── PaymentMethodController.php
```

Giữ `StorefrontController` làm facade deprecated hoặc xóa sau khi tách xong.

#### 3.2 Endpoint mapping

| Endpoint cũ | Implementation mới |
|-------------|-------------------|
| `GET /products` | Query `Lunar\Models\Product` + channel `web`, paginate |
| `GET /products/{slug}` | Lunar product by slug + related collection |
| `GET /categories` | Lunar Collections (thay TomatoPHP product categories) |
| `GET /cart` | `CartSession` → Lunar cart lines |
| `POST /cart/add` | Lunar `AddToCart` action; validate stock |
| `POST /cart/update` | Lunar cart line update |
| `POST /checkout` | Lunar `CreateOrder` pipeline + custom VNPay step |
| `POST /coupons/validate` | Lunar discount validation |
| `GET /orders/lookup` | Query Lunar orders by reference + phone |
| `GET /customer/orders` | Lunar orders where `customer_id` = mapped CRM customer |

#### 3.3 Services mới

```
be/app/Services/Commerce/
├── LunarCartSession.php       # Map X-Session-ID cookie → Lunar cart
├── LunarProductPresenter.php  # RawProduct shape (thay ProductPresenter)
├── LunarOrderPresenter.php    # OrderLookup shape (thay OrderPresenter)
├── CustomerBridge.php         # CRM Customer ↔ Lunar Customer sync
└── VNPayLunarPayment.php      # Payment driver / post-order hook
```

#### 3.4 VNPay + Lunar

```
Checkout flow:
1. Validate cart (Lunar)
2. Apply discount (Lunar)
3. Create order (status: awaiting-payment)
4. If COD → mark appropriately, send email
5. If VNPay → VNPayService.createPaymentUrl(order), lưu meta
6. IPN → update Lunar order payment status via custom listener
```

Hook points:
- `OrderObserver` cũ → `App\Listeners\LunarOrderEventSubscriber`
- Events: order created, payment paid, cancelled → mail + stock (Lunar handle stock)

#### 3.5 Cache

- `StorefrontCacheObserver` → observe Lunar `Product`, `Collection` models
- Cart endpoints: **không cache** (giữ như hiện tại)

#### 3.6 OpenAPI

- Cập nhật `api.json`, `OpenApi/Schemas.php` — giữ schema cũ cho Nuxt

**DoD:** Postman/Insomnia test pass toàn bộ commerce endpoints; response shape khớp contract hiện tại.

---

### Phase 4 — Nuxt frontend (3–4 ngày)

**Mục tiêu:** Verify storefront hoạt động end-to-end; sửa chỗ lệch nếu có.

**Tasks (ưu tiên thấp nếu adapter đúng):**
- [ ] Smoke test: list → detail → add cart → checkout COD → lookup order
- [ ] Smoke test: VNPay redirect + `/thanh-toan/ket-qua`
- [ ] Smoke test: coupon `WELCOME10`
- [ ] Smoke test: customer login → order history
- [ ] (Optional) Cập nhật `transformProduct` hỗ trợ variant selector nếu bật variants
- [ ] (Optional) Hiển thị `useCart.toast` (bug hiện tại)
- [ ] Xóa `content/products.json` (legacy)

**Phase 4b (tùy chọn, sau ổn định):** Refactor types sang Lunar-native (`variant_id` trong cart add, etc.)

**DoD:** Full checkout flow trên Nuxt với backend Lunar.

---

### Phase 5 — Admin consolidation (2–3 ngày)

**Mục tiêu:** Dashboard và workflow admin thống nhất.

- [ ] Gộp widget dashboard: revenue từ Lunar orders (thay `RevenueChartWidget` placeholder)
- [ ] `StatsOverviewWidget` — tách metric appointment vs commerce rõ ràng
- [ ] Filament Shield: permissions cho Lunar resources
- [ ] ReviewResource → link `lunar_product_id`
- [ ] Training doc ngắn cho admin: quản lý sản phẩm Lunar vs đặt lịch

**DoD:** 1 admin panel, navigation rõ ràng, permissions đầy đủ.

---

### Phase 6 — Cleanup & hardening (2 ngày)

- [ ] Xóa models/migrations/controllers/views legacy (§3.1)
- [ ] `migrate:fresh --seed` trên dev — 1 migration path sạch
- [ ] Viết migration guide: gộp old migrations hoặc squash
- [ ] Xóa `routes/web.php` shop routes
- [ ] Cập nhật `be/docs/API.md`
- [ ] Cập nhật `docs/ARCHITECTURE.md` — thêm Lunar layer
- [ ] Feature tests tối thiểu:
  - `CartAddTest`, `CheckoutCodTest`, `CouponValidateTest`, `OrderLookupTest`
- [ ] Scheduled job `orders:expire-unpaid-vnpay` → dùng Lunar order query

**DoD:** Không còn code e-commerce cũ; test pass; docs cập nhật.

---

## 6. Bridge: CRM Customer ↔ Lunar Customer

```
┌─────────────┐     checkout lần đầu      ┌──────────────────┐
│  customers  │ ─────────────────────────► │ lunar_customers  │
│  (CRM JWT)  │     CustomerBridge::sync() │                  │
└─────────────┘                            └──────────────────┘
       │                                            │
       │ appointments                               │ orders
       ▼                                            ▼
  appointments                              lunar_orders
```

**`CustomerBridge` logic:**
1. Checkout có `phone` → tìm `customers.phone`
2. Nếu có → tìm/tạo Lunar Customer với cùng email/phone
3. Gắn `customer_id` CRM vào order `meta.crm_customer_id` (không đụng Lunar schema)
4. `GET /api/customer/orders` → query orders where `meta.crm_customer_id` = auth customer

**Không merge** 2 bảng thành 1 — CRM auth (Sanctum) và Lunar customer lifecycle khác nhau.

---

## 7. Rủi ro & giảm thiểu

| Rủi ro | Mức | Giảm thiểu |
|--------|-----|------------|
| TomatoPHP FilamentCms chưa hỗ trợ Filament v4 | **Cao** | Test Phase 1 riêng; có plan B: 2 panel hoặc delay CMS upgrade |
| Lunar 1.5 beta instability | Trung bình | Pin version cụ thể; theo dõi changelog |
| Session cart mismatch (Nuxt cookie vs Lunar) | Trung bình | Integration test kỹ `LunarCartSession` |
| i18n product name/description | Trung bình | Adapter `meta.translations` — đủ cho vi/en |
| VNPay IPN với Lunar order states | Trung bình | Map status table rõ ràng, test sandbox |
| Curator media vs Lunar media | Thấp | Giữ URL trong presenter; migrate media sau |
| Thời gian underestimate | Trung bình | Phase 3 là bottleneck — không song song Phase 4 |

**Rollback:** Giữ branch `main` ổn định; `feat/lunar-migration` chỉ merge khi Phase 4 DoD đạt.

---

## 8. Checklist tương thích phiên bản (target)

| Thành phần | Version target |
|------------|----------------|
| PHP | ^8.3 (đã có) |
| Laravel | ^13.8 (đã có) |
| Filament | ^4.0 |
| LunarPHP | ^1.5 (`lunarphp/lunar`) |
| Nuxt | 3.x (không đổi) |

---

## 9. Thứ tự thực hiện tuần (gợi ý)

| Tuần | Focus |
|------|-------|
| **Tuần 1** | Phase 0 + Phase 1 (Filament v4) |
| **Tuần 2** | Phase 2 (Lunar install + seed migration) |
| **Tuần 3** | Phase 3a — Product/Cart API adapter |
| **Tuần 4** | Phase 3b — Checkout/VNPay/Orders + tests API |
| **Tuần 5** | Phase 4 + Phase 5 (Nuxt E2E + admin) |
| **Tuần 6** | Phase 6 cleanup + docs + buffer |

---

## 10. Definition of Done — toàn project

- [ ] Không còn table `products`, `orders`, `carts` custom
- [ ] Admin quản lý commerce 100% qua Lunar Filament resources
- [ ] Nuxt storefront: list, cart, checkout COD + VNPay, coupon, order lookup hoạt động
- [ ] CRM đặt lịch không regression
- [ ] Blog/CMS không regression
- [ ] ≥ 4 feature tests commerce
- [ ] `docs/ARCHITECTURE.md` phản ánh stack thực tế

---

## 11. Việc làm ngay sau khi approve plan

1. Tạo branch `feat/lunar-migration`
2. Spike 4h: cài Lunar trên clone local → xác nhận TomatoPHP + Filament v4 matrix
3. Bắt đầu Phase 1 nếu spike pass

---

## Phụ lục A — Files tham chiếu hiện tại

**Backend e-commerce (sẽ thay):**
- `be/app/Models/Product.php`, `Order.php`, `Cart.php`, …
- `be/app/Http/Controllers/Api/StorefrontController.php`
- `be/app/Filament/Resources/ProductResource.php`, `OrderResource.php`, …
- `be/app/Services/Payment/VNPayService.php` (giữ, refactor)
- `be/app/Support/ProductPresenter.php`, `OrderPresenter.php` (thay)

**Frontend (adapter giữ contract):**
- `apps/web/composables/useCart.ts`, `useProducts.ts`, `useOrder.ts`
- `apps/web/utils/storefront.ts` — types `RawProduct`, `CartItem`, `OrderLookup`

**Giữ nguyên:**
- `be/app/Models/Appointment.php`, `Customer.php`
- `be/app/Http/Controllers/Api/CustomerAuthController.php`
- TomatoPHP CMS resources
