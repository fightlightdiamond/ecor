# 📋 SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
## DỰ ÁN: THƯƠNG MẠI ĐIỆN TỬ HEADLESS – STRAPI + MEDUSA (ĐỘC LẬP)
## SỬ DỤNG MEDUSA NEXT.JS STARTER STOREFRONT LÀM FRONTEND

---

## 1. GIỚI THIỆU

### 1.1 Mục đích
Tài liệu này mô tả chi tiết các yêu cầu cho một nền tảng thương mại điện tử hiện đại, sử dụng kiến trúc **headless** với:

- **Medusa**: Headless commerce engine xử lý toàn bộ logic bán hàng (giỏ hàng, thanh toán, đơn hàng, sản phẩm, inventory, khách hàng, auth).
- **Strapi v5**: Headless CMS quản lý toàn bộ nội dung (landing page, blog, SEO, marketing content, media).
- **Medusa Next.js Starter Storefront**: Frontend chính thức của Medusa, được xây dựng với Next.js, cung cấp sẵn các tính năng thương mại điện tử hiện đại.

**Lưu ý quan trọng**: Medusa và Strapi hoạt động **độc lập, không đồng bộ dữ liệu với nhau**. Storefront sẽ gọi API từ từng hệ thống riêng biệt.

### 1.2 Phạm vi
Dự án bao gồm:
- **Landing Page** với các section động (Hero, Feature, Testimonial, CTA) – dữ liệu từ Strapi.
- **Blog** đa danh mục, hỗ trợ SEO – dữ liệu từ Strapi.
- **Cửa hàng trực tuyến** đầy đủ tính năng thương mại điện tử (product listing, cart, checkout, account) – dữ liệu và logic từ Medusa.
- **Admin Panel**: Strapi Admin cho content, Medusa Admin cho commerce.

### 1.3 Đối tượng sử dụng
| Vai trò | Mô tả |
|---------|-------|
| **Khách hàng (Guest)** | Xem sản phẩm, blog, landing page |
| **Khách hàng (Registered)** | Mua hàng, xem lịch sử đơn hàng, quản lý profile |
| **Content Manager** | Quản lý bài blog, landing page, SEO, media trong Strapi |
| **Product Manager** | Quản lý sản phẩm, inventory, giá, đơn hàng trong Medusa Admin |
| **Admin** | Quản lý toàn bộ hệ thống (cả hai admin) |

---

## 2. YÊU CẦU CHỨC NĂNG

### 2.1 Landing Page

| ID | Yêu cầu | Mô tả chi tiết |
|----|---------|----------------|
| LP-01 | Hero Section | Slider/banner với CTA, nội dung quản lý từ Strapi |
| LP-02 | Feature Showcase | Giới thiệu tính năng nổi bật, content từ Strapi |
| LP-03 | Product Grid | Hiển thị sản phẩm nổi bật, lấy dữ liệu từ Medusa API |
| LP-04 | Testimonial | Đánh giá khách hàng, quản lý từ Strapi |
| LP-05 | Newsletter Signup | Form đăng ký nhận tin, tích hợp email service |
| LP-06 | Trust Badges | Hiển thị chứng nhận, bảo mật, vận chuyển |
| LP-07 | SEO Meta | Title, Description, Open Graph quản lý từ Strapi |
| LP-08 | Responsive | Tương thích mobile, tablet, desktop (Mobile-first) |

### 2.2 Blog

| ID | Yêu cầu | Mô tả chi tiết |
|----|---------|----------------|
| BL-01 | Danh sách bài viết | Pagination, filter theo danh mục, tag |
| BL-02 | Chi tiết bài viết | Rich content, hình ảnh, video embedded |
| BL-03 | Danh mục | Quản lý category trong Strapi |
| BL-04 | Tags | Hệ thống tag cho bài viết |
| BL-05 | Tác giả | Hiển thị thông tin tác giả |
| BL-06 | Bài viết liên quan | Gợi ý dựa trên category/tag |
| BL-07 | Comment | Hệ thống bình luận (có moderate) |
| BL-08 | Search | Tìm kiếm bài viết theo từ khóa |
| BL-09 | SEO | Tự động generate meta từ nội dung Strapi |
| BL-10 | Sitemap | Tự động tạo sitemap.xml cho blog |

### 2.3 E-commerce (Medusa Core Features)

Medusa Next.js Starter Storefront cung cấp sẵn các tính năng thương mại điện tử cốt lõi:

| ID | Yêu cầu | Mô tả chi tiết |
|----|---------|----------------|
| EC-01 | Product Listing | Grid/List view, filter, sort, pagination |
| EC-02 | Product Detail | Gallery ảnh, variants (size, màu, option), mô tả |
| EC-03 | Shopping Cart | Thêm/sửa/xóa sản phẩm, áp dụng mã giảm giá |
| EC-04 | Checkout | Multi-step: thông tin → vận chuyển → thanh toán |
| EC-05 | Thanh toán | Tích hợp Stripe (payment provider) |
| EC-06 | Order Management | Xem lịch sử, trạng thái, chi tiết đơn hàng |
| EC-07 | Customer Account | Đăng ký, đăng nhập, quên mật khẩu, profile |
| EC-08 | Wishlist | Danh sách yêu thích (có sẵn trong Starter) |
| EC-09 | Product Reviews | Đánh giá sản phẩm (authenticated users) |
| EC-10 | Search | Tìm kiếm sản phẩm (Medusa search plugin) |
| EC-11 | Regions & Currencies | Hỗ trợ đa vùng, đa tiền tệ |

### 2.4 Tích hợp giữa Storefront với Strapi và Medusa

| ID | Yêu cầu | Mô tả chi tiết |
|----|---------|----------------|
| SI-01 | Kết nối đến Medusa | Storefront sử dụng Medusa JS Client hoặc fetch API với Publishable API Key |
| SI-02 | Kết nối đến Strapi | Storefront gọi Strapi REST API (hoặc GraphQL) để lấy content |
| SI-03 | Không đồng bộ | Strapi và Medusa **không trao đổi dữ liệu** với nhau |
| SI-04 | Tách biệt dữ liệu | Dữ liệu sản phẩm (Medusa) và nội dung (Strapi) độc lập, không phụ thuộc nhau |
| SI-05 | URL cấu hình | Biến môi trường cho MEDUSA_URL và STRAPI_URL riêng biệt |

### 2.5 Admin

| ID | Yêu cầu | Mô tả chi tiết |
|----|---------|----------------|
| AD-01 | Strapi Admin | Quản lý landing page, blog, media, SEO |
| AD-02 | Medusa Admin | Quản lý sản phẩm, inventory, đơn hàng, khách hàng, discount |
| AD-03 | User Management | Phân quyền riêng trong từng admin |
| AD-04 | Dashboard | Thống kê đơn hàng, doanh thu trong Medusa Admin |

---

## 3. YÊU CẦU KỸ THUẬT – CHI TIẾT

### 3.1 Kiến trúc tổng thể
┌─────────────────────────────────────────────────────────────────────────┐
│ MEDUSA NEXT.JS STARTER STOREFRONT │
│ ┌───────────────────┐ ┌───────────────┐ ┌──────────────────────┐ │
│ │ Landing Page │ │ Blog │ │ E-commerce Pages │ │
│ │ (gọi Strapi API) │ │ (Strapi API) │ │ (gọi Medusa API) │ │
│ └───────────────────┘ └───────────────┘ └──────────────────────┘ │
└────────────────────────────┬──────────────────────────────────────────┘
│
┌───────────────┴───────────────┐
│ HTTP / REST / GraphQL │
└───────────────┬───────────────┘
┌───────────────┴───────────────┐
│ │
▼ ▼
┌─────────────────────────┐ ┌───────────────────────────────────────┐
│ STRAPI v5 (CMS) │ │ MEDUSA (Commerce Engine) │
│ - Landing Page content │ │ - Products / Variants │
│ - Blog posts │ │ - Cart / Checkout │
│ - SEO metadata │ │ - Orders / Payments │
│ - Media assets │ │ - Inventory / Pricing │
│ - Categories/Tags │ │ - Customers / Auth │
│ - Admin UI (Content) │ │ - Discounts / Gift Cards │
└─────────────────────────┘ │ - Admin UI (Commerce) │
└───────────────────────────────────────┘
│ │
└───────────────┬───────────────┘
│
▼
┌─────────────────────────────┐
│ DATABASE LAYER │
│ PostgreSQL (riêng biệt) │
│ Redis (cho Medusa) │
└─────────────────────────────┘



### 3.2 Backend

| Component | Technology | Version |
|-----------|------------|---------|
| Medusa | Node.js | ≥ 2.8.0 |
| Strapi | Node.js | v5 (latest stable) |
| Database (Medusa) | PostgreSQL | ≥ 14 |
| Database (Strapi) | PostgreSQL | ≥ 14 (có thể cùng server nhưng khác DB) |
| Cache/Event (Medusa) | Redis | ≥ 7 |
| API | REST (Medusa) / REST + GraphQL (Strapi) | - |

### 3.3 Frontend – Medusa Next.js Starter Storefront

| ID | Yêu cầu | Mô tả chi tiết |
|----|---------|----------------|
| FE-01 | **Kiến trúc** | Sử dụng **Medusa Next.js Starter Storefront** làm frontend chính thức, được cài đặt trong monorepo cùng Medusa backend qua `create-medusa-app` |
| FE-02 | **Framework** | Next.js 15 với App Router |
| FE-03 | **Ngôn ngữ** | TypeScript toàn bộ |
| FE-04 | **Styling** | Sử dụng **Tailwind CSS** với **@medusajs/ui-preset** |
| FE-05 | **UI Components** | Sử dụng **@medusajs/ui** |
| FE-06 | **Icons** | Sử dụng **@medusajs/icons** |
| FE-07 | **Theme** | Themeable thông qua CSS variables |
| FE-08 | **Data Fetching** | TanStack Query + Server Components (Next.js) |
| FE-09 | **State Management** | Zustand (có sẵn trong Starter) |
| FE-10 | **Authentication** | JWT (Medusa Customer Auth) |
| FE-11 | **Publishable API Key** | Sử dụng publishable API key cho tất cả Medusa store requests |
| FE-12 | **Rendering Strategy** | Kết hợp SSG/ISR cho product pages, SSR cho cart/checkout |
| FE-13 | **Gọi Strapi** | Sử dụng `fetch` hoặc Strapi SDK để lấy content (landing, blog) |
| FE-14 | **Môi trường** | Có biến `NEXT_PUBLIC_MEDUSA_URL`, `NEXT_PUBLIC_STRAPI_URL`, `STRAPI_API_TOKEN` |

### 3.4 Medusa UI – Chi tiết packages

| Package | Mô tả | Cách dùng |
|---------|-------|-----------|
| `@medusajs/ui` | React components, hooks, utility functions | `import { Button, Badge, Table } from "@medusajs/ui"` |
| `@medusajs/ui-preset` | Tailwind CSS preset với design tokens | `presets: [require("@medusajs/ui-preset")]` |
| `@medusajs/icons` | Icon library | `import { MedusaLogo, Cart } from "@medusajs/icons"` |

### 3.5 DevOps

| Component | Technology |
|-----------|------------|
| Container | Docker + Docker Compose |
| Deployment | Medusa Cloud (Storefront) hoặc VPS |
| CI/CD | GitHub Actions |
| Monitoring | Sentry + LogRocket |
| Analytics | Google Analytics 4 |

---

## 4. CƠ SỞ DỮ LIỆU – SCHEMA CHÍNH

### 4.1 Strapi Content Types

**Blog Post**
```json
{
  "title": "string",
  "slug": "string (unique)",
  "excerpt": "text",
  "content": "richtext",
  "featured_image": "media",
  "categories": "relation[]",
  "tags": "relation[]",
  "author": "relation",
  "published_at": "datetime",
  "seo_title": "string",
  "seo_description": "text"
}

Landing Page Section

Media (quản lý ảnh, video)

4.2 Medusa Core Entities
Product – thông tin cơ bản, variants, options

ProductVariant – SKU, inventory, pricing

Order – đơn hàng, shipping, payment

Customer – thông tin khách hàng

Cart – giỏ hàng

Discount – mã giảm giá

Collection – bộ sưu tập

Category – danh mục sản phẩm

5. LUỒNG DỮ LIỆU CHÍNH
5.1 Hiển thị Landing Page và Blog
Content Manager tạo/sửa nội dung trong Strapi Admin.

Storefront gọi Strapi API để lấy dữ liệu landing page sections / blog posts.

Dữ liệu được render trên FE với Next.js (SSG/ISR).

(Không có sự tham gia của Medusa)

5.2 Hiển thị sản phẩm và mua hàng
Product Manager tạo/sửa sản phẩm trong Medusa Admin.

Storefront gọi Medusa Store API (với Publishable Key) để lấy danh sách sản phẩm, chi tiết, giỏ hàng, thanh toán, đơn hàng.

Tất cả logic thương mại do Medusa xử lý.

(Không có sự tham gia của Strapi)

5.3 Tương tác khách hàng
Khách hàng đăng ký/đăng nhập qua Medusa Customer API.

Xem lịch sử đơn hàng, quản lý profile qua Medusa API.

6. YÊU CẦU PHI CHỨC NĂNG
6.1 Performance
Tiêu chí	Ngưỡng
First Contentful Paint (FCP)	< 1.5s
Largest Contentful Paint (LCP)	< 2.5s
Time to Interactive (TTI)	< 3.5s
API Response Time (Medusa)	< 200ms
API Response Time (Strapi)	< 300ms
Concurrent Users	Hỗ trợ ≥ 10,000
6.2 Security
Yêu cầu	Mô tả
HTTPS	Toàn bộ hệ thống dùng TLS 1.3
JWT Authentication	Medusa customer auth
Publishable API Key	Cho tất cả Medusa store requests
Strapi API Token	Sử dụng token cho các request từ FE đến Strapi (nếu cần)
CORS	Cấu hình đúng domain cho phép
Rate Limiting	Giới hạn request API
Environment Variables	Tất cả secret lưu trong .env
6.3 Scalability
Medusa: Horizontal scaling với Redis, PostgreSQL.

Strapi: Scale với database replication, có thể dùng CDN cho media.

Storefront: Next.js với SSG/ISR + CDN caching.

6.4 Availability
Uptime: 99.9%

Backup: Database backup tự động hàng ngày cho cả hai hệ thống.

Disaster Recovery: RTO < 4 giờ.

7. YÊU CẦU VỀ UI/UX
7.1 Medusa Starter Storefront – Design System
Medusa Next.js Starter Storefront tích hợp sẵn Medusa UI design system:

Colors: Design tokens từ Medusa UI

Typography: Hệ thống typography từ Medusa UI

Components: Button, Input, Card, Modal, Toast, Skeleton, Table, Badge, Switch, Command

Responsive: Mobile-first, breakpoints chuẩn

7.2 Landing Page (tùy chỉnh trên Starter)
Hero: Full-width banner, CTA button nổi bật

Features: 3-4 feature cards với icon

Products: Product grid (Medusa components)

Testimonials: Carousel với avatar, tên, đánh giá

Newsletter: Form với email validation

Footer: Links, social icons, copyright

7.3 Blog (tích hợp vào Starter)
List: Grid layout, thumbnail, title, excerpt, date, author

Detail: Breadcrumb, featured image, content, author box, related posts

Sidebar: Search, categories, recent posts, tags

7.4 E-commerce (có sẵn trong Starter)
Product List: Grid/List toggle, filter sidebar, sort, pagination

Product Detail: Gallery (zoom), variant selector, quantity, add to cart

Cart: Mini cart (dropdown) + Cart page

Checkout: Progress indicator, form validation, order summary

Account: Dashboard, orders, wishlist, profile settings

8. YÊU CẦU VỀ SEO & MARKETING
Yêu cầu	Mô tả
Meta tags	Title, description, keywords từ Strapi
Open Graph	og:title, og:description, og:image
Twitter Cards	Twitter card tags
JSON-LD	Schema.org cho Product (từ Medusa), Article (từ Strapi), Breadcrumb
Sitemap	Tự động generate sitemap.xml cho blog và sản phẩm
Robots.txt	Cấu hình crawl
URL Structure	SEO-friendly: /products/{slug}, /blog/{slug}
Canonical	Thẻ canonical cho mỗi trang
Alt Text	Hình ảnh có alt text
Performance	Core Web Vitals đạt yêu cầu
9. YÊU CẦU VỀ LOCALIZATION (i18n)
Yêu cầu	Mô tả
Ngôn ngữ	Tiếng Việt (mặc định), Tiếng Anh
Content	Strapi hỗ trợ i18n
Currency	VND, USD (Medusa Regions)
Regions	Medusa Regions hỗ trợ đa quốc gia
URL	/vi/... , /en/...

10. KẾ HOẠCH TRIỂN KHAI
Phase 1: Foundation
Tạo Medusa project với create-medusa-app (bao gồm cả storefront)

Cấu hình PostgreSQL + Redis cho Medusa

Cài đặt Strapi v5 (cùng server hoặc riêng)

Cấu hình Strapi database (PostgreSQL)

Tạo Strapi content types: Blog Post, Landing Page Section, Media

Cấu hình environment variables cho cả hai hệ thống

Phase 2: Core Commerce
Chạy Medusa Next.js Starter Storefront và kiểm tra kết nối Medusa API

Cấu hình Publishable API Key

Kiểm tra product listing, detail, cart, checkout

Tích hợp thanh toán Stripe

Kiểm tra authentication (customer register/login)

Phase 3: Content Integration
Tích hợp Strapi content vào Storefront (landing page sections)

Tích hợp Blog (list, detail, categories, tags)

Gọi Strapi API từ Storefront

Strapi Admin training cho content team

Phase 4: Customization & Polish
Tùy chỉnh theme (CSS variables)

SEO optimization (meta tags, JSON-LD, sitemap)

Performance optimization (SSG/ISR strategy)

Testing (Unit, Integration, E2E)

Deployment (Medusa Cloud hoặc VPS)

Monitoring setup (Sentry)

11. RỦI RO & GIẢI PHÁP
Rủi ro	Giải pháp
Strapi API chậm	Cache response, sử dụng ISR
Medusa performance	Scale horizontally, Redis cache
FE gọi 2 API độc lập có thể gây chậm tải trang	Sử dụng parallel fetching, skeleton loading
Dữ liệu không đồng bộ giữa Medusa và Strapi (ví dụ: sản phẩm không có mô tả)	Không yêu cầu đồng bộ; mô tả sản phẩm có thể được quản lý riêng trong Medusa hoặc Strapi tuỳ nhu cầu
Security breach	Regular security audit, update dependencies
12. TÀI LIỆU THAM KHẢO
Tài liệu	Link
Medusa Next.js Starter Storefront	https://docs.medusajs.com/learn/storefront-development
Medusa UI Documentation	https://docs.medusajs.com/ui
Strapi v5 Documentation	https://docs.strapi.io/dev-docs/intro
Medusa Store API Reference	https://docs.medusajs.com/api/store
Strapi REST API	https://docs.strapi.io/dev-docs/api/rest
13. PHỤ LỤC: MEDUSA STARTER STOREFRONT – TÍNH NĂNG CÓ SẴN
Tính năng	Trạng thái
Product listing + pagination	✅ Có sẵn
Product detail + variants	✅ Có sẵn
Shopping cart	✅ Có sẵn
Checkout (multi-step)	✅ Có sẵn
Payment (Stripe)	✅ Có sẵn
Customer authentication	✅ Có sẵn
Order history	✅ Có sẵn
Wishlist	✅ Có sẵn
Regions & currencies	✅ Có sẵn
Responsive design	✅ Có sẵn
Tailwind CSS + Medusa UI	✅ Có sẵn
TypeScript	✅ Có sẵn
📌 TÓM TẮT QUYẾT ĐỊNH KỸ THUẬT QUAN TRỌNG
Quyết định	Lý do
Dùng Medusa Next.js Starter Storefront thay vì build FE từ scratch	Tiết kiệm 60-70% thời gian phát triển, có sẵn tất cả tính năng commerce core, được Medusa maintain và update thường xuyên
Dùng @medusajs/ui + @medusajs/ui-preset	Design system chính thức, consistency với Medusa ecosystem, dễ dàng theme
Tách biệt Strapi và Medusa, không sync	Đơn giản hóa kiến trúc, giảm dependency, dễ bảo trì, mỗi hệ thống chuyên biệt cho từng mục đích
Deploy trên Medusa Cloud hoặc VPS	Linh hoạt, hỗ trợ storefront và backend cùng lúc
📄 Tài liệu này là SRS chính thức của dự án, phản ánh đúng yêu cầu độc lập giữa Strapi và Medusa.

Ngày tạo: 2026-07-11
Phiên bản: 3.0 – Tách biệt hoàn toàn Strapi và Medusa, không đồng bộ