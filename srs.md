# 📋 SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
## DỰ ÁN: THƯƠNG MẠI ĐIỆN TỬ HEADLESS – STRAPI + MEDUSA (ĐỘC LẬP)
## SỬ DỤNG MEDUSA NEXT.JS STARTER STOREFRONT LÀM FRONTEND

---

## 1. GIỚI THIỆU

### 1.1 Mục đích
Tài liệu này mô tả chi tiết các yêu cầu cho một nền tảng thương mại điện tử hiện đại, sử dụng kiến trúc **headless** đạt chuẩn vận hành môi trường Production với:

- **Medusa v2**: Headless commerce engine xử lý toàn bộ logic bán hàng, đơn hàng, sản phẩm, inventory, khách hàng, và các module custom như `campaign-posts`.
- **Strapi v5**: Headless CMS quản lý nội dung linh hoạt (landing page, blog, bài viết, SEO, marketing content, media).
- **Medusa Next.js Starter Storefront**: Frontend chính thức, được xây dựng với Next.js 15 App Router, cung cấp tính năng thương mại điện tử hiện đại và hiển thị dữ liệu từ cả Medusa & Strapi.
- **Nginx API Gateway**: Điều hướng traffic tới các services nội bộ thông qua Docker network.

**Lưu ý quan trọng**: Medusa và Strapi hoạt động **độc lập, không đồng bộ dữ liệu với nhau**. Storefront gọi API từ từng hệ thống riêng biệt, đảm bảo Separation of Concerns (SoC).

### 1.2 Phạm vi
Dự án bao gồm:
- **Landing Page & Cấu trúc tĩnh**: Với các section động (Hero, Feature, Testimonial, CTA) – dữ liệu từ Strapi.
- **Blog (Strapi)**: Đa danh mục, hỗ trợ bài viết chuyên sâu về SEO – dữ liệu từ Strapi (`/vn/blog`).
- **Campaign Posts (Medusa)**: Bài viết chiến dịch được quản lý bởi module custom trong Medusa (`/vn/campaign-posts`).
- **Cửa hàng trực tuyến**: Đầy đủ tính năng E-commerce (product listing, cart, checkout, account) – dữ liệu và logic từ Medusa.
- **Quản trị hệ thống**: Strapi Admin cho nội dung, Medusa Admin cho thương mại điện tử.
- **Tích hợp vận hành (Production)**: Tracking, Cổng thanh toán nội địa, Đối tác giao hàng nội địa, CDN, Giám sát lỗi (Monitoring).

### 1.3 Đối tượng sử dụng
| Vai trò | Mô tả |
|---------|-------|
| **Khách hàng (Guest)** | Xem sản phẩm, blog, landing page, chiến dịch |
| **Khách hàng (Registered)** | Mua hàng, xem lịch sử đơn hàng, quản lý profile |
| **Content Manager** | Quản lý bài blog, landing page, SEO, media trong Strapi CMS |
| **Store Manager** | Quản lý sản phẩm, tồn kho, đơn hàng, campaign posts trong Medusa Admin |
| **System Admin** | Quản lý toàn bộ hệ thống hạ tầng (Docker, Nginx, Database, CI/CD, Monitoring) |

---

## 2. YÊU CẦU CHỨC NĂNG

### 2.1 Landing Page
| ID | Yêu cầu | Mô tả chi tiết |
|----|---------|----------------|
| LP-01 | Hero Section | Slider/banner với CTA, nội dung quản lý từ Strapi |
| LP-02 | Feature Showcase | Giới thiệu tính năng nổi bật, content từ Strapi |
| LP-03 | Product Grid | Hiển thị sản phẩm nổi bật, lấy dữ liệu từ Medusa API |
| LP-04 | Testimonial | Đánh giá khách hàng, quản lý từ Strapi |
| LP-05 | Newsletter Signup | Form đăng ký nhận tin, tích hợp email service (Mailchimp/SendGrid) |
| LP-06 | SEO Meta | Title, Description, Open Graph quản lý từ Strapi |
| LP-07 | Responsive | Tương thích mobile, tablet, desktop (Mobile-first) |

### 2.2 Quản trị Nội dung (Strapi CMS & Medusa Custom Modules)
| ID | Yêu cầu | Mô tả chi tiết |
|----|---------|----------------|
| BL-01 | Strapi Blog List | Lấy danh sách bài viết từ Strapi v5 API (cấu trúc JSON phẳng) |
| BL-02 | Strapi Blog Detail| Chi tiết bài viết Blog (Rich text, hình ảnh) |
| BL-03 | CMS Workflow | Hỗ trợ luồng kiểm duyệt (Draft, Review, Published) cho Content Team |
| CP-01 | Campaign Posts | Quản trị các chiến dịch, bài viết đặc biệt thông qua Medusa Custom Module |
| MD-01 | Quản lý Media (S3) | Tích hợp AWS S3 hoặc Cloudinary để lưu trữ và tối ưu hoá hình ảnh CDN |
| SE-01 | Dynamic Redirects | Quản lý các URL Redirects (301, 302) linh hoạt từ CMS để tránh lỗi 404 |
| SE-02 | SEO & Sitemap | Tự động tạo SEO metadata, Sitemap.xml tích hợp nội dung từ cả 2 nguồn |

### 2.3 E-commerce (Medusa Core Features & Tích hợp Mở rộng)
| ID | Yêu cầu | Mô tả chi tiết |
|----|---------|----------------|
| EC-01 | Product Listing | Grid/List view, filter, sort, pagination, search nhanh (MeiliSearch/Algolia) |
| EC-02 | Product Detail | Gallery ảnh, variants (size, màu, option), mô tả chi tiết |
| EC-03 | Shopping Cart | Thêm/sửa/xóa sản phẩm, áp dụng mã giảm giá, tính phí vận chuyển động |
| EC-04 | Checkout | Multi-step an toàn: thông tin → vận chuyển → thanh toán |
| EC-05 | Thanh toán Quốc tế | Tích hợp Stripe / PayPal |
| EC-06 | Thanh toán Nội địa | Tích hợp VNPay, MoMo, ZaloPay, hoặc Chuyển khoản ngân hàng (Manual) |
| EC-07 | Vận chuyển Nội địa | Tích hợp Giao Hàng Nhanh (GHN), Giao Hàng Tiết Kiệm (GHTK), Viettel Post |
| EC-08 | Order Management | Quản lý chu trình đơn hàng (Fulfillment, Return, Refund) |
| EC-09 | Inventory & ERP | Đồng bộ tồn kho đa kênh (POS, ERP nội bộ) |
| EC-10 | Tracking & Analytics| Tích hợp Google Analytics 4 (GA4), Meta Pixel, Tiktok Pixel, Server-side tracking (CAPI) |
| EC-11 | Regions | Hỗ trợ đa quốc gia, đa tiền tệ (Region detection via Middleware Edge) |

### 2.4 Tích hợp Storefront (Strapi & Medusa)
| ID | Yêu cầu | Mô tả chi tiết |
|----|---------|----------------|
| SI-01 | Giao tiếp Backend | Next.js Server / Middleware kết nối Medusa qua Internal Docker Network (`MEDUSA_BACKEND_URL`) |
| SI-02 | Giao tiếp CMS | Kết nối Strapi v5 thông qua `STRAPI_API_URL` bằng Next.js ISR fetch wrapper |
| SI-03 | Kiến trúc Độc lập | Không đồng bộ hóa database. Storefront làm nhiệm vụ "ghép nối" UI. |
| SI-04 | Client & Server Env| Phân biệt môi trường Public URL (`NEXT_PUBLIC_*`) và Internal Docker URL. |

---

## 3. YÊU CẦU KỸ THUẬT – CHI TIẾT

### 3.1 Kiến trúc tổng thể

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLOUDFLARE (CDN / WAF)                            │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                       NGINX API GATEWAY (Reverse Proxy)                     │
│                        Routes: / -> Storefront:8000                         │
└──────┬───────────────────────────────┬──────────────────────────────┬───────┘
       │                               │                              │
       ▼                               ▼                              ▼
┌───────────────┐               ┌──────────────┐               ┌──────────────┐
│  STOREFRONT   │               │   BACKEND    │               │    STRAPI    │
│  (Next.js 15) │ <===========> │ (Medusa v2)  │               │ (Strapi v5)  │
│  Port: 8000   │ Internal Fetch│  Port: 9000  │               │  Port: 1337  │
└──────┬────────┘               └──────┬───────┘               └──────┬───────┘
       │                               │                              │
       │                               ▼                              ▼
       │                        ┌──────────────┐               ┌──────────────┐
       └────────────────────────┤ REDIS CACHE  │               │ POSTGRESQL   │
                                └──────┬───────┘               │ (medusa db)  │
                                       │                       │ (strapi db)  │
                                       └───────────────────────┴──────────────┘
```

### 3.2 Tech Stack

| Component | Technology | Version / Notes |
|-----------|------------|-----------------|
| E-commerce Engine | Medusa (Node.js) | v2.x |
| Content Management| Strapi | v5.x (Có fix postinstall module `sharp` cho ARM64) |
| Frontend Storefront| Next.js | v15.x App Router |
| Database | PostgreSQL | ≥ 14 (Chung server, khác database/schema) |
| Cache/Event | Redis | ≥ 7 |
| API Gateway | Nginx | Điều phối traffic & host header |
| Cloud/CDN | Cloudflare | WAF, Edge Caching, DNS |

### 3.3 Frontend – Next.js Storefront

| Yêu cầu | Mô tả chi tiết |
|---------|----------------|
| **Kiến trúc** | Cài đặt chung monorepo, giao tiếp Backend/CMS qua REST API |
| **Styling** | Tailwind CSS + `@medusajs/ui-preset` |
| **Routing & Middleware** | Route `/vn/blog`, `/vn/campaign-posts`. Middleware bắt Region dựa vào Header/Cookie (Xử lý `NEXT_PUBLIC_MEDUSA_BACKEND_URL` fallback sang internal URL). |
| **Data Fetching** | Fetch API caching (ISR) cho Strapi (`fetchStrapi`), SDK cho Medusa. Xử lý chuẩn xác cấu trúc JSON phẳng (Flat structure) của Strapi v5. |
| **Hydration Error Fix**| Xử lý Server Component ném lỗi 500 do sai Publishable Key bằng Error Boundaries (`global-error.tsx`). |

---

## 4. CƠ SỞ DỮ LIỆU – SCHEMA CHÍNH

### 4.1 Strapi Content Types
- **Article (Blog)**: `title` (string), `slug` (uid), `content` (richtext/blocks), `cover` (media), `seoDescription` (text). Phân quyền Public tự động khi bootstrap.
- **Category**: Danh mục bài viết blog.
- **Landing Page**: Các section linh hoạt lắp ghép trang chủ.

### 4.2 Medusa Core & Custom Entities
- **Core Commerce**: Product, ProductVariant, Order, Customer, Cart, Region, Currency.
- **Custom Module**: `Campaign Posts` - Chuyên quản lý bài viết chiến dịch khuyến mãi hoặc sự kiện.

---

## 5. LUỒNG DỮ LIỆU CHÍNH

### 5.1 Hiển thị Blog & Nội dung tĩnh (Strapi)
1. Content Manager tạo bài viết trong Strapi Admin.
2. Next.js Storefront Server Components gọi `fetchStrapi` truy xuất API port `1337` trong mạng Docker nội bộ.
3. Dữ liệu (JSON phẳng v5) được parse và render thành HTML qua cơ chế ISR/SSG của Next.js. Trả về Client.

### 5.2 Hiển thị Sản phẩm và Bán hàng (Medusa)
1. Store Manager quản lý hàng hóa trong Medusa Admin.
2. Khách hàng lướt web: Middleware Next.js kiểm tra Region cookie.
3. Server Components / Client fetch SDK gọi API port `9000` (Medusa Backend) sử dụng `Publishable API Key`.
4. Mọi logic giỏ hàng, thanh toán, auth đều do Medusa xử lý.

---

## 6. YÊU CẦU PHI CHỨC NĂNG (CHUẨN PRODUCTION)

### 6.1 Performance
| Tiêu chí | Ngưỡng | Giải pháp |
|----------|--------|-----------|
| First Contentful Paint (FCP) | < 1.5s | Next.js Server-Side Rendering (SSR), Cloudflare CDN |
| Largest Contentful Paint (LCP) | < 2.5s | Tối ưu ảnh (Next/Image), lazy-loading, Cloudinary/S3 S3 |
| Time to Interactive (TTI) | < 3.5s | Tối ưu bundle size Javascript |
| Internal Network Latency | < 5ms | Cấu hình Docker Internal Network, kết nối trực tiếp DB |

### 6.2 Security
| Yêu cầu | Mô tả |
|---------|-------|
| WAF & DDoS Protection | Sử dụng Cloudflare Proxy (Lớp bảo vệ viền) chống DDoS và các cuộc tấn công web. |
| Tách biệt môi trường | Cấu hình `.env` triệt để. Môi trường Server dùng Internal URL, Client dùng Public URL. |
| API Gateway | Nginx cấu hình Host Headers chuẩn (`proxy_set_header Host $http_host;`) chống lỗi CSRF/Server Actions của Next.js. |
| Access Control | Tách quyền quản trị viên Medusa và Strapi. Có cơ chế phân quyền (RBAC) chi tiết. |
| Rate Limiting | Hạn chế spam API ở cấp độ Nginx. |

### 6.3 DevOps, CI/CD & Giám sát (Monitoring)
| Yêu cầu | Mô tả |
|---------|-------|
| CI/CD Pipeline | Sử dụng GitHub Actions hoặc GitLab CI để tự động Build Docker Images và Deploy (Zero-downtime). |
| Error Tracking | Tích hợp Sentry vào cả Frontend và Backend để bắt lỗi Runtime và Crash. |
| Logging & Metrics | Thu thập log hệ thống (Datadog hoặc ELK Stack) và giám sát tải CPU/RAM của server. |
| Backup Strategy | Tự động Backup cơ sở dữ liệu PostgreSQL hàng ngày (Daily) lên Cloud Storage (S3). Cấu hình Point-In-Time Recovery (PITR). |
| Scaling | Hệ thống sẵn sàng mở rộng ngang (Horizontal Scaling) với Docker Swarm / Kubernetes khi lượng traffic tăng đột biến. |

---

## 7. YÊU CẦU VỀ UI/UX

### 7.1 Medusa Starter Storefront – Design System
- **Colors & Typography**: Sử dụng Design tokens từ `@medusajs/ui`.
- **Components**: Chuẩn hóa Button, Input, Modal, Table, Skeleton loading, v.v.
- **Responsive**: Mobile-first, hoạt động hoàn hảo trên mọi kích thước màn hình.

### 7.2 Blog & Campaign Posts (Tích hợp thêm)
- **Danh sách (List)**: Grid layout hiển thị thumbnail, title, excerpt.
- **Chi tiết (Detail)**: Render Rich Text (Strapi Blocks) hoặc HTML an toàn, Responsive Images.

---

## 8. SEO & MARKETING
| Yêu cầu | Mô tả |
|---------|-------|
| **Meta tags** | Tích hợp Title, description, keywords (Strapi SEO component). |
| **Structured Data** | JSON-LD schema cho Product (từ Medusa) và Article (từ Strapi). |
| **Sitemap** | Hỗ trợ sitemap.xml động map các pages từ cả Medusa & Strapi. |
| **URL Structure** | `/vn/products/[slug]`, `/vn/blog/[slug]`, `/vn/campaign-posts/[slug]`. Canonical URLs rõ ràng. |

---

## 9. LOCALIZATION (i18n) & REGIONS
| Yêu cầu | Mô tả |
|---------|-------|
| **Regions (Quốc gia/Vùng)** | Next.js Middleware check `x-vercel-ip-country`, cookie hoặc tham số URL (`/vn/`, `/en/`) để định tuyến Region đúng với Medusa. |
| **Đồng tiền (Currency)** | Auto-map với Region (VND, USD). |

---

## 10. KẾ HOẠCH TRIỂN KHAI THỰC TẾ

### Phase 1: Foundation (Đã hoàn thành)
- [x] Khởi tạo Medusa backend v2, Next.js Storefront.
- [x] Cài đặt Strapi v5, cấu hình Postgres schema `strapi`. Fix lỗi kiến trúc `sharp` ARM64.
- [x] Docker hóa toàn bộ hệ thống bằng `docker-compose.yml`. Định tuyến bằng Nginx.

### Phase 2: Core Commerce & CMS Integration (Đã hoàn thành)
- [x] Sửa lỗi Nginx Host Headers gây ra lỗi Next.js Server Actions (`Invalid Server Actions request`).
- [x] Tích hợp Strapi SDK / Fetch (xử lý Strapi v5 flat format) vào Storefront. Render thành công UI bài viết.
- [x] Fix cấu hình `NEXT_PUBLIC_MEDUSA_BACKEND_URL` và `MEDUSA_BACKEND_URL` trong Middleware tránh lỗi 500 khi server fetch SSR.
- [x] Fix lỗi Publishable API Key gây crash React Hydration.

### Phase 3: Hoàn thiện tính năng Giao dịch (Sắp tới)
- [ ] Render chi tiết trang chủ (Landing page sections) từ Strapi.
- [ ] Tích hợp hệ thống thanh toán nội địa (VNPay / MoMo) và đơn vị vận chuyển (GHN / GHTK).
- [ ] Tích hợp Elasticsearch / MeiliSearch cho tốc độ tìm kiếm sản phẩm.

### Phase 4: Production & Vận hành (Sắp tới)
- [ ] Thiết lập CI/CD Pipeline với GitHub Actions.
- [ ] Cấu hình Cloudflare WAF, Nginx Rate Limit và Sentry Monitoring.
- [ ] Thiết lập cronjob Backup Database.
- [ ] CI/CD Deployment lên Production VPS với `docker-compose.prod.yml`.

---

## 11. RỦI RO & GIẢI PHÁP
| Rủi ro | Giải pháp |
|--------|-----------|
| **SSR Fetch lỗi kết nối internal trong Docker** | Ưu tiên gọi API bằng `MEDUSA_BACKEND_URL` (IP nội bộ Docker) thay cho `NEXT_PUBLIC_...` khi chạy SSR/Middleware. |
| **Lỗi module ảnh Strapi (`sharp`) khi build Docker** | Gắn script `"postinstall": "npm install --os=linux --cpu=arm64 sharp"` vào package.json để ép cài đúng binary. |
| **Crash vòng lặp do thiếu Database Schema** | Tự động hoặc thủ công chạy script `CREATE SCHEMA IF NOT EXISTS strapi;` trên Postgres. |
| **Downtime trong lúc Deploy** | Sử dụng CI/CD Rolling Update, hoặc Blue/Green Deployment với Docker Swarm để không gián đoạn giao dịch. |

---

## 12. TÀI LIỆU THAM KHẢO
| Tài liệu | Link |
|----------|------|
| Medusa Next.js Starter | [https://docs.medusajs.com/learn/storefront-development](https://docs.medusajs.com/learn/storefront-development) |
| Strapi v5 Documentation | [https://docs.strapi.io/dev-docs/intro](https://docs.strapi.io/dev-docs/intro) |

---
**📄 Tài liệu này là SRS cập nhật của dự án, phản ánh đúng cấu trúc mã nguồn thực tế và nâng cấp tiêu chuẩn chuẩn bị cho việc Vận hành Production an toàn, hiệu quả.**

- **Ngày cập nhật:** 2026-07-11
- **Phiên bản:** 4.1 – Mở rộng tiêu chuẩn Production (Thanh toán nội địa, Vận chuyển, CI/CD, Bảo mật WAF, Giám sát hệ thống).