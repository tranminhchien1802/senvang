# Hướng Dẫn Sử Dụng Form Liên Hệ

## Tổng Quan

Form liên hệ cho phép người dùng gửi thông tin đăng ký dịch vụ và nhận thông báo qua email đến `ketoansenvang.net@gmail.com`. Form có tích hợp các gói dịch vụ và sử dụng EmailJS để gửi email trực tiếp từ frontend.

## Cấu Hình

### 1. Cài Đặt EmailJS

Trước khi form có thể hoạt động, bạn cần cấu hình EmailJS:

1. Tạo tài khoản tại [EmailJS](https://www.emailjs.com/)
2. Cài đặt service (Gmail, Outlook, etc.) vào tài khoản
3. Tạo một template email mới với các biến:
   - `{{from_name}}` - Họ và tên người gửi
   - `{{phone}}` - Số điện thoại
   - `{{email}}` - Email người gửi
   - `{{service_package}}` - Gói dịch vụ được chọn
   - `{{message}}` - Tin nhắn từ người gửi

### 2. Cấu Hình Biến Môi Trường

Tạo file `.env` trong thư mục gốc dự án (copy từ `.env.example`):

```bash
VITE_REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_REACT_APP_SERVICE_ID=your_service_id_here
VITE_REACT_APP_TEMPLATE_ID=your_template_id_here
```

## Thành Phần

### ContactForm.jsx

- Form chính với các trường: Họ tên, Số điện thoại, Email, Gói dịch vụ, Tin nhắn
- Validation cho tất cả các trường đầu vào
- Gửi dữ liệu qua EmailJS
- Hiển thị trạng thái gửi thành công/thất bại

### FloatingContact.jsx

- Widget nổi với 4 nút liên hệ: Messenger, Zalo, Form Liên Hệ, Gọi điện
- Khi nhấn nút "Liên Hệ", sẽ mở form liên hệ
- Có thể mở/đóng form dễ dàng

## Các Gói Dịch Vụ

Form hiện hỗ trợ 4 gói dịch vụ:

1. **Gói Cơ Bản** - Dành cho cá nhân mới bắt đầu
2. **Gói Tiêu Chuẩn** - Dành cho doanh nghiệp nhỏ
3. **Gói Cao Cấp** - Dành cho doanh nghiệp lớn
4. **Gói Doanh Nghiệp** - Dành cho tập đoàn, công ty lớn

## Tích Hợp

Để thêm form vào trang bất kỳ, chỉ cần import và sử dụng:

```jsx
import ContactForm from './components/ContactForm';

// Trong component của bạn
<ContactForm />
```

FloatingContact đã được thiết lập để hiển thị ở mọi trang (vị trí: góc dưới bên phải).

## Kiểm Thử

Sau khi cấu hình xong, bạn có thể kiểm thử:

1. Điền đầy đủ thông tin vào form
2. Chọn gói dịch vụ
3. Gửi form
4. Kiểm tra email tại `ketoansenvang.net@gmail.com`
5. Xác nhận rằng thông tin được gửi đúng với gói dịch vụ đã chọn

## Xử Lý Lỗi

- Nếu gửi thất bại, thông báo lỗi sẽ hiển thị trên form
- Nếu thiếu cấu hình EmailJS, sẽ có cảnh báo màu vàng
- Tất cả validation lỗi sẽ hiển thị dưới trường tương ứng

## Bảo Mật

- Không commit file `.env` lên repository (đã được thêm vào `.gitignore`)
- Chỉ chia sẻ API keys với người có thẩm quyền
- Theo dõi việc gửi email trong dashboard của EmailJS