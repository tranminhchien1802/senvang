# Kịch Bản Kiểm Tra Ứng Dụng - Kế Toán Sen Vàng

Tài liệu này cung cấp hướng dẫn kiểm tra toàn diện cho ứng dụng Kế Toán Sen Vàng sau khi được triển khai lên môi trường hosting.

## 1. Kiểm Tra Khởi Động Ứng Dụng

### 1.1. Trang Chủ
- [ ] Mở trang chủ: `https://domain.com/`
- [ ] Kiểm tra giao diện có hiển thị đúng không
- [ ] Kiểm tra logo và thông tin công ty
- [ ] Kiểm tra menu điều hướng hoạt động đúng

### 1.2. Tải Dữ Liệu Gói Dịch Vụ
- [ ] Mở F12 → Console → Storage → LocalStorage
- [ ] Kiểm tra có tồn tại các key: `dichVuPackages`, `dichVuKhacPackages`
- [ ] Kiểm tra số lượng gói dịch vụ đã được thêm (tổng cộng 32 gói)

## 2. Kiểm Tra Các Trang Chính

### 2.1. Trang Dịch Vụ (`/dich-vu`)
- [ ] Hiển thị đúng tiêu đề "DỊCH VỤ THÀNH LẬP & VẬN HÀNH DOANH NGHIỆP"
- [ ] Hiển thị đúng các lĩnh vực hoạt động
- [ ] Hiển thị đúng các gói dịch vụ đã thêm
- [ ] Kiểm tra từng gói dịch vụ hiển thị đúng: tên, giá, mô tả, nội dung chi tiết, thời gian hoàn thành
- [ ] Kiểm tra tính năng tìm kiếm hoạt động đúng
- [ ] Kiểm tra tính năng sắp xếp theo giá hoạt động đúng
- [ ] Kiểm tra nút "MUA NGAY" hoạt động đúng (yêu cầu đăng nhập)

### 2.2. Trang Dịch Vụ Khác (`/dich-vu-khac`)
- [ ] Hiển thị đúng tiêu đề "GIẢI PHÁP VÀ HỖ TRỢ CHUYÊN SÂU"
- [ ] Hiển thị đúng các accordion
- [ ] Hiển thị đúng các gói dịch vụ trong bảng giá
- [ ] Kiểm tra từng gói dịch vụ hiển thị đúng
- [ ] Kiểm tra tìm kiếm và sắp xếp hoạt động đúng

### 2.3. Trang Giới Thiệu (`/gioi-thieu`)
- [ ] Hiển thị nội dung giới thiệu công ty đúng
- [ ] Hiển thị thông tin liên hệ đúng

### 2.4. Trang Liên Hệ (`/ContactForm`)
- [ ] Hiển thị form liên hệ đúng
- [ ] Kiểm tra tất cả các trường nhập liệu hiện hữu
- [ ] Kiểm tra nút gửi hoạt động đúng

## 3. Kiểm Tra Tính Năng

### 3.1. Tìm Kiếm
- [ ] Tìm kiếm trên trang Dịch Vụ hoạt động đúng
- [ ] Tìm kiếm trên trang Dịch Vụ Khác hoạt động đúng
- [ ] Tìm kiếm theo tên gói, mô tả, giá cả hoạt động đúng
- [ ] Tìm kiếm trên cả hai thanh tìm kiếm trong mỗi trang

### 3.2. Sắp Xếp
- [ ] Sắp xếp giá tăng dần hoạt động đúng
- [ ] Sắp xếp giá giảm dần hoạt động đúng
- [ ] Sắp xếp mặc định hoạt động đúng

### 3.3. Admin
- [ ] Truy cập trang `/admin/login` hoạt động đúng
- [ ] Đăng nhập admin hoạt động đúng
- [ ] Trang admin `/admin` hiển thị đúng các bảng dữ liệu
- [ ] Các gói dịch vụ hiển thị đúng trong trang admin
- [ ] Tính năng thêm/sửa/xóa gói dịch vụ hoạt động đúng

## 4. Kiểm Tra Tương Thích Trình Duyệt

### 4.1. Trình Duyệt Chính
- [ ] Chrome (phiên bản mới nhất): ✓
- [ ] Firefox (phiên bản mới nhất): ✓
- [ ] Safari (phiên bản mới nhất): ✓
- [ ] Edge (phiên bản mới nhất): ✓

### 4.2. Thiết Bị
- [ ] Desktop: ✓
- [ ] Tablet: ✓
- [ ] Mobile: ✓

## 5. Kiểm Tra Hiệu Năng

### 5.1. Tốc Độ Tải Trang
- [ ] Trang chính tải trong vòng 3s
- [ ] Trang dịch vụ tải trong vòng 3s
- [ ] Không có lỗi 404 cho tài nguyên

### 5.2. Bộ Nhớ
- [ ] Không có memory leak
- [ ] localStorage hoạt động ổn định

## 6. Kiểm Tra Bảo Mật

### 6.1. localStorage
- [ ] Dữ liệu gói dịch vụ không bị thay đổi bất hợp pháp
- [ ] Không lưu thông tin nhạy cảm không cần thiết

## 7. Kiểm Tra Các Liên Kết

- [ ] Liên kết trong menu hoạt động đúng
- [ ] Liên kết mạng xã hội hoạt động đúng
- [ ] Liên kết nút liên hệ hoạt động đúng

## 8. Kiểm Tra Trang Cập Nhật Gói Dịch Vụ

- [ ] Truy cập `/update-packages.html` hoạt động đúng
- [ ] Nút "Thêm/Cập Nhật Gói Dịch Vụ" hoạt động đúng
- [ ] Nút "Xóa Tất Cả Gói Dịch Vụ" hoạt động đúng

## 9. Các Trường Hợp Lỗi

### 9.1. Trình Duyệt Không Hỗ Trợ localStorage
- [ ] Ứng dụng vẫn hoạt động cơ bản
- [ ] Có thông báo hoặc xử lý lỗi phù hợp

### 9.2. Dữ Liệu Bị Thiếu
- [ ] Ứng dụng xử lý dữ liệu thiếu một cách an toàn
- [ ] Không có lỗi JavaScript khi thiếu trường dữ liệu

## 10. Tổng Kết
Sau khi hoàn tất kiểm tra, đánh dấu ✓ vào các mục đã hoàn thành.
Nếu có lỗi phát sinh, ghi chú cụ thể và chuyển cho bộ phận phát triển xử lý.