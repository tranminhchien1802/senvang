# Hướng Dẫn Deploy Lên Vercel Với Google OAuth

## Tổng Quan
Hướng dẫn này sẽ giúp bạn deploy ứng dụng lên Vercel và cấu hình Google OAuth để hoạt động chính xác, tránh lỗi "origin_mismatch".

## Bước 1: Cấu Hình Google Cloud Console

### 1.1 Tạo hoặc chọn project
- Truy cập [Google Cloud Console](https://console.cloud.google.com/)
- Chọn project hiện có hoặc tạo project mới

### 1.2 Kích hoạt Google+ API
- Trong menu bên trái, chọn "APIs & Services" > "Library"
- Tìm kiếm "Google People API" và kích hoạt nó

### 1.3 Thiết lập OAuth consent screen
- Trong menu bên trái, chọn "APIs & Services" > "OAuth consent screen"
- Chọn "External" và nhấn "Create"
- Điền các thông tin bắt buộc:
  - App name: "Sen Vang Website"
  - User support email: email của bạn
  - Developer contact information: email của bạn
- Trong "Scopes", thêm quyền truy cập nếu cần
- Trong "Test users", thêm email bạn sẽ dùng để test
- Submit để hoàn tất

### 1.4 Tạo OAuth 2.0 Client ID
- Trong menu bên trái, chọn "APIs & Services" > "Credentials"
- Nhấp "Create Credentials" > "OAuth 2.0 Client IDs"
- Chọn "Web application" làm Application type
- Đặt tên cho Client (ví dụ: "Sen Vang Production")
- Trong "Authorized JavaScript origins", thêm:
  - `http://localhost:5173` (cho môi trường phát triển)
  - `http://localhost:4173` (cổng Vite khác nếu cần)
  - `https://your-project-name.vercel.app` (domain Vercel của bạn)
  - `https://www.your-project-name.vercel.app` (nếu có www)
  - `https://your-custom-domain.com` (nếu bạn có domain riêng)
- Trong "Authorized redirect URIs", thêm:
  - `http://localhost:5173` (cho phát triển)
  - `https://your-project-name.vercel.app` (cho production)
  - `https://your-custom-domain.com` (nếu có)
- Nhấp "Create" và lưu lại Client ID và Client Secret

## Bước 2: Cấu Hình Biến Môi Trường Trên Vercel

### 2.1 Truy cập Vercel Dashboard
- Truy cập [Vercel Dashboard](https://vercel.com/dashboard)
- Chọn project của bạn

### 2.2 Thêm biến môi trường
- Vào Settings > Environment Variables
- Thêm các biến sau:
  - `VITE_GOOGLE_CLIENT_ID`: Client ID từ Google Cloud Console
  - `GOOGLE_CLIENT_ID`: Giống với VITE_GOOGLE_CLIENT_ID
  - `GOOGLE_CLIENT_SECRET`: Client Secret từ Google Cloud Console
  - `JWT_SECRET`: Chuỗi bí mật để ký JWT (tạo ngẫu nhiên)
  - `EMAIL_USER`: Địa chỉ email dùng để gửi thông báo
  - `EMAIL_PASS`: Mật khẩu ứng dụng email (App Password)
  - `MONGODB_URI`: Connection string cho MongoDB (nếu dùng)

## Bước 3: Cập Nhật Mã Nguồn

### 3.1 Cập nhật file .env.example
File .env.example đã được cập nhật để phản ánh đúng cấu hình OAuth.

### 3.2 Cập nhật GoogleLoginButton
Component GoogleLoginButton đã được cập nhật để sử dụng backend API thay vì chỉ xử lý phía client.

### 3.3 Cập nhật App.jsx
File App.jsx đã được cập nhật để loại bỏ Client ID mẫu và sử dụng biến môi trường chính xác.

## Bước 4: Cấu Hình API Routes Cho Vercel

Ứng dụng đã được cấu hình với các API routes sau trong thư mục `/api`:

- `/api/health.js`: Health check endpoint
- `/api/auth/google.js`: Redirect đến Google OAuth
- `/api/auth/callback.js`: Xử lý callback từ Google
- `/api/auth/verify.js`: Xác minh token Google trên backend
- `/api/user/me.js`: Lấy thông tin người dùng hiện tại

## Bước 5: Deploy Lên Vercel

### 5.1 Sử dụng Git Integration (khuyến nghị)
1. Push code lên repository GitHub/GitLab/Bitbucket
2. Trong Vercel Dashboard, chọn "Add New Project"
3. Import repository của bạn
4. Vercel sẽ tự động phát hiện và cấu hình dự án React/Vite
5. Thêm các biến môi trường như trong Bước 2
6. Nhấp "Deploy"

### 5.2 Deploy bằng CLI
1. Cài đặt Vercel CLI: `npm i -g vercel`
2. Đăng nhập: `vercel login`
3. Deploy: `vercel --prod` (cho production) hoặc `vercel` (cho preview)

## Bước 6: Kiểm Tra Sau Khi Deploy

### 6.1 Kiểm tra domain
- Truy cập domain Vercel của bạn (ví dụ: `https://your-project-name.vercel.app`)
- Mở DevTools và kiểm tra tab Console để xem lỗi

### 6.2 Kiểm tra Google OAuth
- Thử đăng nhập bằng Google
- Nếu gặp lỗi, kiểm tra:
  - Domain đã được thêm vào Google Cloud Console chưa
  - Biến môi trường đã được cấu hình đúng trên Vercel chưa
  - API routes có hoạt động không (kiểm tra `/api/health`)

## Gỡ Rối Thường Gặp

### Lỗi "origin_mismatch"
- Kiểm tra lại các "Authorized JavaScript origins" trong Google Cloud Console
- Đảm bảo domain bạn đang truy cập khớp chính xác với những domain được đăng ký

### Lỗi "redirect_uri_mismatch"
- Kiểm tra lại các "Authorized redirect URIs" trong Google Cloud Console
- Đảm bảo callback URL khớp với những URL được đăng ký

### Google Login không hoạt động
- Kiểm tra console browser để xem lỗi cụ thể
- Đảm bảo biến môi trường `VITE_GOOGLE_CLIENT_ID` đã được thiết lập
- Kiểm tra API route `/api/auth/verify` có trả về kết quả không

## Bảo Mật

- Không bao giờ commit Client Secret vào repository
- Luôn sử dụng biến môi trường cho các giá trị nhạy cảm
- Kiểm tra định kỳ các authorized origins và revoke những cái không còn sử dụng
- Sử dụng HTTPS cho tất cả các môi trường production