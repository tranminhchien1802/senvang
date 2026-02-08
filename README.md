# Kế Toán Sen Vàng - Website

Website dịch vụ kế toán chuyên nghiệp với các tính năng:

- Đăng ký dịch vụ trực tuyến
- Quản lý đơn hàng
- Xác thực người dùng bằng Google OAuth
- Gửi email xác nhận đơn hàng

## Cài đặt và chạy

### Phát triển (Development)

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy frontend:
```bash
npm run dev
```

3. Chạy backend (trong thư mục riêng):
```bash
cd my-backend
npm run dev
```

### Chạy cả frontend và backend cùng lúc:
```bash
npm run dev:fullstack
```

## Deploy

### 1. Deploy lên Vercel (Frontend + Vercel Functions)

1. Cài đặt Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel --prod
```

### 2. Deploy lên GitHub Pages

1. Cài đặt gh-pages:
```bash
npm install -g gh-pages
```

2. Deploy:
```bash
npm run deploy:gh-pages
```

### 3. Deploy bằng Docker

#### Frontend:
```bash
npm run docker:build-frontend
npm run docker:run-frontend
```

#### Backend:
```bash
npm run docker:build-backend
npm run docker:run-backend
```

### 4. Deploy lên Google Cloud Run (Backend)

1. Build image:
```bash
docker build -f Dockerfile.backend -t gcr.io/YOUR_PROJECT_ID/senvang-backend .
```

2. Push image:
```bash
docker push gcr.io/YOUR_PROJECT_ID/senvang-backend
```

3. Deploy:
```bash
gcloud run deploy senvang-backend \
  --image gcr.io/YOUR_PROJECT_ID/senvang-backend \
  --platform managed \
  --region YOUR_REGION \
  --allow-unauthenticated
```

## Cấu hình môi trường

### Frontend (.env)
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_REACT_APP_EMAILJS_PUBLIC_KEY=your_emailjs_public_key_here
VITE_REACT_APP_SERVICE_ID=your_service_id_here
VITE_REACT_APP_TEMPLATE_ID=your_template_id_here
VITE_BASE_URL=http://localhost:5173
```

### Backend (.env trong thư mục my-backend)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/senvang
PORT=5000
SESSION_SECRET=your_session_secret_here
JWT_SECRET=your_jwt_secret_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
CLIENT_URL=http://localhost:5173
```

## Cấu trúc dự án

```
.
├── api/                    # Vercel Functions (API routes)
│   ├── auth/
│   ├── user/
│   ├── orders/            # API cho đơn hàng
│   └── health.js
├── src/                   # Frontend source code
│   ├── components/
│   ├── pages/
│   ├── utils/
│   └── config/
├── my-backend/            # Backend source code
│   ├── config/
│   ├── models/
│   ├── routers/
│   └── server.js
├── public/
└── ...
```

## Các tính năng chính

- Đặt dịch vụ trực tuyến
- Xác thực người dùng bằng Google OAuth
- Quản lý đơn hàng
- Gửi email xác nhận tự động
- Responsive design
- Hỗ trợ đa ngôn ngữ (sắp có)

## Công nghệ sử dụng

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express, MongoDB
- Deployment: Vercel (frontend), Google Cloud Run (backend)
- Authentication: Google OAuth
- Email: Nodemailer
- Container: Docker