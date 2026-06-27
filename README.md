# Thăng Long Chè Việt - Hệ thống (Nuxt 3 + Laravel)

Đây là mã nguồn dự án Thăng Long Chè Việt. Hệ thống được chia thành:
- **Frontend (`apps/web`)**: Ứng dụng Nuxt 3 (Storefront).
- **Backend (`be`)**: Ứng dụng Laravel 11 + LunarPHP (API & Admin).

Dự án được cấu hình chạy hoàn toàn bằng **Docker** để đảm bảo tính đồng nhất về môi trường.

---

## 🚀 1. Khởi tạo dự án lần đầu (Initial Setup)

Khi bạn vừa clone source code về máy lần đầu tiên, hãy thực hiện các bước sau để khởi động dự án:

### Bước 1: Khởi động các container Docker
Bật Docker Desktop lên và chạy lệnh ở thư mục gốc của dự án:
```bash
docker compose up -d
```

### Bước 2: Chạy script khởi tạo hệ thống trong container
Để tự động tạo cấu hình môi trường `.env`, cài đặt các thư viện PHP, tạo cơ sở dữ liệu mẫu và cấu hình ứng dụng, hãy chạy lệnh sau:
```bash
docker compose exec app sh docker-init.sh
```

---

## 💻 2. Khởi động làm việc hằng ngày

Khi đã thiết lập dự án thành công lần đầu tiên, những ngày sau đó bạn chỉ cần khởi động hệ thống qua lệnh Docker cơ bản:

**Bật hệ thống (chạy ngầm):**
```bash
docker compose up -d
```

**Tắt hệ thống:**
```bash
docker compose stop
```

---

## 🛠 3. Thông tin truy cập (Sau khi chạy)

Sau khi khởi động thành công, các dịch vụ sẽ khả dụng tại:

- **🌍 Giao diện Frontend (Nuxt):** [http://localhost:3000](http://localhost:3000)
- **🔌 Backend API:** [http://localhost:8000](http://localhost:8000)
- **📚 API Document (Swagger):** [http://localhost:8000/api/documentation](http://localhost:8000/api/documentation)
- **📧 Hộp thư test (Mailpit):** [http://localhost:8025](http://localhost:8025)

> **Tài khoản quản trị (Admin Panel):**
> 
> Truy cập vào: [http://localhost:8000/admin](http://localhost:8000/admin)
> - **Email**: `admin@thanglongcheviet.vn`
> - **Mật khẩu**: `admin@123`

---

## 📖 4. Cài đặt thêm thư viện (Composer, NPM)

Bởi vì chúng ta chạy tất cả bên trong Docker, nếu bạn muốn cài đặt thư viện (`composer`, `npm`), hay chạy lệnh `php artisan`, bạn cần chạy xuyên qua container thay vì cài đặt trực tiếp PHP hay Node lên máy cá nhân.

### Tác vụ Backend (PHP / Laravel)
Container xử lý Backend có tên là `app`.

```bash
# Cài đặt thư viện mới (ví dụ)
docker compose exec app composer require "tên-thư-viện"

# Chạy lệnh artisan (Tạo controller, migration,...)
docker compose exec app php artisan make:controller UserController

# Chui thẳng vào bên trong Terminal của Backend
docker compose exec app bash
```

### Tác vụ Frontend (Node / Nuxt)
Container xử lý Frontend có tên là `web`.

```bash
# Cài thêm thư viện frontend
docker compose exec web npm install "tên-thư-viện"
```

---

## ⚡ 5. Dọn dẹp Bộ nhớ đệm (Clear Cache)

PHP và Laravel lưu trữ bộ đệm (config, routes, views) ở nhiều lớp khác nhau và có thể gây ra lỗi logic nếu cấu hình thay đổi mà không được xóa. Để dọn dẹp bộ nhớ đệm sạch sẽ, hãy sử dụng các lệnh sau:

### Dọn dẹp toàn bộ cache của Laravel
Lệnh tổng hợp dọn dẹp cấu hình, route, view, event cache:
```bash
docker compose exec app php artisan optimize:clear
```

### Các lệnh dọn dẹp riêng lẻ (Khi cần thiết)
Nếu bạn chỉ muốn xóa một loại cache cụ thể:
* **Xóa cache cấu hình (Configuration):**
  ```bash
  docker compose exec app php artisan config:clear
  ```
* **Xóa cache định tuyến (Routes):**
  ```bash
  docker compose exec app php artisan route:clear
  ```
* **Xóa cache giao diện (Compiled Views):**
  ```bash
  docker compose exec app php artisan view:clear
  ```
* **Xóa cache ứng dụng (Application Cache):**
  ```bash
  docker compose exec app php artisan cache:clear
  ```
* **Xóa cache sự kiện (Events):**
  ```bash
  docker compose exec app php artisan event:clear
  ```
* **Xóa các file dịch mã nguồn biên dịch trước (Compiled classes):**
  ```bash
  docker compose exec app php artisan clear-compiled
  ```

### Xóa sạch cache Redis (nếu cần)
Nếu hệ thống sử dụng Redis làm cache driver và bạn muốn xoá sạch các key đã lưu:
```bash
docker compose exec redis redis-cli flushall
```

