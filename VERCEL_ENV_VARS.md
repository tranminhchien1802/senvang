# Cấu hình Environment Variables trên Vercel

## Vấn đề gặp phải
Lỗi 500 FUNCTION_INVOCATION_FAILED xảy ra vì Vercel serverless function không tìm thấy environment variables.

## Cách khắc phục

### 1. Truy cập Vercel Dashboard
1. Vào https://vercel.com/dashboard
2. Chọn project của bạn

### 2. Thêm Environment Variables
Vào Settings → Environment Variables → Add New Variable

Thêm các biến sau cho **Production**:

```
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/senvang
JWT_SECRET=your_jwt_secret_here
SESSION_SECRET=your_session_secret_here
NODE_ENV=production
```

### 3. Nếu dùng Google OAuth, thêm:
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 4. Nếu dùng Email, thêm:
```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

### 5. Redeploy
Sau khi thêm environment variables:
1. Vào Deployments
2. Click vào deployment mới nhất
3. Click "Redeploy" (hoặc push commit mới)

## Kiểm tra
Sau khi deploy xong:
1. Mở Vercel deployment logs
2. Tìm log "✅ MongoDB connected" và "✅ All routes loaded successfully"
3. Thử login lại

## Lưu ý quan trọng
- Environment variables phải được set cho **Production** environment
- Không commit file .env lên Git
- JWT_SECRET nên là chuỗi ngẫu nhiên dài (ít nhất 32 ký tự)
- MONGODB_URI phải là connection string hợp lệ của MongoDB Atlas
