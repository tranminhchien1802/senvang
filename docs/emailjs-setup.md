# Hướng Dẫn Cấu Hình EmailJS

## 1. Tạo tài khoản EmailJS

1. Truy cập [https://www.emailjs.com/](https://www.emailjs.com/)
2. Đăng ký tài khoản miễn phí
3. Đăng nhập vào dashboard

## 2. Cài đặt Email Service

1. Trong dashboard, chọn "Email Services"
2. Click "Add New Service"
3. Chọn dịch vụ email bạn muốn sử dụng (Gmail, Outlook, v.v.)
4. Nhập thông tin đăng nhập email của bạn để kết nối
5. Xác nhận kết nối

## 3. Tạo Email Template

1. Trong dashboard, chọn "Email Templates"
2. Click "Create New Template"
3. Đặt tên cho template (ví dụ: "contact_notification")
4. Thiết kế email template với các biến sau:

```
Subject: Thông báo đăng ký dịch vụ mới từ {{from_name}}

From: {{from_name}} <{{reply_to}}>

Nội dung:
Họ và tên: {{from_name}}
Số điện thoại: {{phone}}
Email: {{email}}
Gói dịch vụ quan tâm: {{service_package}}
Tin nhắn: {{message}}

---
Thông báo tự động từ hệ thống Kế Toán Sen Vàng
```

5. Click "Save & Enable" để lưu template

## 4. Lấy API Keys

1. Trong dashboard, vào "Account" → "API Keys"
2. Copy "Public Key" để sử dụng trong frontend

## 5. Cấu hình trong dự án

1. Tạo file `.env` trong thư mục gốc dự án (sao chép từ `.env.example`)
2. Cập nhật các giá trị:

```bash
VITE_REACT_APP_EMAILJS_PUBLIC_KEY=your_actual_public_key
VITE_REACT_APP_SERVICE_ID=your_actual_service_id
VITE_REACT_APP_TEMPLATE_ID=your_actual_template_id
```

## 6. Các biến có sẵn trong template

- `{{from_name}}` - Họ và tên người gửi
- `{{phone}}` - Số điện thoại
- `{{email}}` - Email người gửi
- `{{service_package}}` - Gói dịch vụ được chọn
- `{{message}}` - Tin nhắn từ người gửi
- `{{to_email}}` - Email nhận (ketoansenvang.net@gmail.com)
- `{{reply_to}}` - Email để reply lại

## 7. Kiểm tra gửi email

Sau khi cấu hình xong, thử gửi một email test từ form liên hệ để kiểm tra.

## Lưu ý bảo mật

- Không commit file `.env` lên repository (đã có trong `.gitignore`)
- Chỉ chia sẻ API keys với người có thẩm quyền
- Thường xuyên kiểm tra và đổi keys nếu cần thiết