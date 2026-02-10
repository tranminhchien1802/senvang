# Hướng Dẫn Deploy Lên Vercel

## Cấu Hình Biến Môi Trường Trên Vercel

Để ứng dụng hoạt động đúng trên Vercel, bạn cần cấu hình các biến môi trường sau trong phần Settings > Environment Variables trên Vercel:

### Biến Môi Trường Bắt Buộc:
- `VITE_GOOGLE_CLIENT_ID` - Client ID từ Google Cloud Console
- `VITE_REACT_APP_GOOGLE_CLIENT_ID` - (Cũ) Client ID từ Google Cloud Console
- `VITE_EMAILJS_PUBLIC_KEY` - Public key từ EmailJS
- `VITE_REACT_APP_SERVICE_ID` - Service ID từ EmailJS
- `VITE_REACT_APP_TEMPLATE_ID` - Template ID từ EmailJS

## Cấu Hình Google OAuth Cho Production

Để Google OAuth hoạt động trên Vercel, bạn cần:

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Chọn dự án của bạn
3. Vào APIs & Credentials > OAuth 2.0 Client IDs
4. Trong phần "Authorized JavaScript origins", thêm:
   - `https://senvang-olive.vercel.app`
   - `https://your-custom-domain.com` (nếu có)

5. Trong phần "Authorized redirect URIs", thêm:
   - `https://senvang-olive.vercel.app/auth/success`
   - `https://your-custom-domain.com/auth/success` (nếu có)

## Triển Khai

1. Push code lên GitHub
2. Import project vào Vercel
3. Chọn framework là "Other" hoặc "Create Vite App"
4. Build command: `npm run build`
5. Output directory: `dist`
6. Thêm các biến môi trường như trên

## Lưu Ý Quan Trọng

- Backend hiện đang chạy trên Railway, nên cấu hình trong `vercel.json` sẽ chuyển tiếp các yêu cầu API đến backend
- Đảm bảo backend Railway đang chạy trước khi deploy frontend lên Vercel
- Nếu gặp lỗi 404 sau khi đăng nhập Google, kiểm tra lại URL redirect trong Google Cloud Console