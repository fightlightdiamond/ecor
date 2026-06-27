# Thăng Long Chè Việt - Hệ thống (Nuxt 3 + Laravel)

Đây là mã nguồn dự án Thăng Long Chè Việt. Hệ thống được chia thành:
- **Frontend (`apps/web`)**: Ứng dụng Nuxt 3 (Storefront).
- **Backend (`be`)**: Ứng dụng Laravel 11 + LunarPHP (API & Admin).

Dự án được cấu hình chạy hoàn toàn bằng **Docker** để đảm bảo tính đồng nhất về môi trường.

---

## 🚀 1. Khởi tạo dự án lần đầu (Initial Setup)

Khi bạn vừa clone source code về máy lần đầu tiên, hãy chạy file kịch bản cài đặt tự động. File này sẽ tự động tạo cấu hình, tải các thư viện cần thiết, cài đặt Database và khởi động toàn bộ ứng dụng.

### Đối với Mac / Linux:
Mở Terminal, di chuyển vào thư mục dự án và gõ:
```bash
./init.sh
```

### Đối với Windows:
Bạn chỉ cần mở thư mục mã nguồn và **nhấp đúp chuột (Double click)** vào file:
- `init.bat`

*(Hoặc mở Command Prompt / PowerShell, di chuyển vào thư mục dự án và gõ `.\init.bat`)*

---

## 💻 2. Khởi động làm việc hằng ngày

Khi bạn đã setup lần đầu xong, những ngày sau đó bạn không cần chạy lại script nữa. Chỉ cần khởi động hệ thống qua lệnh Docker cơ bản:

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

- **🌍 Frontend (Nuxt):** [http://localhost:3000](http://localhost:3000)
- **🔌 Backend API:** [http://localhost:8000](http://localhost:8000)
- **📚 API Document (Swagger):** [http://localhost:8000/api/documentation](http://localhost:8000/api/documentation)
- **📧 Test Email (Mailpit):** [http://localhost:8025](http://localhost:8025)

> **Tài khoản quản trị (Admin Panel):**
> 
> Truy cập vào: [http://localhost:8000/admin](http://localhost:8000/admin) (hoặc đường dẫn đăng nhập backend của bạn)
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

## 📝 5. Hướng dẫn chạy hoàn toàn thủ công (Thay thế script)
Trong trường hợp bạn không muốn dùng script khởi tạo tự động, bạn có thể tự tay chạy từng bước dưới đây (áp dụng cả Mac và Windows):

**1. Chuẩn bị file cấu hình (.env)**
Đầu tiên bạn phải tạo 2 file `.env` từ file mẫu:

```bash
# Trên Mac/Linux:
cp .env.example .env
cp be/.env.example be/.env

# Trên Windows (CMD/PowerShell):
copy .env.example .env
copy be\.env.example be\.env
```
*(Lưu ý cực kỳ quan trọng: Sau khi copy xong, hãy mở file `be/.env` bằng trình soạn thảo và sửa các dòng kết nối Database thành: `DB_CONNECTION=mysql`, `DB_HOST=db`, `DB_PORT=3306`, `DB_DATABASE=laravel`, `DB_USERNAME=laravel`, `DB_PASSWORD=secret`, `REDIS_HOST=redis`)*

**2. Bật Docker**
```bash
docker compose up -d
```

**3. Khởi tạo Backend (Chạy lần lượt)**
```bash
docker compose exec app composer install
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate:fresh --seed
docker compose exec app php artisan storage:link
```
