const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a test email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Sử dụng dịch vụ Gmail
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Function to test email configuration
const testEmail = async () => {
  try {
    // Verify the transporter configuration
    await transporter.verify();
    console.log('✅ Kết nối email thành công!');
    
    // Try to send a test email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Gửi cho chính tài khoản gửi
      subject: 'Test Email - Kế Toán Sen Vàng',
      text: 'Đây là email kiểm tra để xác nhận hệ thống gửi email đang hoạt động.',
      html: '<h2>Test Email</h2><p>Đây là email kiểm tra để xác nhận hệ thống gửi email đang hoạt động.</p>'
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email gửi thành công!');
    console.log('Message ID:', info.messageId);
    console.log('Đã gửi đến:', process.env.EMAIL_USER);
  } catch (error) {
    console.error('❌ Có lỗi xảy ra:', error.message);
    
    if (error.message.includes('Invalid login')) {
      console.error('\nNguyên nhân phổ biến:');
      console.error('1. Sai email hoặc mật khẩu');
      console.error('2. Gmail bảo mật cao - cần bật "Allow less secure apps" hoặc dùng App Password');
      console.error('3. Chưa bật 2FA và tạo App Password');
      console.error('\nGiải pháp:');
      console.error('- Bật xác thực 2 lớp trong tài khoản Gmail');
      console.error('- Tạo App Password tại https://myaccount.google.com/apppasswords');
      console.error('- Sử dụng App Password thay cho mật khẩu thông thường');
    }
  }
};

testEmail();