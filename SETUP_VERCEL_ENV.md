# 🚨 HƯỚNG DẪN CẤU HÌNH VERCEL - SỬA LỖI 500

## 🔴 Lỗi đang gặp phải
```
Server configuration error
Thiếu cấu hình MongoDB. Vui lòng kiểm tra MONGODB_URI trong environment variables.
```

## ✅ CÁCH SỬA (Làm theo từng bước)

### Bước 1: Truy cập Vercel Dashboard
1. Mở: https://vercel.com/dashboard
2. Click vào project của bạn (tên: `senvang`)

### Bước 2: Vào Settings → Environment Variables
1. Click tab **Settings** ở menu bên trái
2. Click **Environment Variables**
3. Click nút **Add New Variable**

### Bước 3: Thêm các biến môi trường sau

#### 1. MONGODB_URI (Bắt buộc)
```
Name: MONGODB_URI
Value: mongodb+srv://your_username:your_password@cluster.mongodb.net/senvang
Environment: Production (✓)
```

**Lấy MongoDB URI từ MongoDB Atlas:**
1. Vào https://cloud.mongodb.com/
2. Click "Connect" ở cluster của bạn
3. Chọn "Connect your application"
4. Copy connection string
5. Thay `<password>` bằng mật khẩu thực tế

#### 2. JWT_SECRET (Bắt buộc)
```
Name: JWT_SECRET
Value: senvang_jwt_secret_key_2025_super_secure_random_string_xyz123
Environment: Production (✓)
```

#### 3. SESSION_SECRET (Bắt buộc)
```
Name: SESSION_SECRET
Value: senvang_session_secret_2025_another_secure_random_string_abc456
Environment: Production (✓)
```

#### 4. NODE_ENV (Khuyến nghị)
```
Name: NODE_ENV
Value: production
Environment: Production (✓)
```

### Bước 4: Redeploy
Sau khi thêm xong tất cả variables:

1. Vào tab **Deployments**
2. Click vào deployment mới nhất (có commit message gần đây)
3. Click vào dấu **...** (3 chấm) ở góc phải
4. Chọn **Redeploy**
5. Click **Redeploy** để xác nhận

HOẶC:
- Push một commit mới lên GitHub (Vercel sẽ tự động deploy)

### Bước 5: Kiểm tra
1. Chờ deployment hoàn tất (2-3 phút)
2. Click **Visit** để mở website
3. Thử login admin với email và mật khẩu

## 📝 Kiểm tra Logs (Nếu vẫn lỗi)

1. Vào Vercel Dashboard → Project của bạn
2. Tab **Deployments**
3. Click vào deployment mới nhất
4. Tab **Functions** hoặc **Logs**
5. Tìm log có nội dung:
   - `=== ADMIN LOGIN FUNCTION INVOKED ===`
   - `MONGODB_URI: SET` hoặc `NOT SET`

Nếu thấy `NOT SET` → Environment variables chưa được lưu. Thử add lại.

## 🎯 Checklist

- [ ] MONGODB_URI đã được thêm vào Vercel
- [ ] JWT_SECRET đã được thêm vào Vercel
- [ ] SESSION_SECRET đã được thêm vào Vercel
- [ ] Tất cả variables đều chọn "Production"
- [ ] Đã redeploy sau khi thêm variables
- [ ] Deployment thành công (màu xanh lá)

## 📞 Vẫn lỗi?

Nếu vẫn gặp lỗi sau khi làm theo các bước trên:

1. Chụp màn hình lỗi từ browser console (F12)
2. Chụp màn hình Vercel logs
3. Gửi cho quản trị viên để kiểm tra

---

**Lưu ý quan trọng:**
- KHÔNG commit file .env lên Git
- KHÔNG share MONGODB_URI và secrets cho người khác
- Password trong MONGODB_URI phải là mật khẩu thực tế của MongoDB Atlas
