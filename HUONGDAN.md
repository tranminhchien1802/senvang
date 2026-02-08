# Hướng Dẫn Cài Đặt Môi Trường Dự Án Kế Toán Sen Vàng

## Yêu Cầu Hệ Thống

- **Node.js** phiên bản 18.0 hoặc mới hơn
- **npm** hoặc **yarn** (npm được khuyến nghị)
- **Git** để clone repository

## Bước 1: Clone Repository

```bash
git clone [URL_REPOSITORY]
cd websenvang
```

## Bước 2: Cài Đặt Package

Chạy lệnh sau để cài đặt các package cần thiết:

```bash
npm install
```

Lệnh này sẽ cài đặt tất cả các dependencies được liệt kê trong `package.json`.

## Bước 3: Cấu Hình Biến Môi Trường

Tạo file `.env` trong thư mục gốc của dự án với nội dung sau:

```env
# EmailJS Configuration
VITE_REACT_APP_EMAILJS_PUBLIC_KEY=your_emailjs_public_key_here
VITE_REACT_APP_SERVICE_ID=your_service_id_here
VITE_REACT_APP_TEMPLATE_ID=your_template_id_here

# Google OAuth Client ID
# Update this with your actual Google OAuth client ID
VITE_REACT_APP_GOOGLE_CLIENT_ID=937635642814-9h3k7st6fojq02qvaicof52tqng6he97.apps.googleusercontent.com
```

**Lưu ý:** Thay thế các giá trị `your_..._here` bằng thông tin thực tế từ tài khoản EmailJS của bạn.

## Bước 4: Chạy Ứng Dụng

### Chạy Ở Môi Trường Phát Triển

Để chạy ứng dụng ở môi trường phát triển, sử dụng lệnh:

```bash
npm run dev
```

Sau đó mở trình duyệt và truy cập: `http://localhost:5173`

### Build Ứng Dụng Cho Sản Phẩm

Để tạo bản build sản phẩm, chạy lệnh:

```bash
npm run build
```

### Preview Bản Build

Để kiểm tra bản build trước khi deploy:

```bash
npm run preview
```

## Bước 5: Cấu Hình Google OAuth (Tùy Chọn)

Nếu bạn muốn sử dụng tính năng đăng nhập bằng Google:

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Kích hoạt Google+ API
4. Tạo "OAuth 2.0 Client IDs"
5. Thêm vào phần "Authorized JavaScript origins":
   - `http://localhost:5173` (cho môi trường phát triển)
   - Domain sản phẩm nếu có
6. Cập nhật `VITE_REACT_APP_GOOGLE_CLIENT_ID` trong file `.env`

## Bước 6: Cấu Hình EmailJS

1. Truy cập [EmailJS](https://www.emailjs.com/)
2. Tạo tài khoản và đăng nhập
3. Kết nối với dịch vụ email (Gmail, Outlook, v.v.)
4. Tạo template email mới với các biến:
   - `{{from_name}}` - Tên người gửi
   - `{{phone}}` - Số điện thoại
   - `{{email}}` - Email người gửi
   - `{{service_package}}` - Gói dịch vụ
   - `{{message}}` - Nội dung tin nhắn
5. Cập nhật thông tin trong file `.env`

## Chạy Backend (Nếu Có)

Nếu ứng dụng sử dụng backend Node.js (port 5000 như trong mã nguồn), bạn cần:

1. Tạo thư mục backend riêng (nếu chưa có)
2. Cài đặt Express và các middleware cần thiết
3. Chạy server backend riêng biệt trên cổng 5000

## Các Lỗi Thường Gặp và Cách Khắc Phục

### 1. Lỗi CORS khi gọi API backend
- Đảm bảo backend đang chạy trên cổng 5000
- Kiểm tra cấu hình CORS trong backend

### 2. Lỗi Google Sign-In
- Kiểm tra domain trong Google Cloud Console
- Đảm bảo client ID được cấu hình chính xác trong `.env`

### 3. Lỗi EmailJS
- Kiểm tra các biến môi trường
- Đảm bảo template ID chính xác
- Xác nhận service đã được kết nối

### 4. Lỗi không load được font-awesome
- Kiểm tra kết nối internet
- Thử sử dụng CDN thay thế

## Các Tính Năng Chính

1. **Trang chủ** - Giới thiệu dịch vụ
2. **Dịch vụ** - Danh sách các gói dịch vụ
3. **Dịch vụ khác** - Các dịch vụ hỗ trợ khác
4. **Giới thiệu** - Giới thiệu công ty
5. **Liên hệ** - Form liên hệ và thông tin liên hệ
6. **Đăng nhập/Đăng ký** - Hệ thống xác thực người dùng
7. **Admin Dashboard** - Quản lý đơn hàng, người dùng, dịch vụ

## Tài Khoản Admin

- Email 1: `chien180203@gmail.com`
- Email 2: `ketoansenvang.net@gmail.com`
- Mật khẩu: `123`

## Công Nghệ Sử Dụng

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Form**: React Hook Form
- **Charts**: Recharts
- **Icons**: Lucide React
- **Authentication**: Google OAuth, Local Authentication
- **Email**: EmailJS

## Phím Tắt Trong Môi Trường Phát Triển

- `r` - Khởi động lại server
- `u` - Hiển thị URL
- `b` - Mở trong trình duyệt
- `o` - Mở trong file explorer
- `q` - Thoát

## Ghi Chú

- Ứng dụng sử dụng localStorage để lưu trữ dữ liệu tạm thời
- Một số tính năng yêu cầu kết nối internet
- Backend hiện tại chỉ tồn tại dưới dạng cấu trúc trong mã nguồn

## Hỗ Trợ

Nếu gặp sự cố trong quá trình cài đặt, vui lòng:

1. Kiểm tra lại các bước trong hướng dẫn
2. Đảm bảo các yêu cầu hệ thống đã được đáp ứng
3. Kiểm tra phiên bản Node.js và npm
4. Liên hệ với đội ngũ phát triển nếu vẫn gặp sự cố