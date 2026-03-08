# 🚀 HƯỚNG DẪN CẤU HÌNH VERCEL SERVERLESS - XONG TRONG 5 PHÚT

## ✅ Code đã sẵn sàng! Chỉ cần làm 2 việc:

---

## 📋 BƯỚC 1: Lấy MongoDB URI (2 phút)

### 1.1. Vào MongoDB Atlas
- Mở: https://cloud.mongodb.com/
- Đăng nhập

### 1.2. Kết nối
1. Click **"Connect"** ở cluster của bạn
2. Chọn **"Connect your application"**
3. Copy connection string

### 1.3. Connection string có dạng:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 1.4. Thay thế thông tin:
- `<username>` → Username MongoDB của bạn
- `<password>` → Password MongoDB của bạn
- Thêm database name: `/senvang` trước `?`

**Ví dụ HOÀN CHỈNH:**
```
mongodb+srv://myadmin:MyPass123@cluster0.abc123.mongodb.net/senvang?retryWrites=true&w=majority
```

### ⚠️ Nếu quên password:
1. Vào **Database Access** (menu trái)
2. Edit user hoặc tạo user mới
3. Copy password mới

---

## 📋 BƯỚC 2: Thêm Environment Variables vào Vercel (2 phút)

### 2.1. Vào Vercel Dashboard
- Mở: https://vercel.com/dashboard
- Click vào project `senvang` của bạn

### 2.2. Vào Settings
- Tab **Settings** (menu trái)
- Chọn **Environment Variables**

### 2.3. Thêm 3 variables sau (cho Production):

#### Variable 1: MONGODB_URI
```
Name: MONGODB_URI
Value: mongodb+srv://myadmin:MyPass123@cluster0.abc123.mongodb.net/senvang?retryWrites=true&w=majority
Environment: Production ✓
```

#### Variable 2: JWT_SECRET
```
Name: JWT_SECRET
Value: senvang_jwt_super_secret_key_2025_xyz_abc_123
Environment: Production ✓
```

#### Variable 3: SESSION_SECRET
```
Name: SESSION_SECRET
Value: senvang_session_secret_2025_abc_xyz
Environment: Production ✓
```

### 2.4. Save
- Click **Save** sau khi thêm mỗi variable

---

## 📋 BƯỚC 3: Redeploy (1 phút)

### Cách 1: Redeploy từ Vercel Dashboard
1. Vào **Deployments** tab
2. Click vào deployment mới nhất
3. Click dấu **...** (góc phải)
4. Chọn **Redeploy**
5. Click **Redeploy** để xác nhận

### Cách 2: Push commit mới (tự động deploy)
```bash
git pull origin main
git add .
git commit -m "trigger redeploy"
git push origin main
```

---

## ✅ BƯỚC 4: Kiểm tra

### 4.1. Chờ deploy xong
- Vercel sẽ deploy trong 2-3 phút
- Khi thấy ✅ màu xanh → Thành công

### 4.2. Test login admin
1. Mở website: https://senvang-lzmb.vercel.app
2. Vào trang admin login
3. Nhập email và mật khẩu admin
4. Click Login

### 4.3. Nếu login thành công:
- ✅ Thấy dashboard admin
- ✅ Token được lưu vào localStorage

### 4.4. Nếu vẫn lỗi:
1. Mở Console (F12)
2. Xem lỗi gì
3. Vào Vercel → Deployments → Click deployment → **Function Logs**
4. Tìm log: `=== ADMIN LOGIN FUNCTION INVOKED ===`
5. Check xem `MONGODB_URI: SET` hay `NOT SET`

---

## 🎯 TÓM TẮT NHANH

1. **MongoDB Atlas** → Lấy connection string
2. **Vercel Dashboard** → Settings → Environment Variables
3. Thêm 3 variables: `MONGODB_URI`, `JWT_SECRET`, `SESSION_SECRET`
4. **Redeploy**
5. **Test login**

---

## 📞 CẦN TRỢ GIÚP?

Nếu gặp vấn đề, gửi cho tôi:
1. Screenshot lỗi từ browser console (F12)
2. Screenshot Vercel Function Logs
3. Screenshot Environment Variables trên Vercel (che giá trị)

---

## 🔥 MẸO NHANH

### Nếu chưa có MongoDB Atlas account:
1. https://cloud.mongodb.com/ → Sign up (miễn phí)
2. Tạo cluster mới (FREE tier M0)
3. Tạo Database User
4. Lấy connection string
5. Làm tiếp các bước trên

### JWT_SECRET và SESSION_SECRET:
- Có thể dùng bất kỳ chuỗi nào dài > 32 ký tự
- Ví dụ: `senvang_2025_super_secret_random_string_xyz_123_abc`

---

**XONG! Chỉ vậy thôi!** 🎉

Sau khi cấu hình xong, admin login sẽ hoạt động hoàn hảo!
