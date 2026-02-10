const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Order = require('../models/Order');
const User = require('../models/User');
const LoginActivity = require('../models/LoginActivity');
const router = express.Router();

// Middleware to verify admin token
const verifyAdmin = async (req, res, next) => {
  const token = req.header('x-auth-token');
  console.log('Received token:', token ? 'YES' : 'NO');

  if (!token) {
    console.log('Authorization denied: No token provided');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    console.log('JWT Secret being used:', process.env.JWT_SECRET ? 'SET' : 'DEFAULT');
    console.log('JWT Secret value:', process.env.JWT_SECRET || 'default_secret');

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    console.log('Decoded token:', decoded);

    req.admin = await Admin.findById(decoded.adminId);
    console.log('Found admin:', req.admin ? 'YES' : 'NO');

    if (!req.admin) {
      console.log('Admin not found for ID:', decoded.adminId);
      return res.status(401).json({ msg: 'Admin not found' });
    }

    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    console.error('Error type:', err.name);
    console.error('Error details:', {
      expiredAt: err.expiredAt,
      message: err.message
    });
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Admin Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if admin already exists
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ msg: 'Admin already exists' });
    }

    // Create new admin
    admin = new Admin({
      username,
      email,
      password
    });

    await admin.save();

    // Generate JWT token
    const payload = { adminId: admin._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'default_secret', { expiresIn: '7d' });

    res.status(201).json({
      msg: 'Admin registered successfully',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT token
    const payload = { adminId: admin._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'default_secret', { expiresIn: '7d' });

    res.json({
      msg: 'Login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all users (Admin only)
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all orders (Admin only)
router.get('/orders', verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all orders excluding registration orders (Admin only)
router.get('/service-orders', verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find({ orderType: 'package' })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get dashboard statistics (Admin only)
router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const serviceOrders = await Order.countDocuments({ orderType: 'package' }); // Only package orders
    const registrationOrders = await Order.countDocuments({ orderType: 'registration' }); // Only registration orders
    const pendingOrders = await Order.countDocuments({ status: 'pending', orderType: 'package' });
    const paidOrders = await Order.countDocuments({ status: 'paid', orderType: 'package' });

    // Calculate total revenue (only from package orders, not registration orders)
    const paidOrdersWithPrice = await Order.find({
      status: 'paid',
      orderType: 'package'
    });
    const totalRevenue = paidOrdersWithPrice.reduce((sum, order) => sum + order.packagePriceNumber, 0);

    res.json({
      totalUsers,
      totalOrders,
      serviceOrders,
      registrationOrders,
      pendingOrders,
      paidOrders,
      totalRevenue
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get revenue statistics by date range (Admin only)
router.get('/revenue-stats', verifyAdmin, async (req, res) => {
  try {
    const { period } = req.query; // 'daily', 'monthly', 'yearly'

    let startDate = new Date();
    if (period === 'daily') {
      startDate.setDate(startDate.getDate() - 7); // Last 7 days
    } else if (period === 'monthly') {
      startDate.setMonth(startDate.getMonth() - 3); // Last 3 months
    } else if (period === 'yearly') {
      startDate.setFullYear(startDate.getFullYear() - 1); // Last year
    } else {
      startDate.setDate(startDate.getDate() - 30); // Default: last 30 days
    }

    // Get paid orders in the specified period
    const orders = await Order.find({
      status: 'paid',
      createdAt: { $gte: startDate }
    }).sort({ createdAt: 1 });

    // Group by date/month/year based on period
    const stats = {};
    orders.forEach(order => {
      let key;
      if (period === 'daily') {
        key = new Date(order.createdAt).toDateString(); // e.g., "Mon Dec 09 2024"
      } else if (period === 'monthly') {
        key = new Date(order.createdAt.getFullYear(), order.createdAt.getMonth(), 1).toISOString().split('T')[0]; // e.g., "2024-12-01"
      } else { // yearly
        key = order.createdAt.getFullYear().toString(); // e.g., "2024"
      }

      if (!stats[key]) {
        stats[key] = {
          date: key,
          revenue: 0,
          orders: 0
        };
      }

      stats[key].revenue += order.packagePriceNumber;
      stats[key].orders += 1;
    });

    // Convert to array and sort by date
    const result = Object.values(stats).sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update order status (Admin only)
router.put('/orders/:id', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    // Get the original order to check if status is changing from pending to paid
    const originalOrder = await Order.findById(id).populate('userId', 'name email');
    if (!originalOrder) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('userId', 'name email');

    // If the status is changed to 'paid' from another status, send confirmation email
    if (originalOrder.status !== 'paid' && order.status === 'paid') {
      // Send confirmation email to customer
      const nodemailer = require('nodemailer');

      // Create email transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      try {
        const mailOptions = {
          from: `"Kế Toán Sen Vàng" <${process.env.EMAIL_USER}>`,
          to: order.userId.email,
          subject: 'Xác nhận mua hàng thành công - Kế Toán Sen Vàng',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <title>Xác nhận mua hàng thành công</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; border-bottom: 2px solid #FFD700; padding-bottom: 10px;">
                  <h1 style="color: #FFD700;">KẾ TOÁN SEN VÀNG</h1>
                </div>

                <div style="margin: 20px 0;">
                  <h2 style="color: #555;">Xác nhận mua hàng thành công</h2>
                  <p>Xin chào <strong>${order.userId.name}</strong>,</p>
                  <p>Chúng tôi xin xác nhận đơn hàng của bạn đã được xử lý thành công.</p>
                  <p><strong>Thông tin đơn hàng:</strong></p>
                  <ul>
                    <li><strong>Mã giao dịch:</strong> ${order.transactionId}</li>
                    <li><strong>Gói dịch vụ:</strong> ${order.packageName}</li>
                    <li><strong>Giá:</strong> ${order.packagePrice}</li>
                    <li><strong>Trạng thái:</strong> Đã thanh toán</li>
                  </ul>

                  <div style="background-color: #e6f7ee; padding: 15px; border-left: 4px solid #52c41a; margin: 20px 0;">
                    <p>✅ Thanh toán của bạn đã được xác nhận thành công. Dịch vụ sẽ được cung cấp theo đúng cam kết.</p>
                  </div>

                  <p>Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi!</p>
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
        console.log(`Payment confirmation email sent to: ${order.userId.email}`);
      } catch (emailErr) {
        console.error('Error sending payment confirmation email:', emailErr);
        // Don't fail the order update if email fails
      }
    }

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get login activity (Admin only)
router.get('/login-activity', verifyAdmin, async (req, res) => {
  try {
    const loginActivities = await LoginActivity.find()
      .sort({ loginTime: -1 })
      .limit(50); // Get last 50 login activities

    res.json(loginActivities);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Send order confirmation email (Admin only)
router.post('/send-order-confirmation', verifyAdmin, async (req, res) => {
  try {
    const { customerEmail, customerName, serviceName, servicePrice, transactionId } = req.body;

    // Validate required fields
    if (!customerEmail || !customerName || !serviceName || !servicePrice || !transactionId) {
      return res.status(400).json({
        msg: 'Vui lòng cung cấp đầy đủ thông tin: email khách hàng, tên khách hàng, tên dịch vụ, giá dịch vụ và mã giao dịch'
      });
    }

    console.log('=== EMAIL SENDING DEBUG INFO ===');
    console.log('Customer Email:', customerEmail);
    console.log('Customer Name:', customerName);
    console.log('Service Name:', serviceName);
    console.log('Service Price:', servicePrice);
    console.log('Transaction ID:', transactionId);
    console.log('Email Config Available:', !!process.env.EMAIL_USER && !!process.env.EMAIL_PASS);

    // Send order confirmation email to customer
    const nodemailer = require('nodemailer');

    // Check if email configuration is available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email configuration missing - EMAIL_USER or EMAIL_PASS not set in environment variables');
      return res.status(500).json({
        msg: 'Cấu hình email chưa được thiết lập. Vui lòng kiểm tra lại biến môi trường EMAIL_USER và EMAIL_PASS.'
      });
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Verify transporter configuration
    try {
      await transporter.verify();
      console.log('Email transporter verified successfully');
    } catch (verifyError) {
      console.error('Email transporter verification failed:', verifyError);
      console.error('Email configuration details (for debugging):', {
        userEmail: process.env.EMAIL_USER,
        hasEmailPass: !!process.env.EMAIL_PASS,
        emailPassLength: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0,
        emailPassPreview: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.substring(0, 4) + '...' : 'N/A'
      });

      // Check if it's a common configuration issue
      if (!process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'mat_khau_ung_dung_gmail') {
        return res.status(500).json({
          msg: 'Cấu hình email chưa được thiết lập đúng. Vui lòng cập nhật EMAIL_PASS trong file .env với App Password thực tế từ Gmail.'
        });
      }

      return res.status(500).json({
        msg: `Xác thực email thất bại: ${verifyError.message}. Vui lòng kiểm tra lại cấu hình email.`
      });
    }

    const mailOptions = {
      from: `"Kế Toán Sen Vàng" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: `Xác nhận đơn hàng dịch vụ - ${serviceName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Xác nhận đơn hàng dịch vụ</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; border-bottom: 2px solid #FFD700; padding-bottom: 10px; margin-bottom: 20px;">
            <h1 style="color: #FFD700;">KẾ TOÁN SEN VÀNG</h1>
          </div>

          <div>
            <h2 style="color: #555;">Xác nhận đơn hàng dịch vụ</h2>
            <p>Cảm ơn quý khách đã đặt dịch vụ tại <strong>Kế Toán Sen Vàng</strong>.</p>
            <br>
            <h3>Thông tin đơn hàng:</h3>
            <p><strong>Mã đơn hàng:</strong> ${transactionId}</p>
            <p><strong>Dịch vụ:</strong> ${serviceName}</p>
            <p><strong>Giá tiền:</strong> ${servicePrice}</p>
            <p><strong>Khách hàng:</strong> ${customerName}</p>
            <p><strong>Thời gian đặt:</strong> ${new Date().toLocaleString('vi-VN')}</p>
            <br>
            <p>Chúng tôi sẽ liên hệ với quý khách trong thời gian sớm nhất để tiến hành xử lý đơn hàng.</p>
            <br>
            <p>Trân trọng,<br><strong>Đội ngũ Kế Toán Sen Vàng</strong></p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            <p><em>Lưu ý: Đây là email tự động, vui lòng không.reply lại email này.</em></p>
          </div>
        </body>
        </html>
      `
    };

    console.log('About to send email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    try {
      const result = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result);
      console.log(`Order confirmation email sent to: ${customerEmail}`);

      // Return success response
      res.json({
        msg: 'Email xác nhận đã được gửi thành công',
        emailSentTo: customerEmail,
        messageId: result.messageId
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      console.error('Email error details:', {
        message: emailError.message,
        code: emailError.code,
        response: emailError.response,
        responseCode: emailError.responseCode,
        command: emailError.command
      });

      // Return error response but still respond to client
      return res.status(500).json({
        msg: `Gửi email thất bại: ${emailError.message}. Vui lòng kiểm tra lại cấu hình email.`
      });
    }
  } catch (err) {
    console.error('Unexpected error in send-order-confirmation:', err.message);
    res.status(500).json({ msg: `Lỗi máy chủ: ${err.message}` });
  }
});

// Send customer order confirmation email (Public endpoint - no admin required)
router.post('/send-customer-order-confirmation', async (req, res) => {
  try {
    const { customerEmail, customerName, serviceName, servicePrice, transactionId } = req.body;

    // Validate required fields
    if (!customerEmail || !customerName || !serviceName || !servicePrice || !transactionId) {
      return res.status(400).json({
        msg: 'Vui lòng cung cấp đầy đủ thông tin: email khách hàng, tên khách hàng, tên dịch vụ, giá dịch vụ và mã giao dịch'
      });
    }

    console.log('=== CUSTOMER EMAIL SENDING DEBUG INFO ===');
    console.log('Customer Email:', customerEmail);
    console.log('Customer Name:', customerName);
    console.log('Service Name:', serviceName);
    console.log('Service Price:', servicePrice);
    console.log('Transaction ID:', transactionId);
    console.log('Email Config Available:', !!process.env.EMAIL_USER && !!process.env.EMAIL_PASS);

    // Send order confirmation email to customer
    const nodemailer = require('nodemailer');

    // Check if email configuration is available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email configuration missing - EMAIL_USER or EMAIL_PASS not set in environment variables');
      return res.status(500).json({
        msg: 'Cấu hình email chưa được thiết lập. Vui lòng kiểm tra lại biến môi trường EMAIL_USER và EMAIL_PASS.'
      });
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Verify transporter configuration
    try {
      await transporter.verify();
      console.log('Email transporter verified successfully');
    } catch (verifyError) {
      console.error('Email transporter verification failed:', verifyError);
      console.error('Email configuration details (for debugging):', {
        userEmail: process.env.EMAIL_USER,
        hasEmailPass: !!process.env.EMAIL_PASS,
        emailPassLength: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0,
        emailPassPreview: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.substring(0, 4) + '...' : 'N/A'
      });

      // Check if it's a common configuration issue
      if (!process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'mat_khau_ung_dung_gmail') {
        return res.status(500).json({
          msg: 'Cấu hình email chưa được thiết lập đúng. Vui lòng cập nhật EMAIL_PASS trong file .env với App Password thực tế từ Gmail.'
        });
      }

      return res.status(500).json({
        msg: `Xác thực email thất bại: ${verifyError.message}. Vui lòng kiểm tra lại cấu hình email.`
      });
    }

    const mailOptions = {
      from: `"Kế Toán Sen Vàng" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: `Xác nhận đơn hàng dịch vụ - ${serviceName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Xác nhận đơn hàng dịch vụ</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; border-bottom: 2px solid #FFD700; padding-bottom: 10px; margin-bottom: 20px;">
            <h1 style="color: #FFD700;">KẾ TOÁN SEN VÀNG</h1>
          </div>

          <div>
            <h2 style="color: #555;">Xác nhận đơn hàng dịch vụ</h2>
            <p>Cảm ơn quý khách đã đặt dịch vụ tại <strong>Kế Toán Sen Vàng</strong>.</p>
            <br>
            <h3>Thông tin đơn hàng:</h3>
            <p><strong>Mã đơn hàng:</strong> ${transactionId}</p>
            <p><strong>Dịch vụ:</strong> ${serviceName}</p>
            <p><strong>Giá tiền:</strong> ${servicePrice}</p>
            <p><strong>Khách hàng:</strong> ${customerName}</p>
            <p><strong>Thời gian đặt:</strong> ${new Date().toLocaleString('vi-VN')}</p>
            <br>
            <p>Chúng tôi sẽ liên hệ với quý khách trong thời gian sớm nhất để tiến hành xử lý đơn hàng.</p>
            <br>
            <p>Trân trọng,<br><strong>Đội ngũ Kế Toán Sen Vàng</strong></p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            <p><em>Lưu ý: Đây là email tự động, vui lòng không.reply lại email này.</em></p>
          </div>
        </body>
        </html>
      `
    };

    console.log('About to send customer email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    try {
      const result = await transporter.sendMail(mailOptions);
      console.log('Customer email sent successfully:', result);
      console.log(`Order confirmation email sent to: ${customerEmail}`);

      // Return success response
      res.json({
        msg: 'Email xác nhận đã được gửi thành công',
        emailSentTo: customerEmail,
        messageId: result.messageId
      });
    } catch (emailError) {
      console.error('Error sending customer email:', emailError);
      console.error('Email error details:', {
        message: emailError.message,
        code: emailError.code,
        response: emailError.response,
        responseCode: emailError.responseCode,
        command: emailError.command
      });

      // Return error response but still respond to client
      return res.status(500).json({
        msg: `Gửi email thất bại: ${emailError.message}. Vui lòng kiểm tra lại cấu hình email.`
      });
    }
  } catch (err) {
    console.error('Unexpected error in send-customer-order-confirmation:', err.message);
    res.status(500).json({ msg: `Lỗi máy chủ: ${err.message}` });
  }
});

module.exports = router;