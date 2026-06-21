# Kiến trúc hệ thống — Thăng Long Chè Việt

> Tài liệu này mô tả toàn bộ kiến trúc hệ thống website salon/spa, tham khảo từ Modis template.
> **Cập nhật lần cuối:** 2026-06-20

---

## 1. Tổng quan

Hệ thống website marketing salon/spa với các đặc điểm chính:

- **Engine đa template/theme**: admin quản lý layout trang từ registry, không cần deploy lại
- **Song ngữ vi/en**: toàn bộ nội dung, URL, SEO meta đều localised
- **Responsive mobile-first**: thiết kế từ 375px lên đến 1920px+
- **SEO-first**: Nuxt 3 SSR/ISR, JSON-LD, sitemap per locale
- **Form đặt lịch**: chọn dịch vụ + stylist, lưu DB, thông báo email/Zalo

---

## 2. Tech Stack

| Layer | Công nghệ | Lý do chọn |
|-------|-----------|------------|
| Frontend | Nuxt 3, Vue 3, TypeScript | SSR native, DX tốt, ecosystem mạnh |
| Styling | Tailwind CSS | Mobile-first breakpoints, zero-runtime CSS |
| i18n | @nuxtjs/i18n v9 + Vue I18n v10 | Tích hợp native Nuxt 3 |
| Images | @nuxt/image | WebP/AVIF tự động, responsive srcset, lazy load |
| Animation | VueUse, CSS | Không jQuery, lightweight |
| Slider | Swiper.js | Thay Revolution Slider — Vue-native |
| Backend | NestJS, TypeScript | Module rõ ràng, decorator-based, DI |
| ORM | Prisma | Type-safe, migration tốt |
| Queue | BullMQ + Redis | Async notification, retry logic |
| Database | PostgreSQL 16 | JSONB cho translations/config |
| Cache | Redis 7 | API cache, rate limit, session |
| Infra | Docker Compose, Nginx | Container hoá, dễ deploy VPS |
| CDN | Cloudflare | CDN + WAF + DDoS protection |
| CI/CD | GitHub Actions | Lint → build → deploy SSH |

---

## 3. Kiến trúc tổng thể

```
┌─────────────┐    ┌──────────────────────────────────────────┐
│  Client      │    │           VPS (Docker Compose)           │
│  (Browser/   │    │                                          │
│   Mobile)    │    │  ┌─────────┐    ┌─────────────────────┐ │
│             ─┼────┼─►│  Nginx  │───►│   Nuxt 3 (SSR/ISR)  │ │
└─────────────┘    │  │  + SSL  │    │   :3000              │ │
       │           │  └────┬────┘    └──────────┬──────────┘ │
       │           │       │                    │             │
  Cloudflare       │       └────────────────────┤             │
  CDN/WAF          │                            │             │
                   │                   ┌────────▼────────┐    │
                   │                   │  NestJS API      │    │
                   │                   │  :4000           │    │
                   │                   └──┬───────┬──────┘    │
                   │              ┌───────┘       └───────┐   │
                   │         ┌────▼────┐           ┌──────▼─┐ │
                   │         │ Postgres│           │ Redis  │ │
                   │         │ :5432   │           │ :6379  │ │
                   │         └─────────┘           └────────┘ │
                   └──────────────────────────────────────────┘
                                    │
                        ┌───────────┼───────────┐
                        │           │           │
                   ┌────▼───┐  ┌───▼──┐  ┌────▼──────┐
                   │  SMTP  │  │ Zalo │  │ MinIO/    │
                   │  Email │  │ OA   │  │ Storage   │
                   └────────┘  └──────┘  └───────────┘
```

---

## 4. Template Engine

### Lớp 1: Theme (skin toàn site)

Config JSON lưu trong DB (`themes` table), admin chọn 1 theme active:

```json
{
  "id": "spa-elegant",
  "colors": {
    "primary": "#c9a86c",
    "secondary": "#2d3748",
    "header": "dark"
  },
  "typography": {
    "heading": "Playfair Display",
    "body": "Inter"
  },
  "header": { "layout": "center", "sticky": true },
  "footer": { "variant": "extended" }
}
```

Frontend inject CSS variables tại runtime:
```css
:root {
  --color-primary: #c9a86c;
  --font-heading: 'Playfair Display', serif;
}
```

### Lớp 2: Page Template Registry

```typescript
// apps/web/utils/templateRegistry.ts
export const templateRegistry = {
  // Home variants
  'home-hero-slider':  () => import('~/templates/HomeHeroSlider.vue'),
  'home-video-bg':     () => import('~/templates/HomeVideoBg.vue'),
  'home-parallax':     () => import('~/templates/HomeParallax.vue'),
  'home-typing-text':  () => import('~/templates/HomeTypingText.vue'),
  'home-dark-info':    () => import('~/templates/HomeDarkInfo.vue'),
  // Services
  'services-grid':     () => import('~/templates/ServicesGrid.vue'),
  'services-masonry':  () => import('~/templates/ServicesMasonry.vue'),
  'services-tabs':     () => import('~/templates/ServicesTabs.vue'),
  // Other pages
  'gallery-filter':    () => import('~/templates/GalleryFilter.vue'),
  'team-cards':        () => import('~/templates/TeamCards.vue'),
  'blog-list':         () => import('~/templates/BlogList.vue'),
  'contact-map':       () => import('~/templates/ContactMap.vue'),
  'coming-soon':       () => import('~/templates/ComingSoon.vue'),
}
```

Admin gán `templateKey` cho từng trang. Thêm template mới: tạo Vue component + đăng ký key, không cần sửa DB.

---

## 5. Monorepo Structure

```
Thang_long_che_viet_project/
├── .cursor/
│   └── rules/                    # Cursor AI rules (enforce cho mọi model)
│       ├── 00-project-overview.mdc
│       ├── 01-responsive-mobile-first.mdc
│       ├── 02-i18n-multilanguage.mdc
│       ├── 03-nuxt-frontend.mdc
│       ├── 04-nestjs-api.mdc
│       └── 05-database-schema.mdc
├── apps/
│   ├── web/                      # Nuxt 3
│   │   ├── assets/
│   │   ├── components/           # AppHeader, AppFooter, shared UI
│   │   ├── composables/          # useTheme, useBookingForm, useSeo
│   │   ├── layouts/              # default.vue, blank.vue, admin.vue
│   │   ├── locales/              # vi.json, en.json
│   │   ├── pages/                # index.vue, [slug].vue, admin/
│   │   ├── templates/            # Page template components
│   │   ├── utils/                # templateRegistry.ts, api.ts
│   │   └── nuxt.config.ts
│   └── api/                      # NestJS
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── pages/
│       │   │   ├── themes/
│       │   │   ├── content/      # services, staff, gallery, blog
│       │   │   ├── media/
│       │   │   ├── forms/
│       │   │   ├── settings/
│       │   │   └── seo/
│       │   └── common/           # guards, decorators, filters
│       └── prisma/
│           ├── schema.prisma
│           ├── migrations/
│           └── seed.ts
├── packages/
│   └── shared/                   # Zod schemas, DTO types dùng chung
├── infra/
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   ├── nginx/
│   │   ├── nginx.conf
│   │   └── sites/salon.conf
│   └── scripts/
│       └── deploy.sh
└── docs/
    ├── ARCHITECTURE.md           # File này
    └── PLAN.md                   # Lộ trình triển khai
```

---

## 6. Data Model (PostgreSQL)

### Core Entities

```sql
-- Themes
themes: id, name, config(JSONB), is_active, created_at, updated_at

-- Pages & Content
pages: id, slug, translations(JSONB), template_key, status, sort_order
page_sections: id, page_id, type, translations(JSONB), sort_order

-- Business Content
services: id, category, price, duration_min, image, translations(JSONB)
staff: id, avatar, specialties(text[]), translations(JSONB)
gallery_items: id, image_url, category, translations(JSONB)
blog_posts: id, slug, cover, published_at, translations(JSONB)

-- Settings & Submissions
site_settings: id, key, value, translations(JSONB)
form_submissions: id, type, payload(JSONB), status, created_at
media: id, url, alt, mime_type, size, created_at
admin_users: id, email, password_hash, role, created_at
```

### translations JSONB schema
```json
{
  "vi": { "name": "...", "description": "..." },
  "en": { "name": "...", "description": "..." }
}
```
- `vi` bắt buộc, `en` optional — fallback về `vi` nếu trống.

---

## 7. API Modules (NestJS)

| Module | Public Endpoints | Admin Endpoints |
|--------|-----------------|-----------------|
| PagesModule | GET /pages/:slug?lang= | CRUD + publish |
| ThemesModule | GET /themes/active | CRUD + set active |

---

## 12. CRM Architecture (Phase 5)

### Scope xác nhận
- **Khách hàng** (customer): đăng ký, đăng nhập, đặt lịch, xem lịch sử
- **Chủ salon** (owner/admin): quản lý lịch hẹn calendar, hồ sơ khách, dashboard

### Data Model CRM (bổ sung vào Prisma schema)

```prisma
model Customer {
  id            String        @id @default(uuid())
  email         String?       @unique
  phone         String        @unique
  name          String
  notes         String?       // ghi chú nội bộ của salon
  avatar        String?
  passwordHash  String?       @map("password_hash")
  appointments  Appointment[]
  createdAt     DateTime      @default(now()) @map("created_at")
  updatedAt     DateTime      @updatedAt @map("updated_at")

  @@map("customers")
}

model Appointment {
  id              String      @id @default(uuid())
  customer        Customer    @relation(fields: [customerId], references: [id])
  customerId      String      @map("customer_id")
  status          ApptStatus  @default(PENDING)
  serviceIds      String[]    @map("service_ids")  // uuid[] của services
  staffId         String?     @map("staff_id")
  preferredDate   DateTime?   @map("preferred_date")
  confirmedDate   DateTime?   @map("confirmed_date")
  note            String?     // ghi chú của khách
  internalNote    String?     @map("internal_note")  // ghi chú của salon
  statusHistory   ApptStatusHistory[]
  createdAt       DateTime    @default(now()) @map("created_at")
  updatedAt       DateTime    @updatedAt @map("updated_at")

  @@index([customerId])
  @@index([status])
  @@index([preferredDate])
  @@map("appointments")
}

model ApptStatusHistory {
  id            String      @id @default(uuid())
  appointment   Appointment @relation(fields: [appointmentId], references: [id])
  appointmentId String      @map("appointment_id")
  fromStatus    ApptStatus  @map("from_status")
  toStatus      ApptStatus  @map("to_status")
  changedBy     String      @map("changed_by") // "admin" | customer_id
  note          String?
  changedAt     DateTime    @default(now()) @map("changed_at")

  @@map("appointment_status_history")
}

enum ApptStatus {
  PENDING
  CONFIRMED
  COMPLETED
  CANCELLED
}
```

### Status Workflow
```
PENDING ──► CONFIRMED ──► COMPLETED
   │              │
   └──────────────┴──► CANCELLED
```
- Khách: có thể huỷ nếu confirmedDate còn > 24h
- Admin: có thể đổi bất kỳ trạng thái nào

### CRM API Modules (NestJS)

| Module | Endpoint | Mô tả |
|--------|----------|-------|
| CustomersModule | POST /auth/customer/register | Đăng ký khách hàng |
| | POST /auth/customer/login | JWT token riêng cho customer |
| | GET /my/profile | Profile của customer đang login |
| | GET /my/appointments | Lịch sử + upcoming appointments |
| AppointmentsModule | POST /appointments | Tạo appointment (public + customer) |
| | GET /appointments | Admin: list + filter + search |
| | GET /appointments/calendar | Admin: data tuần cho calendar view |
| | PATCH /appointments/:id/status | Admin: đổi trạng thái + log |
| | DELETE /appointments/:id | Customer: huỷ nếu còn > 24h |
| DashboardModule | GET /admin/dashboard | Stats hôm nay/tuần/tháng |

### Customer Auth — tách biệt Admin Auth
```
Admin JWT:    secret=ADMIN_JWT_SECRET, role='admin'
Customer JWT: secret=CUSTOMER_JWT_SECRET, role='customer'
```
Dùng 2 NestJS `PassportStrategy` riêng biệt để tránh leo thang quyền.

### CRM Pages (Nuxt)

**Customer Portal:**
- `/dang-nhap` — login/register form (tab)
- `/tai-khoan` — profile + lịch sử (protected)
- `/tai-khoan/dat-lich` — booking form pre-filled nếu đã login

**Admin CRM:**
- `/admin/appointments` — calendar + list view
- `/admin/customers` — danh sách + detail
- `/admin/dashboard` — stats + charts

### Auto-create Customer từ Legacy Submissions
Khi Phase 5 triển khai, chạy migration:
```ts
// Migration script: form_submissions → customers + appointments
for each formSubmission:
  customer = findOrCreate({ phone: sub.payload.phone })
  appointment = create({ customerId: customer.id, ...sub.payload, status: 'COMPLETED' })
```

---

## 13. Visual Theme Editor — Admin UX (Phase 3 nâng cấp)

### Mô hình editor: Split-Screen với Live Preview

Thay vì form thuần, admin editor dùng mô hình **split-screen**:

```
┌───────────────────────────┬──────────────────────────────────────┐
│   Section Editor (trái)   │   Live Preview (phải)                │
│                           │                                      │
│  ▼ Hero Section           │  [viewport switcher]                 │
│  ├─ Background Image      │  📱 375px  💻 768px  🖥 1280px       │
│  │  [Upload / Thư viện]   │                                      │
│  │  📐 1920×1080px min    │  ┌──────────────────────────────┐    │
│  │  📦 Max 2MB            │  │                              │    │
│  │  🖼 JPG / WebP         │  │   [HERO IMAGE — live render] │    │
│  │  📝 Alt text (bắt buộc)│  │   Tiêu đề trang              │    │
│  │                        │  │   Mô tả ngắn                 │    │
│  ├─ Overlay opacity       │  │   [CTA Button]               │    │
│  │  ████░░░░  60%  slider │  │                              │    │
│  │                        │  └──────────────────────────────┘    │
│  ├─ Heading (vi / en tab) │                                      │
│  │  [Text input]          │  ┌──────────────────────────────┐    │
│  │                        │  │  Services Section — live     │    │
│  ├─ Sub-heading           │  └──────────────────────────────┘    │
│  │  [Text input]          │                                      │
│  │                        │  ← Click section → jump to form      │
│  └─ CTA Button text       │                                      │
│     [Text input]          │  [💾 Lưu nháp]  [👁 Preview public] │
│                           │  [🚀 Publish]                        │
│  ▼ Services Section       │                                      │
│  ├─ Section title         │                                      │
│  ├─ Layout: grid/list/tab │                                      │
│  └─ Services chọn         │                                      │
└───────────────────────────┴──────────────────────────────────────┘
```

**Cơ chế hoạt động:**
- Preview bên phải render đúng Vue component của template đang edit
- Editor cập nhật → preview re-render debounced 300ms (không cần save)
- Click vào section trong preview → scroll form bên trái đến section tương ứng
- Viewport switcher: preview ở 375px / 768px / 1280px
- Nút "Preview public": mở tab mới với `/preview/:pageId?token=...` (không cần publish)
- Nút "Lưu nháp": lưu DB, không ảnh hưởng trang live
- Nút "Publish": invalidate Redis cache → trang live cập nhật

---

### Section Content Schema (typed per section type)

Mỗi section type định nghĩa schema fields + image specs:

```typescript
// packages/shared/sectionSchemas.ts

export const sectionSchemas = {

  'hero': {
    label: 'Hero Banner',
    fields: {
      backgroundImage: {
        type: 'image',
        label: 'Ảnh nền Hero',
        spec: {
          recommendedSize: '1920×1080px',
          minWidth: 1280,
          aspectRatio: '16:9',
          maxSizeMB: 3,
          formats: ['jpg', 'webp', 'png'],
          altTextRequired: true,
          note: 'Ảnh sẽ tự convert sang WebP khi upload'
        }
      },
      overlayOpacity: { type: 'slider', min: 0, max: 100, default: 50, label: 'Độ mờ overlay (%)' },
      heading:        { type: 'text-i18n', label: 'Tiêu đề chính', maxLength: 80 },
      subheading:     { type: 'text-i18n', label: 'Mô tả ngắn', maxLength: 160 },
      ctaText:        { type: 'text-i18n', label: 'Text nút CTA', maxLength: 30 },
      ctaLink:        { type: 'url', label: 'Link nút CTA' },
    }
  },

  'services_grid': {
    label: 'Danh sách Dịch vụ (Grid)',
    fields: {
      sectionTitle: { type: 'text-i18n', label: 'Tiêu đề section', maxLength: 60 },
      columns:      { type: 'select', options: [2, 3, 4], default: 3, label: 'Số cột (desktop)' },
      showPrice:    { type: 'boolean', default: true, label: 'Hiển thị giá' },
      selectedServices: { type: 'relation-multi', entity: 'services', label: 'Chọn dịch vụ hiển thị' }
    }
  },

  'promo_banner': {
    label: 'Banner Khuyến mãi',
    fields: {
      backgroundImage: {
        type: 'image',
        label: 'Ảnh nền Banner',
        spec: {
          recommendedSize: '1440×500px',
          minWidth: 800,
          aspectRatio: '3:1',
          maxSizeMB: 2,
          formats: ['jpg', 'webp'],
          altTextRequired: true
        }
      },
      backgroundColor: { type: 'color', label: 'Màu nền (nếu không dùng ảnh)', default: '#1a1a1a' },
      heading:    { type: 'text-i18n', label: 'Tiêu đề promo', maxLength: 60 },
      discount:   { type: 'text', label: 'Ưu đãi (vd: 50%)', maxLength: 10 },
      expiryDate: { type: 'date', label: 'Ngày hết hạn' }
    }
  },

  'team_cards': {
    label: 'Đội ngũ Stylist',
    fields: {
      sectionTitle: { type: 'text-i18n', label: 'Tiêu đề section' },
      selectedStaff: { type: 'relation-multi', entity: 'staff', label: 'Chọn stylist hiển thị' },
      showSpecialties: { type: 'boolean', default: true, label: 'Hiển thị chuyên môn' }
    }
  },

  'gallery': {
    label: 'Thư viện Ảnh',
    fields: {
      sectionTitle: { type: 'text-i18n', label: 'Tiêu đề section' },
      layout: { type: 'select', options: ['masonry', 'grid', 'slider'], default: 'masonry' },
      categories: { type: 'tag-list', label: 'Danh mục lọc' }
    }
  },

  'video_hero': {
    label: 'Hero Video nền',
    fields: {
      videoUrl:    { type: 'url', label: 'URL video (YouTube / direct MP4)' },
      posterImage: {
        type: 'image',
        label: 'Ảnh placeholder (hiện khi video chưa load)',
        spec: {
          recommendedSize: '1920×1080px',
          aspectRatio: '16:9',
          maxSizeMB: 2,
          formats: ['jpg', 'webp'],
          altTextRequired: false,
          note: 'Hiển thị trên mobile (video không autoplay)'
        }
      },
      heading: { type: 'text-i18n', label: 'Tiêu đề overlay' },
      overlayOpacity: { type: 'slider', min: 0, max: 80, default: 40, label: 'Overlay (%)' }
    }
  }
}
```

**Schema này dùng ở:**
- FE: Admin editor render đúng loại input field và hiển thị image spec
- BE: Validate content JSONB khi lưu DB
- Shared package: `packages/shared/sectionSchemas.ts` — dùng chung FE + BE

---

### Image Spec UI Component

Khi admin click vào field ảnh, hiện spec panel ngay bên dưới field:

```
┌─────────────────────────────────────────────────────────┐
│  🖼 Ảnh nền Hero                                         │
│  ┌──────────┐  [Chọn từ thư viện]  [Upload ảnh mới]    │
│  │          │                                            │
│  │  Preview │  📐 Kích thước khuyến nghị: 1920×1080px  │
│  │          │  📏 Tỷ lệ: 16:9 (landscape bắt buộc)    │
│  │          │  📦 Dung lượng tối đa: 3MB               │
│  └──────────┘  🖼 Định dạng: JPG, WebP, PNG            │
│                ℹ️  Ảnh sẽ tự convert sang WebP khi upload│
│                                                          │
│  📝 Alt text (SEO + accessibility — bắt buộc):          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Salon tóc cao cấp Thăng Long Chè Việt            │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Validation trước khi upload:**
- Kiểm tra kích thước file (> maxSizeMB → warning + compress option)
- Kiểm tra tỷ lệ ảnh (sai aspect ratio → cảnh báo + crop tool)
- Alt text: validate required nếu `altTextRequired: true`

**Crop tool inline:** Nếu ảnh upload sai tỷ lệ, hiện crop tool ngay trong modal upload (không redirect đi đâu).

---

### Theme Color & Typography Editor

Thay vì chỉ chọn theme preset, admin có thể chỉnh từng thông số:

```
Theme: "Spa Elegant"  [Chọn preset khác ▼]

🎨 Màu sắc
├─ Màu chính:      [████] #c9a86c  (color picker)
├─ Màu phụ:        [████] #2d3748
├─ Màu text:       [████] #1a1a1a
├─ Màu background: [████] #ffffff
└─ Header:         ● Dark  ○ Light

🔤 Typography
├─ Font tiêu đề:   [Playfair Display ▼]  (Google Fonts list)
├─ Font 
