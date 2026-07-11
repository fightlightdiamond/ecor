# 📋 SRS: HỆ THỐNG LANDING PAGE BLOCKS DYNAMIC (STRAPI + NEXT.JS)
## MÔ-ĐUN: QUẢN TRỊ TRANG ĐÍCH VÀ CẤU TRÚC BLOCK ĐỘNG

---

## 1. GIỚI THIỆU
Tài liệu này định nghĩa cấu trúc, cách thức hoạt động và phương pháp tái sử dụng các **Blocks (Thành phần giao diện)** để xây dựng Landing Page động trên hệ thống kết hợp giữa Strapi v5 (CMS) và Next.js 15 (Storefront). 

Mục tiêu là trao quyền cho Content/Marketing Team có thể **tự do kéo thả, sắp xếp và tái sử dụng** các block để tạo ra hàng trăm Landing Page, trang sự kiện, trang khuyến mãi đa dạng mà không cần can thiệp vào Source Code.

---

## 2. PHƯƠNG PHÁP VẬN HÀNH (DYNAMIC ZONE ARCHITECTURE)

### 2.1 Kiến trúc Strapi (Backend)
- **Cấu trúc dữ liệu**: Sử dụng tính năng **Dynamic Zones** và **Components** của Strapi v5.
- **Collection Type `Page`**:
  - `title` (String): Tên trang nội bộ.
  - `slug` (UID): Đường dẫn trang (vd: `/khuyen-mai-thang-7`).
  - `seo` (Component): Meta title, description, OG Image.
  - `blocks` (Dynamic Zone): Cho phép admin chọn và thêm nhiều Components khác nhau.
- **Tính linh hoạt**: Các Components có thể được kéo thả để thay đổi thứ tự. Admin có thể thêm một block nhiều lần trên cùng một trang (Ví dụ: 2 block Hero ở trên và dưới).

### 2.2 Kiến trúc Next.js (Frontend)
- **Block Renderer Pattern**: Next.js sẽ nhận mảng JSON từ trường `blocks` của Strapi. Dựa vào trường định danh `__component` (VD: `page-blocks.hero`), React sẽ map tới Component giao diện tương ứng thông qua một hàm Switch-Case.
- **Giao tiếp Medusa**: Một số Block (VD: Product Grid) không chứa trực tiếp dữ liệu sản phẩm trong Strapi, mà chỉ chứa `collection_handle` hoặc `tags`. Frontend Next.js sẽ đọc thông số này và gọi API sang Medusa Backend để lấy danh sách sản phẩm theo thời gian thực.

---

## 3. CHI TIẾT CÁC BLOCKS CẤU THÀNH (COMPONENT LIBRARY)

Dưới đây là danh sách các Block (Thành phần) tiêu chuẩn cần được tạo trong Strapi và code tương ứng trên Next.js.

### 3.1. Hero Banner Block (`page-blocks.hero`)
- **Mục đích**: Thu hút sự chú ý ngay từ màn hình đầu tiên (Above the fold).
- **Trường dữ liệu (Strapi)**:
  - `heading` (String): Tiêu đề chính.
  - `subheading` (Text): Tiêu đề phụ/Mô tả.
  - `background_image` (Media): Ảnh hoặc Video nền.
  - `cta_buttons` (Repeatable Component): Danh sách nút bấm (Gồm `label`, `url`, `style`: primary/outline).
  - `alignment` (Enum): Căn chỉnh nội dung (Left, Center, Right).
- **Giao diện/Vận hành**: Ảnh nền tràn viền (Full-width). Chữ nằm đè lên nền (có overlay mờ để dễ đọc). Nút bấm chuyển hướng người dùng đến trang mua sắm.

### 3.2. Feature / USP Block (`page-blocks.feature-list`)
- **Mục đích**: Làm nổi bật điểm bán hàng độc nhất (Unique Selling Points - USP) của thương hiệu.
- **Trường dữ liệu (Strapi)**:
  - `section_title` (String): Tiêu đề cụm (VD: "Tại sao chọn chúng tôi?").
  - `features` (Repeatable Component - Max 4):
    - `icon` (Media hoặc Enum icon name).
    - `title` (String): Tên tính năng (VD: "Giao hàng hỏa tốc").
    - `description` (Text): Mô tả ngắn.
- **Giao diện/Vận hành**: Hiển thị dưới dạng Grid 3 hoặc 4 cột trên Desktop. Cuộn ngang hoặc rớt dòng thành 1 cột trên Mobile.

### 3.3. Dynamic Product Grid (`page-blocks.product-grid`)
- **Mục đích**: Trưng bày danh sách sản phẩm lấy tự động từ Medusa.
- **Trường dữ liệu (Strapi)**:
  - `heading` (String): Tiêu đề (VD: "Sản phẩm bán chạy").
  - `medusa_collection_handle` (String): Handle của Collection trong Medusa (VD: `tra-thuong-hang`).
  - `limit` (Number): Số lượng hiển thị (VD: 4, 8, 12).
  - `layout` (Enum): Slider (Vuốt ngang) hoặc Grid (Dạng lưới).
- **Giao diện/Vận hành**: **Tuyệt đối không lưu sản phẩm trong Strapi**. Khi Next.js render block này, nó lấy `medusa_collection_handle` và gọi API sang Medusa lấy thông tin giá, ảnh, variant để render thẻ sản phẩm (Product Card) có nút "Thêm vào giỏ".

### 3.4. Testimonials Block (`page-blocks.testimonials`)
- **Mục đích**: Xây dựng lòng tin thông qua đánh giá của khách hàng.
- **Trường dữ liệu (Strapi)**:
  - `heading` (String): VD: "Khách hàng nói gì về chúng tôi".
  - `reviews` (Repeatable Component):
    - `avatar` (Media): Ảnh khách hàng.
    - `name` (String): Tên.
    - `role` (String): Chức vụ / Nghề nghiệp.
    - `content` (Text): Lời đánh giá.
    - `rating` (Number): 1 - 5 sao.
- **Giao diện/Vận hành**: Hiển thị dạng Carousel (Slider). Tự động chạy (Auto-play) sau mỗi 5 giây.

### 3.5. Call To Action Banner (`page-blocks.cta-banner`)
- **Mục đích**: Thúc đẩy chuyển đổi (Thường đặt ở cuối trang).
- **Trường dữ liệu (Strapi)**:
  - `title` (String): Lời kêu gọi.
  - `description` (Text): Diễn giải thêm.
  - `button_label` (String): Tên nút.
  - `button_link` (String): Link đích.
  - `background_color` (Color picker / Enum): Màu nền của banner.
- **Giao diện/Vận hành**: Một dải màu khối nổi bật (Solid background color) bao trọn chiều rộng trang, tập trung sự chú ý vào nút bấm duy nhất.

### 3.6. FAQ Accordion (`page-blocks.faq`)
- **Mục đích**: Giải đáp nhanh các câu hỏi thường gặp.
- **Trường dữ liệu (Strapi)**:
  - `title` (String): Tiêu đề mục.
  - `questions` (Repeatable Component):
    - `question` (String): Câu hỏi.
    - `answer` (Rich text): Trả lời (có thể chèn link/in đậm).
- **Giao diện/Vận hành**: Hiển thị dạng Accordion (Đóng/Mở). Chỉ mở 1 câu trả lời tại một thời điểm để tiết kiệm diện tích cuộn màn hình.

### 3.7. Rich Text Block (`page-blocks.rich-text`)
- **Mục đích**: Chèn nội dung văn bản tự do, bảng biểu, chính sách, hoặc bài PR.
- **Trường dữ liệu (Strapi)**:
  - `content` (Rich text / Markdown): Khung soạn thảo đầy đủ tính năng.
  - `container_width` (Enum): `Narrow` (Dễ đọc), `Full` (Tràn viền).
- **Giao diện/Vận hành**: Render HTML chuẩn xác nhờ hệ thống CSS Typography (Prose của Tailwind).

---

## 4. QUY TRÌNH KÉO THẢ VÀ RE-USE ĐỂ TẠO TRANG

### 4.1 Tạo một Landing Page Sự Kiện (Ví dụ: Black Friday)
Thay vì phải code một trang riêng biệt, Marketer chỉ cần vào Strapi thực hiện:
1. Tạo một `Page` mới, slug là `black-friday-2026`.
2. Thêm **Hero Banner Block**: Up ảnh ngập tràn màu đen, chữ "Sale sốc 50% toàn bộ chè", nút bấm "Mua ngay".
3. Thêm **Dynamic Product Grid Block**: Nhập collection handle là `black-friday-sale` (Đã được tạo sẵn giá giảm bên Medusa Admin).
4. Thêm **Feature Block**: Thêm 3 icon "Freeship", "Quà tặng kèm", "Đổi trả 7 ngày".
5. Kéo thả để đổi vị trí: Di chuyển Feature Block lên trên Product Grid bằng thao tác kéo chuột trong giao diện Strapi Admin.
6. **Lưu & Publish**: URL `domain.com/black-friday-2026` lập tức có hiệu lực, Next.js tự động fetch mảng Blocks và render đúng thứ tự.

### 4.2 Tái sử dụng (Re-use)
- Một `Testimonial Block` được soạn sẵn cho Landing Page chính có thể được sao chép và chèn lại vào cuối bài viết Blog (nếu cấu hình Blog cũng sử dụng Dynamic Zone).
- Bố cục trang chủ (Homepage) hoàn toàn có thể được quản trị viên thay đổi giao diện theo từng mùa (Mùa Tết đưa Banner Tết lên đầu, Mùa Trung thu đưa Grid Bánh Trung thu lên đầu) chỉ bằng việc kéo thả Dynamic Zone mà không tốn 1 phút lập trình nào.

---

## 5. YÊU CẦU KỸ THUẬT KHI TRIỂN KHAI

1. **Flat JSON Format**: API Strapi v5 trả về định dạng mảng đơn giản. Next.js cần parse chính xác `__component` key.
2. **Component Mapping**: Next.js phải xây dựng một hệ thống `BlockManager.tsx` nhận mảng blocks và map tới từng React component cụ thể (`<Hero />`, `<Faq />`, v.v.).
3. **Lazy Loading**: Đối với các trang quá dài có nhiều blocks, Next.js cần áp dụng cơ chế Lazy Load (Next/dynamic) cho các block nằm dưới màn hình đầu tiên (Below the fold) để giữ LCP < 2.5s.
4. **Fallback Handling**: Nếu admin nhập sai Collection Handle của Medusa trong block Product Grid, block đó phải tự render trạng thái Empty hoặc Ẩn đi, KHÔNG ĐƯỢC làm sập toàn bộ trang (sử dụng Error Boundary).

---
**📄 Tài liệu SRS Mở rộng: Thiết kế Hệ thống Dynamic Blocks**
- Mở ra khả năng Scale hệ thống vô hạn về mặt Content Marketing, giúp hệ thống Headless thực sự phát huy sức mạnh linh hoạt của nó.
