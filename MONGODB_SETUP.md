# 🚨 HƯỚNG DẪN LẤY MONGODB URI ĐÚNG

## ❌ Lỗi hiện tại
```
querySrv ENOTFOUND _mongodb._tcp.cluster.mongodb.net
```

**Nguyên nhân:** Bạn đang dùng MongoDB URI mẫu (`cluster.mongodb.net`) thay vì URI thật của bạn.

---

## ✅ CÁCH LẤY MONGODB URI THẬT TỪ MONGODB ATLAS

### Bước 1: Truy cập MongoDB Atlas
1. Mở: https://cloud.mongodb.com/
2. Đăng nhập bằng tài khoản của bạn

### Bước 2: Kết nối tới Cluster
1. Click nút **"Connect"** ở cluster của bạn
   - Nếu không thấy cluster nào → Bạn cần tạo cluster mới

### Bước 3: Chọn phương thức kết nối
1. Chọn **"Connect your application"**
2. Chọn driver: **Node.js** (version 4.0 or later)

### Bước 4: Copy Connection String
Bạn sẽ thấy connection string dạng:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Bước 5: Thay thế thông tin thực tế

**Ví dụ:**
- Username: `myadmin`
- Password: `MyPassword123!`
- Cluster: `cluster0.abc123.mongodb.net`

**Connection string thật sẽ là:**
```
mongodb+srv://myadmin:MyPassword123!@cluster0.abc123.mongodb.net/senvang?retryWrites=true&w=majority
```

### ⚠️ Lưu ý quan trọng:

1. **Password đặc biệt:** Nếu password có ký tự đặc biệt (@, #, $, %, etc.), phải URL-encode:
   - `@` → `%40`
   - `#` → `%23`
   - `$` → `%24`
   - `%` → `%25`
   
   **Ví dụ:** Password `My@Pass#123` → `My%40Pass%23123`

2. **Database name:** Thêm `/senvang` vào cuối connection string (trước `?`)

3. **Network Access:** Đảm bảo IP đã được whitelist
   - Vào **Network Access** (menu bên trái)
   - Click **"Add IP Address"**
   - Chọn **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Hoặc thêm IP của Vercel (tìm trong Vercel docs)

---

## 📝 CẤU HÌNH TRÊN VERCEL

Sau khi có MongoDB URI thật:

1. **Vào Vercel Dashboard** → Project của bạn
2. **Settings → Environment Variables**
3. **Edit** biến `MONGODB_URI`
4. **Dán connection string thật** vào
5. **Save**

### Ví dụ URI đúng:
```
mongodb+srv://myadmin:MyPassword123@cluster0.abc123.mongodb.net/senvang?retryWrites=true&w=majority
```

### Ví dụ URI SAI (không dùng):
```
mongodb+srv://your_username:your_password@cluster.mongodb.net/senvang
mongodb://localhost:27017/senvang
cluster.mongodb.net
```

---

## 🔍 KIỂM TRA KẾT NỐI

Sau khi cập nhật:

1. **Redeploy** trên Vercel
2. **Mở browser console** (F12)
3. **Thử login admin**
4. **Kiểm tra log:**
   - Nếu thấy `✅ MongoDB connected` → Thành công!
   - Nếu vẫn lỗi → Kiểm tra lại:
     - Username đúng?
     - Password đúng (đã URL-encode nếu cần)?
     - Cluster URL đúng?
     - Network Access đã mở?

---

## 🆘 VẪN LỖI?

### Tạo Database User mới (nếu quên password):

1. **MongoDB Atlas** → **Database Access** (menu trái)
2. Click **"Add New Database User"**
3. Chọn **Password** authentication
4. Đặt username và password mới
5. Chọn **Atlas Admin** role
6. Click **Add User**
7. Dùng credentials mới để tạo connection string

### Tạo Cluster mới (nếu chưa có):

1. **MongoDB Atlas** → **Database** (menu trái)
2. Click **"Create"** hoặc **"Build a Database"**
3. Chọn **FREE** tier (M0)
4. Chọn cloud provider và region
5. Click **Create Cluster**
6. Đợi cluster tạo xong (3-5 phút)
7. Làm theo các bước trên để lấy connection string

---

## 📞 CẦN TRỢ GIÚP?

Gửi thông tin sau để được hỗ trợ:
1. Screenshot phần connection string từ MongoDB Atlas (che password)
2. Screenshot lỗi đầy đủ từ browser console
3. Screenshot Environment Variables trên Vercel (che giá trị)
