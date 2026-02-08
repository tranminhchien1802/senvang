// Script kiểm tra cấu hình trước khi deploy
// File: check-config.js

require('dotenv').config(); // Load .env file if exists

const checks = [
  {
    name: 'Google Client ID',
    value: process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID,
    required: true,
    warning: 'Google Client ID chưa được cấu hình. Vui lòng thêm vào biến môi trường.'
  },
  {
    name: 'Google Client Secret',
    value: process.env.GOOGLE_CLIENT_SECRET,
    required: true,
    warning: 'Google Client Secret chưa được cấu hình. Vui lòng thêm vào biến môi trường.'
  },
  {
    name: 'JWT Secret',
    value: process.env.JWT_SECRET,
    required: true,
    warning: 'JWT Secret chưa được cấu hình. Vui lòng thêm vào biến môi trường.'
  },
  {
    name: 'MongoDB URI',
    value: process.env.MONGODB_URI,
    required: false, // Không bắt buộc nếu dùng localStorage
    warning: 'MongoDB URI chưa được cấu hình. Ứng dụng sẽ dùng localStorage nếu không có DB.'
  },
  {
    name: 'EmailJS Public Key',
    value: process.env.VITE_REACT_APP_EMAILJS_PUBLIC_KEY,
    required: false, // Không bắt buộc nếu không dùng EmailJS
    warning: 'EmailJS Public Key chưa được cấu hình. Tính năng gửi email có thể không hoạt động.'
  },
  {
    name: 'EmailJS Service ID',
    value: process.env.VITE_REACT_APP_SERVICE_ID,
    required: false, // Không bắt buộc nếu không dùng EmailJS
    warning: 'EmailJS Service ID chưa được cấu hình. Tính năng gửi email có thể không hoạt động.'
  },
  {
    name: 'EmailJS Template ID',
    value: process.env.VITE_REACT_APP_TEMPLATE_ID,
    required: false, // Không bắt buộc nếu không dùng EmailJS
    warning: 'EmailJS Template ID chưa được cấu hình. Tính năng gửi email có thể không hoạt động.'
  }
];

console.log('🔍 Kiểm tra cấu hình trước khi deploy...\n');

let hasErrors = false;
let hasWarnings = false;

checks.forEach(check => {
  if (check.required && !check.value) {
    console.log(`❌ ${check.name}: Thiếu (bắt buộc)`);
    console.log(`   Cảnh báo: ${check.warning}\n`);
    hasErrors = true;
  } else if (!check.required && !check.value) {
    console.log(`⚠️  ${check.name}: Thiếu (không bắt buộc)`);
    console.log(`   Cảnh báo: ${check.warning}\n`);
    hasWarnings = true;
  } else {
    console.log(`✅ ${check.name}: Đã cấu hình\n`);
  }
});

if (hasErrors) {
  console.log('🔴 Có lỗi cấu hình bắt buộc. Vui lòng bổ sung các biến môi trường còn thiếu.');
  process.exit(1);
} else if (hasWarnings) {
  console.log('🟡 Có cảnh báo. Ứng dụng có thể chạy nhưng một số tính năng có thể không hoạt động.');
  console.log('   Vui lòng xem xét bổ sung các biến môi trường còn thiếu nếu cần.');
} else {
  console.log('🟢 Tất cả cấu hình bắt buộc đã được thiết lập. Sẵn sàng deploy!');
}

console.log('\n💡 Gợi ý:');
console.log('- Đảm bảo domain của bạn đã được thêm vào Google Cloud Console');
console.log('- Kiểm tra lại "Authorized JavaScript Origins" và "Authorized Redirect URIs"');
console.log('- Xác nhận các biến môi trường trên Vercel match với Google Cloud Console');