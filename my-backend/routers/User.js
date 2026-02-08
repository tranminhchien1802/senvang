const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Order = require('../models/Order');
const LoginActivity = require('../models/LoginActivity');
const router = express.Router();

// Create email transporter (using test configuration)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'test@example.com',
    pass: process.env.EMAIL_PASS || 'testpassword',
  },
});

// For development, use test account
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    streamTransport: true,
    newline: 'windows',
    buffer: true
  });
}

// Helper function to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Vui lòng điền đầy đủ thông tin: tên, email và mật khẩu' });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ msg: 'Địa chỉ email không hợp lệ' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      phone
    });

    await user.save();

    // Generate JWT token
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'default_secret', { expiresIn: '7d' });

    // Create a registration order to track this signup event
    const registrationOrder = new Order({
      userId: user._id,
      orderType: 'registration',  // Mark this as a registration order
      customerInfo: {
        fullName: user.name,
        phone: user.phone,
        email: user.email
      },
      status: 'completed',
      transactionId: `REG${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`, // Registration transaction ID
      packagePrice: 'Miễn phí',
      packagePriceNumber: 0
    });

    await registrationOrder.save();

    // Send confirmation email
    try {
      // Check if we have proper email configuration
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const mailOptions = {
          from: `"Kế Toán Sen Vàng" <${process.env.EMAIL_USER}>`, // Proper sender format
          to: email,
          subject: 'Xác nhận đăng ký tài khoản - Kế Toán Sen Vàng',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <title>Xác nhận đăng ký tài khoản</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; border-bottom: 2px solid #FFD700; padding-bottom: 10px;">
                  <h1 style="color: #FFD700;">KẾ TOÁN SEN VÀNG</h1>
                </div>

                <div style="margin: 20px 0;">
                  <h2 style="color: #555;">Chào mừng bạn đến với Kế Toán Sen Vàng!</h2>
                  <p>Xin chào <strong>${name}</strong>,</p>
                  <p>Cảm ơn bạn đã đăng ký tài khoản trên hệ thống của chúng tôi.</p>
                  <p>Tài khoản của bạn với email <strong>${email}</strong> đã được tạo thành công.</p>
                  <p>Bạn có thể bắt đầu sử dụng tài khoản để mua các gói dịch vụ kế toán của chúng tôi.</p>

                  <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #FFD700; margin: 20px 0;">
                    <p><strong>Lưu ý:</strong> Đây là email xác nhận tự động. Vui lòng không reply lại email này.</p>
                  </div>

                  <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua hotline: <strong>093 209 7986</strong></p>
                </div>

                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 0.9em;">
                  <p>Trân trọng,<br/><strong>Đội ngũ Kế Toán Sen Vàng</strong></p>
                  <p>© 2025 Kế Toán Sen Vàng. Tất cả quyền được bảo lưu.</p>
                </div>
              </div>
            </body>
            </html>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Confirmation email sent to: ${email}`);
      } else {
        console.log(`Email configuration missing. Would send confirmation to: ${email}`);
      }
    } catch (emailErr) {
      console.error('Error sending confirmation email:', emailErr);
      // Don't fail the registration if email fails
    }

    res.status(201).json({
      msg: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ msg: 'Vui lòng điền đầy đủ email và mật khẩu' });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ msg: 'Địa chỉ email không hợp lệ' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Tài khoản không tồn tại' });
    }

    // Check if user has a password (for users created without password)
    if (!user.password) {
      return res.status(400).json({ msg: 'Mật khẩu không hợp lệ' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Mật khẩu không đúng' });
    }

    // Generate JWT token
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'default_secret', { expiresIn: '7d' });

    // Save login activity
    const loginActivity = new LoginActivity({
      userId: user._id,
      email: user.email,
      name: user.name,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      loginTime: new Date(),
      success: true
    });

    await loginActivity.save();

    // Send login confirmation email
    try {
      const loginMailOptions = {
        from: `"Kế Toán Sen Vàng" <${process.env.EMAIL_USER}>`, // Proper sender format
        to: email,
        subject: 'Xác nhận đăng nhập tài khoản - Kế Toán Sen Vàng',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Xác nhận đăng nhập tài khoản</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; border-bottom: 2px solid #FFD700; padding-bottom: 10px;">
                <h1 style="color: #FFD700;">KẾ TOÁN SEN VÀNG</h1>
              </div>

              <div style="margin: 20px 0;">
                <h2 style="color: #555;">Thông báo đăng nhập tài khoản</h2>
                <p>Xin chào <strong>${user.name}</strong>,</p>
                <p>Chúng tôi thông báo rằng bạn vừa đăng nhập thành công vào tài khoản trên hệ thống Kế Toán Sen Vàng.</p>
                <p><strong>Thời gian đăng nhập:</strong> ${new Date().toLocaleString('vi-VN')}</p>
                <p><strong>Địa chỉ IP:</strong> ${req.ip || 'Unknown'}</p>

                <div style="background-color: #ffecec; padding: 15px; border-left: 4px solid #ff4444; margin: 20px 0;">
                  <p><strong>Lưu ý quan trọng:</strong> Nếu bạn không thực hiện thao tác này, vui lòng liên hệ với chúng tôi ngay lập tức qua hotline: <strong>093 209 7986</strong> hoặc đổi mật khẩu tài khoản của bạn.</p>
                </div>

                <p>Đây là email xác nhận tự động. Vui lòng không reply lại email này.</p>
              </div>

              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 0.9em;">
                <p>Trân trọng,<br/><strong>Đội ngũ Kế Toán Sen Vàng</strong></p>
                <p>© 2025 Kế Toán Sen Vàng. Tất cả quyền được bảo lưu.</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      await transporter.sendMail(loginMailOptions);
      console.log(`Login confirmation email sent to: ${email}`);
    } catch (emailErr) {
      console.error('Error sending login confirmation email:', emailErr);
      // Don't fail the login if email fails
    }

    res.json({
      msg: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET all users (for admin use)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET current user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET all users (for admin) - This was already added but let's make sure it's here
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Don't return passwords
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;