# Hướng Dẫn Deploy Toàn Diện

## 1. Deploy lên Vercel (Frontend + Vercel Functions)

### Cấu hình trên Vercel Dashboard:

1. Truy cập [Vercel](https://vercel.com/)
2. Import project từ GitHub
3. Cấu hình Environment Variables:

```
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
CLIENT_URL=https://your-project-name.vercel.app
```

4. Cấu hình Build Settings:
   - Framework Preset: `Other`
   - Build Command: `npm run vercel-build`
   - Output Directory: `dist`
   - Root Directory: `.`

## 2. Deploy Backend lên Google Cloud Run

### Yêu cầu:
- Cài đặt Google Cloud SDK
- Đã đăng nhập: `gcloud auth login`
- Đã thiết lập project: `gcloud config set project PROJECT_ID`

### Các bước:

1. Build Docker image:
```bash
docker build -f Dockerfile.backend -t gcr.io/PROJECT_ID/senvang-backend .
```

2. Push image lên Google Container Registry:
```bash
docker push gcr.io/PROJECT_ID/senvang-backend
```

3. Deploy lên Cloud Run:
```bash
gcloud run deploy senvang-backend \
  --image gcr.io/PROJECT_ID/senvang-backend \
  --platform managed \
  --region us-central1 \
  --port 5000 \
  --set-env-vars MONGODB_URI="your_mongodb_uri",SESSION_SECRET="your_session_secret",JWT_SECRET="your_jwt_secret",EMAIL_USER="your_email",EMAIL_PASS="your_app_password",CLIENT_URL="https://your-frontend-url.vercel.app" \
  --allow-unauthenticated
```

4. Cập nhật API_BASE_URL trong frontend để trỏ đến backend trên Cloud Run:
```env
VITE_API_URL=https://senvang-backend-xyz-uc.a.run.app
```

## 3. Deploy Backend lên Railway

### Các bước:

1. Truy cập [Railway](https://railway.app/)
2. Tạo project mới
3. Connect với GitHub repo
4. Thêm các biến môi trường:
   - MONGODB_URI
   - SESSION_SECRET
   - JWT_SECRET
   - EMAIL_USER
   - EMAIL_PASS
   - CLIENT_URL
5. Deploy

## 4. Deploy Backend lên Render

### Các bước:

1. Truy cập [Render](https://render.com/)
2. Tạo Web Service mới
3. Connect với GitHub repo
4. Cấu hình:
   - Runtime: Node
   - Build Command: `cd my-backend && npm install`
   - Start Command: `cd my-backend && npm start`
5. Thêm Environment Variables
6. Deploy

## 5. Cấu hình cho cả 3 môi trường (Demo, Production, Local)

### Frontend sẽ tự động chọn API URL như sau:

1. Nếu trên browser (client-side):
   - Nếu có `VITE_API_URL` trong môi trường: sử dụng giá trị đó
   - Nếu không: sử dụng đường dẫn tương đối `/api` (hoạt động trên Vercel)

2. Nếu trên server-side (SSR):
   - Sử dụng `process.env.API_URL` hoặc mặc định `http://localhost:5000`

### Điều này đảm bảo:
- Trên Vercel: `/api/orders/create` sẽ gọi đến Vercel Functions
- Trên local với backend chạy: có thể cấu hình gọi đến `http://localhost:5000`
- Trên local với Vercel CLI: có thể giả lập Vercel Functions

## 6. Cấu hình CORS và Security Headers

Tất cả các cấu hình này đã được thiết lập trong `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization, x-auth-token"
        },
        {
          "key": "Cross-Origin-Opener-Policy",
          "value": "same-origin"
        },
        {
          "key": "Cross-Origin-Embedder-Policy",
          "value": "require-corp"
        }
      ]
    }
  ]
}
```

## 7. Testing sau deploy

Sau khi deploy, kiểm tra:

1. Trang chủ tải đúng
2. Form đặt dịch vụ hoạt động
3. Xác thực Google OAuth hoạt động
4. Gửi email xác nhận hoạt động
5. Quản lý đơn hàng hoạt động (nếu có quyền admin)

## 8. Troubleshooting

### Nếu gặp lỗi CORS:
- Kiểm tra lại cấu hình trong `vercel.json`
- Đảm bảo backend trả về đúng headers

### Nếu gặp lỗi API:
- Kiểm tra xem Vercel Functions có được deploy đúng không
- Kiểm tra logs trên Vercel dashboard

### Nếu gặp lỗi email:
- Kiểm tra lại cấu hình SMTP
- Đảm bảo `EMAIL_PASS` là App Password, không phải mật khẩu thường