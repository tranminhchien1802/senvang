# Hướng Dẫn Deploy Nhanh

## 1. Deploy lên Vercel (Frontend)

### Cài đặt Vercel CLI:
```bash
npm install -g vercel
```

### Login vào Vercel:
```bash
vercel login
```

### Deploy:
```bash
vercel --prod
```

### Cấu hình Environment Variables trên Vercel Dashboard:
- `MONGODB_URI`: Connection string cho MongoDB
- `SESSION_SECRET`: Secret cho session
- `JWT_SECRET`: Secret cho JWT
- `GOOGLE_CLIENT_ID`: Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth Client Secret
- `EMAIL_USER`: Email để gửi thông báo
- `EMAIL_PASS`: App Password cho email
- `EMAIL_HOST`: Host SMTP (mặc định: smtp.gmail.com)
- `EMAIL_PORT`: Port SMTP (mặc định: 587)
- `CLIENT_URL`: URL của frontend (VD: https://your-app.vercel.app)

## 2. Deploy Backend lên Google Cloud Run

### Cài đặt Google Cloud SDK:
Tải và cài đặt từ: https://cloud.google.com/sdk/docs/install

### Login:
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### Build và deploy:
```bash
# Build image
docker build -f Dockerfile.backend -t gcr.io/YOUR_PROJECT_ID/senvang-backend .

# Push image
docker push gcr.io/YOUR_PROJECT_ID/senvang-backend

# Deploy
gcloud run deploy senvang-backend \
  --image gcr.io/YOUR_PROJECT_ID/senvang-backend \
  --platform managed \
  --region us-central1 \
  --port 5000 \
  --set-env-vars MONGODB_URI="your_mongodb_uri",SESSION_SECRET="your_session_secret",JWT_SECRET="your_jwt_secret",EMAIL_USER="your_email",EMAIL_PASS="your_app_password",CLIENT_URL="https://your-frontend-url.vercel.app" \
  --allow-unauthenticated
```

## 3. Cấu hình Frontend để gọi Backend

Nếu bạn deploy backend riêng biệt, thêm biến môi trường sau vào Vercel:

```env
VITE_API_URL=https://your-backend-url.com
```

## 4. Deploy cả 2 cùng lúc

Bạn có thể deploy cả frontend và backend cùng lúc bằng cách:

1. Deploy backend lên Cloud Run/Render/Railway
2. Copy URL backend
3. Thêm vào Vercel Environment Variables như `VITE_API_URL`
4. Deploy frontend lên Vercel

## 5. Kiểm tra sau deploy

Sau khi deploy, kiểm tra:

1. ✅ Trang chủ tải đúng
2. ✅ Form đặt dịch vụ hoạt động
3. ✅ Xác thực Google OAuth hoạt động
4. ✅ Gửi email xác nhận hoạt động
5. ✅ Quản lý đơn hàng hoạt động (nếu có quyền admin)

## 6. Troubleshooting

### Nếu form đặt dịch vụ không hoạt động:
- Kiểm tra xem `api/orders/create.js` có được deploy không
- Kiểm tra logs trên Vercel dashboard

### Nếu email không gửi được:
- Kiểm tra lại `EMAIL_PASS` có phải là App Password không
- Kiểm tra xem tài khoản Gmail có bật 2FA chưa

### Nếu Google OAuth không hoạt động:
- Kiểm tra lại `GOOGLE_CLIENT_ID` có đúng không
- Kiểm tra lại Authorized JavaScript origins và Redirect URIs trên Google Console