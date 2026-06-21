# Lộ trình triển khai — Thăng Long Chè Việt

> **Tổng ước tính:** 10–14 tuần (1 dev full-stack)
> **Chiến lược:** FE trước → BE sau; Landing Page → Marketing Site → CRM
> **Cập nhật lần cuối:** 2026-06-20

---

## Tổng quan phân kỳ

```
Phase 1 (FE only)  →  Landing Page chạy ngay, không cần backend
Phase 2 (FE only)  →  Website marketing đầy đủ, template engine FE
Phase 3 (BE + FE)  →  Backend/CMS layer, nội dung quản lý qua admin
Phase 4 (FE + BE)  →  Booking form thật, email notification
Phase 5 (CRM)      →  Khách hàng đăng nhập, quản lý lịch hẹn, dashboard
Phase 6 (Polish)   →  SEO hoàn chỉnh, production, Lighthouse ≥ 90
```

**Nguyên tắc:** Mỗi phase đều deploy được và có giá trị thực tế ngay — không chờ xong toàn bộ mới launch.

---

## Phase 1 — Landing Page (FE only) — 1–2 tuần

### Mục tiêu
Ra mắt nhanh: 1 trang duy nhất, không backend, deploy ngay lên VPS.

### Stack phase này
- Nuxt 3 + Tailwind + @nuxtjs/i18n + @nuxt/image
- Data: **JSON tĩnh** trong `apps/web/content/` (không cần API)
- Deploy: Nuxt generate (SSG) → Nginx serve static files

### Tasks
- [ ] Init monorepo pnpm (apps/web, packages/shared — chưa cần apps/api)
- [ ] Nuxt 3 config: Tailwind mobile-first, i18n vi/en, @nuxt/image
- [ ] `locales/vi.json` + `locales/en.json` — strings UI cơ bản
- [ ] Layout: AppHeader (responsive hamburger ↔ nav) + AppFooter
- [ ] Landing page (1 trang `/`) với sections:
  - Hero (slider hoặc video bg — chọn 1 template)
  - Services overview (3–6 dịch vụ nổi bật, từ JSON)
  - Team snippet (2–3 stylist)
  - Promotion/promo banner
  - CTA đặt lịch → scroll xuống contact
  - Contact info + Google Maps embed
- [ ] Data JSON tĩnh: `content/services.json`, `content/team.json`, `content/settings.json`
- [ ] CI/CD GitHub Actions → build SSG → deploy VPS qua SSH
- [ ] Domain + SSL (Let's Encrypt)

### Definition of Done
- [ ] Landing page live trên domain thật
- [ ] Responsive đúng ở 375px / 768px / 1280px
- [ ] Chuyển đổi vi/en hoạt động
- [ ] Lighthouse mobile: Performance ≥ 85, SEO ≥ 88

---

## Phase 2 — Marketing Website (FE only) — 1–2 tuần

### Mục tiêu
Website đầy đủ trang, template system hoạt động ở FE, vẫn không cần backend.

### Data strategy
- Content vẫn từ JSON tĩnh trong `content/` hoặc Nuxt Content module
- Template registry FE đã hoạt động với data mock
- Chuẩn bị API interface (types/DTO) để Phase 3 swap vào dễ dàng

### Tasks
- [ ] Page template registry (dynamic import):
  - `home-hero-slider`, `home-video-bg`, `home-parallax`
  - `services-grid`, `services-tabs`
  - `gallery-filter`, `team-cards`, `blog-list`
  - `contact-map`, `coming-soon`
- [ ] Các trang:
  - `/dich-vu` + `/en/services` — danh sách dịch vụ đầy đủ
  - `/gallery` + `/en/gallery` — bộ lọc ảnh
  - `/team` + `/en/team` — stylist profiles
  - `/blog` + `/en/blog` — listing + detail (content từ markdown/JSON)
  - `/lien-he` + `/en/contact` — contact form (Phase này gửi mailto:)
- [ ] Theme switcher FE (CSS variables từ JSON config tĩnh)
- [ ] Booking form UI (multi-step, chưa kết nối backend):
  - Step 1: Chọn dịch vụ
  - Step 2: Chọn stylist
  - Step 3: Thông tin + ngày ưa thích
  - Step 4: Xác nhận (submit → mailto: hoặc Formspree tạm)
- [ ] SEO cơ bản: useSeoMeta per page, static sitemap, hreflang
- [ ] Animation: scroll reveal (VueUse/CSS), Swiper cho slider

### Definition of Done
- [ ] Tất cả trang hoạt động, navigation đúng cả vi/en
- [ ] Booking form UI responsive hoàn chỉnh
- [ ] Template switch bằng cách đổi key trong config JSON
- [ ] Lighthouse mobile: Performance ≥ 88, SEO ≥ 90

---

## Phase 3 — Backend / CMS Layer (BE + FE) — 2–3 tuần

### Mục tiêu
Thay data JSON tĩnh bằng API thật. Admin quản lý nội dung qua web.

### Stack thêm vào
- NestJS + Prisma + PostgreSQL + Redis
- Docker Compose: web + api + postgres + redis + nginx

### Tasks

**Backend (NestJS):**
- [ ] Prisma schema: `themes`, `pages`, `page_sections`, `services`, `staff`, `gallery_items`, `blog_posts`, `site_settings`, `media` — tất cả có `translations(JSONB)`
- [ ] Modules: AuthModule (JWT), PagesModule, ThemesModule, ContentModule, MediaModule, SettingsModule, SeoModule
- [ ] Section schema registry (shared): định nghĩa fields + image specs cho từng section type
- [ ] Image validation khi upload: kiểm tra kích thước, tỷ lệ, dung lượng trước khi lưu
- [ ] Preview token API: `POST /pages/:id/preview-token` (TTL 15 phút)
- [ ] Redis cache cho public GET (TTL 300s), invalidate on admin publish
- [ ] Seeder: migrate data từ JSON tĩnh Phase 1–2 vào DB

**Frontend update:**
- [ ] Thay `useFetch('/content/*.json')` → `useAsyncData(() => $fetch('/api/...'))`
- [ ] **Visual Split-Screen Editor** (`/admin/pages/:id/edit`):
  - Layout 2 cột: form editor trái + live preview phải
  - Preview re-render debounced 300ms khi admin thay đổi
  - Viewport switcher trong preview: 📱 375px / 💻 768px / 🖥 1280px
  - Click section trong preview → scroll đến form section tương ứng
  - Section type-aware: render đúng fields theo `sectionSchemas` registry
- [ ] **Image Spec UI** (component `ImageFieldEditor`):
  - Hiển thị inline: kích thước khuyến nghị, tỷ lệ, max dung lượng, định dạng
  - Inline crop tool nếu ảnh upload sai tỷ lệ
  - Alt text field bắt buộc (validate trước khi lưu)
  - Warning khi ảnh > maxSizeMB với option compress tự động
- [ ] **Theme Color & Typography Editor**:
  - Color picker cho primary, secondary, text, background
  - Google Fonts selector cho heading + body
  - Toggle dark/light header, center/left logo
  - Lưu theme tùy chỉnh, reset về preset
- [ ] Admin panel các màn hình khác:
  - Login + Dashboard
  - CRUD: dịch vụ, team, gallery, blog (form tab vi/en)
  - Media library (upload, search, reuse)
  - Cài đặt site
- [ ] Preview public: `/preview/:pageId?token=xxx` (noindex, data DRAFT)

**Infra:**
- [ ] Docker Compose local + production
- [ ] Nginx config (proxy /api → NestJS, / → Nuxt)
- [ ] pg_dump backup daily

### Definition of Done
- [ ] Admin nhập nội dung, publish → website cập nhật trong < 5s
- [ ] Swap theme/template không cần deploy
- [ ] API cache hoạt động (Redis), response < 100ms khi cache hit

---

## Phase 4 — Booking Form Thật + Notification — 1 tuần

### Mục tiêu
Form đặt lịch kết nối backend thật, thông báo đến salon.

### Tasks

**Backend:**
- [ ] `FormSubmissionsModule`: POST /forms/booking, /forms/contact
- [ ] Rate limit (5 req/IP/h), honeypot, optional reCAPTCHA
- [ ] BullMQ queue: email notification async
- [ ] Email templates (HTML): gửi salon + auto-reply khách
- [ ] Admin: danh sách submissions, filter theo ngày/trạng thái

**Frontend:**
- [ ] Booking form kết nối API thật (thay Formspree/mailto)
- [ ] Toast feedback: thành công / lỗi / đang gửi
- [ ] Validation realtime (Zod shared schema)

### Definition of Done
- [ ] Submit booking → email salon nhận < 30s
- [ ] Auto-reply khách hàng có thông tin booking
- [ ] Rate limit block sau 5 lần/IP/giờ

---

## Phase 5 — CRM: Khách Hàng + Lịch Hẹn — 3–4 tuần

### Mục tiêu
Chuyển từ "form submission" sang hệ thống CRM thật: khách có tài khoản, chủ quản lý lịch.

### Scope đã xác nhận
- **Chủ salon**: xem báo cáo, quản lý tổng thể lịch hẹn
- **Khách hàng**: tự đặt lịch, đăng nhập xem lịch sử

### Data Model mới

```
customers:
  id, email, phone, name, notes, avatar
  password_hash (cho customer login)
  created_at, updated_at

appointments:
  id, customer_id (FK), status
  services: uuid[] (dịch vụ đã chọn)
  staff_id (FK, nullable)
  preferred_date, confirmed_date
  note, internal_note (của salon)
  created_at, updated_at

appointment_status_history:
  id, appointment_id, from_status, to_status
  changed_by (admin/customer), changed_at, note
```

**Status workflow:**
```
PENDING → CONFIRMED → COMPLETED
       ↘ CANCELLED (bởi salon hoặc khách)
```

### Tasks

**Backend — CRM modules:**
- [ ] `CustomersModule`:
  - Đăng ký / đăng nhập (email + password, JWT riêng cho customer)
  - Profile: xem/cập nhật thông tin cá nhân
  - Lịch sử đặt lịch của customer
  - Auto-create customer từ form submission nếu phone/email đã tồn tại
- [ ] `AppointmentsModule`:
  - Public: POST /appointments (thay /forms/booking) — tạo appointment + customer
  - Admin: GET /appointments (list, filter, search, phân trang)
  - Admin: PATCH /appointments/:id/status (thay đổi trạng thái + ghi log)
  - Admin: GET /appointments/calendar?week=YYYY-Www (data cho calendar view)
  - Customer: GET /my/appointments (lịch sử của chính mình)
- [ ] `DashboardModule` (owner):
  - Hôm nay: số lịch hẹn, dịch vụ, tỷ lệ xác nhận
  - Tuần này / tháng này: trend theo ngày
  - Dịch vụ phổ biến nhất (top 5)
  - Khách hàng mới vs quay lại

**Frontend — Customer Portal:**
- [ ] `/dang-nhap` + `/en/login` — customer login/register
- [ ] `/tai-khoan` + `/en/account`:
  - Thông tin cá nhân
  - Lịch sử đặt lịch (timeline cards)
  - Lịch sắp tới (CTA: huỷ nếu còn > 24h)
- [ ] Booking form cập nhật: nếu đã login → pre-fill thông tin, skip Step 3

**Frontend — Admin CRM:**
- [ ] `/admin/appointments`:
  - Calendar view (tuần/tháng — thư viện FullCalendar hoặc custom)
  - List view (filter: ngày, trạng thái, dịch vụ)
  - Detail modal: xem info, đổi trạng thái, ghi ghi chú nội bộ
- [ ] `/admin/customers`:
  - Danh sách khách hàng (search theo tên/phone/email)
  - Detail: profile + lịch sử appointment
-
