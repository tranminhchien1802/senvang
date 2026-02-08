# Hướng Dẫn Deploy Backend Lên Hosting

## 1. Cấu Hình Biến Môi Trường

Trước khi deploy, bạn cần thiết lập các biến môi trường trên hosting:

### Các biến cần thiết:
- `PORT`: Hosting sẽ cung cấp cổng, nếu không có thì dùng 5000
- `MONGODB_URI`: Đường dẫn kết nối đến MongoDB Atlas hoặc dịch vụ MongoDB khác
- `JWT_SECRET`: Chuỗi bí mật cho JWT
- `SESSION_SECRET`: Chuỗi bí mật cho session
- `GOOGLE_CLIENT_ID`: Client ID từ Google Console
- `GOOGLE_CLIENT_SECRET`: Client Secret từ Google Console
- `GOOGLE_CALLBACK_URL`: URL callback khi deploy (ví dụ: https://yourdomain.com/api/auth/google/callback)
- `CLIENT_URL`: URL frontend sau khi deploy (ví dụ: https://yourdomain.com)

## 2. Cấu Hình MongoDB

Bạn cần sử dụng MongoDB Atlas hoặc dịch vụ MongoDB khác thay vì `localhost`:

1. Tạo tài khoản tại [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Tạo cluster mới
3. Thêm IP whitelist (hoặc mở cho phép tất cả IP)
4. Tạo user và password
5. Copy connection string vào biến `MONGODB_URI`

## 3. Cập Nhật Google OAuth

Khi deploy, bạn cần cập nhật lại các URL trong Google Console:
- Authorized JavaScript origins: `https://yourdomain.com`
- Authorized redirect URIs: `https://yourdomain.com/api/auth/google/callback`

## 4. Package.json

Đảm bảo file package.json có script start:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

## 5. Deploy Lên Google Cloud Platform (App Engine)

### Bước 1: Cài đặt Google Cloud SDK
Tải và cài đặt từ: https://cloud.google.com/sdk/docs/install

### Bước 2: Khởi tạo dự án
```bash
gcloud init
gcloud config set project YOUR_PROJECT_ID
```

### Bước 3: Tạo file app.yaml
```yaml
runtime: nodejs18
env: standard

automatic_scaling:
  min_instances: 0
  max_instances: 10

env_variables:
  PORT: 8080
  MONGODB_URI: your_mongodb_connection_string
  JWT_SECRET: your_jwt_secret
  SESSION_SECRET: your_session_secret
  GOOGLE_CLIENT_ID: your_google_client_id
  GOOGLE_CLIENT_SECRET: your_google_client_secret
  GOOGLE_CALLBACK_URL: https://your-project-id.appspot.com/api/auth/google/callback
  CLIENT_URL: https://your-project-id.appspot.com
```

### Bước 4: Deploy
```bash
gcloud app deploy
```

## 6. Deploy Lên Dịch Vụ Khác (Vercel, Render, Heroku, v.v.)

### Với Render.com:
1. Tạo tài khoản tại https://render.com
2. Tạo Web Service mới
3. Kết nối với repo GitHub
4. Cấu hình:
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables: Thêm các biến như trên

### Với Heroku:
1. Cài đặt Heroku CLI
2. Đăng nhập: `heroku login`
3. Tạo app: `heroku create your-app-name`
4. Thêm config vars: `heroku config:set MONGODB_URI=your_uri`
5. Deploy: `git push heroku main`

## 7. Lưu Ý Quan Trọng

- Port 5173 là port của frontend (Vite), không phải backend
- Backend sẽ chạy trên port do hosting cung cấp (thường là 8080, 3000, hoặc 5000)
- Không bao giờ commit file .env lên GitHub
- Sử dụng MongoDB Atlas hoặc dịch vụ cloud thay vì localhost
- Cập nhật lại URL callback sau khi deploy

## 8. Kiểm Tra Sau Khi Deploy

Sau khi deploy, kiểm tra:
1. Backend chạy tại: `https://yourdomain.com/` (phải trả về "Backend hoạt động!")
2. Kết nối MongoDB: Xem log để đảm bảo không có lỗi kết nối
3. API hoạt động: Thử gọi các endpoint API
4. Google OAuth: Kiểm tra đăng nhập Google có hoạt động không

## 9. Debug Nếu Có Vấn Đề

Nếu backend vẫn không chạy:
1. Kiểm tra log của hosting để xem lỗi cụ thể
2. Đảm bảo biến môi trường được thiết lập đúng
3. Kiểm tra quyền truy cập MongoDB
4. Xác nhận URL callback đã được cập nhật đúng