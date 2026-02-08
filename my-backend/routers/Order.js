const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Order = require('../models/Order');
const User = require('../models/User');
const router = express.Router();

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  service: 'gmail', // Using Gmail service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Middleware to verify user token
const verifyUser = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    req.user = await User.findById(decoded.userId);
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Create a new order (no authentication required for public orders)
router.post('/create', async (req, res) => {
  try {
    console.log('Received order request:', req.body); // Debug log

    const { packageName, packagePrice, fullName, phone, email } = req.body;

    // Validate required fields
    if (!packageName || !packagePrice || !fullName || !phone || !email) {
      return res.status(400).json({ msg: 'Vui lòng cung cấp đầy đủ thông tin: tên gói, giá, họ tên, số điện thoại và email' });
    }

    // Generate unique transaction ID
    const transactionId = `TXN${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;

    // Generate a 6-digit captcha
    const captcha = Math.floor(100000 + Math.random() * 900000).toString();

    // In a real app, you would generate an actual QR code here
    // For now, we'll create a placeholder
    const paymentQrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${transactionId}`;
    const paymentDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    // Convert price string to number (e.g., "1.500.000đ" -> 1500000)
    const packagePriceNumber = parseInt(packagePrice.replace(/[^\d]/g, '')) || 0;

    console.log('Creating order with data:', {
      userId: null, // Explicitly setting to null for public orders
      packageName,
      packagePrice,
      packagePriceNumber,
      customerInfo: { fullName, phone, email },
      transactionId,
      captcha,
      paymentQrCode,
      paymentDeadline
    }); // Debug log

    const newOrder = new Order({
      userId: null, // Explicitly set to null for public orders
      packageName,
      packagePrice,
      packagePriceNumber,
      customerInfo: {
        fullName,
        phone,
        email
      },
      transactionId,
      captcha,
      paymentQrCode,
      paymentDeadline
    });

    const order = await newOrder.save();

    // Send order confirmation email to customer
    try {
      console.log('Attempting to send email...');
      console.log('Email configuration:', {
        hasEmailUser: !!process.env.EMAIL_USER,
        hasEmailPass: !!process.env.EMAIL_PASS
      });
      console.log('Order customer email:', order.customerInfo.email);

      // Check if email configuration is available
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const mailOptions = {
          from: `"Kế Toán Sen Vàng" <${process.env.EMAIL_USER}>`,
          to: order.customerInfo.email,
          subject: `Xác nhận đơn hàng dịch vụ - ${order.packageName}`,
          html: `
            <h2>Xác nhận đơn hàng dịch vụ</h2>
            <p>Cảm ơn quý khách đã đặt dịch vụ tại <strong>Kế Toán Sen Vàng</strong>.</p>
            <br>
            <h3>Thông tin đơn hàng:</h3>
            <p><strong>Mã đơn hàng:</strong> ${order.transactionId}</p>
            <p><strong>Dịch vụ:</strong> ${order.packageName}</p>
            <p><strong>Giá tiền:</strong> ${order.packagePrice}</p>
            <p><strong>Khách hàng:</strong> ${order.customerInfo.fullName}</p>
            <p><strong>Số điện thoại:</strong> ${order.customerInfo.phone}</p>
            <p><strong>Email:</strong> ${order.customerInfo.email}</p>
            <p><strong>Thời gian đặt:</strong> ${new Date(order.createdAt).toLocaleString('vi-VN')}</p>
            <br>
            <p>Chúng tôi sẽ liên hệ với quý khách trong thời gian sớm nhất để tiến hành xử lý đơn hàng.</p>
            <br>
            <p>Trân trọng,<br><strong>Đội ngũ Kế Toán Sen Vàng</strong></p>
            <hr>
            <p><em>Lưu ý: Đây là email tự động, vui lòng không.reply lại email này.</em></p>
          `
        };

        console.log('Sending email with options:', {
          from: mailOptions.from,
          to: mailOptions.to,
          subject: mailOptions.subject
        });

        const emailResult = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', emailResult);
        console.log(`Order confirmation email sent to: ${order.customerInfo.email}`);
      } else {
        console.log(`Email configuration missing. Would send order confirmation to: ${order.customerInfo.email}`);
      }
    } catch (emailErr) {
      console.error('Error sending order confirmation email:', emailErr);
      console.error('Email error details:', {
        message: emailErr.message,
        code: emailErr.code,
        response: emailErr.response,
        responseCode: emailErr.responseCode
      });
      // Don't fail the order creation if email fails
    }

    res.status(201).json({
      msg: 'Order created successfully',
      order: {
        id: order._id,
        packageName: order.packageName,
        packagePrice: order.packagePrice,
        transactionId: order.transactionId,
        captcha: order.captcha,
        paymentQrCode: order.paymentQrCode,
        paymentDeadline: order.paymentDeadline,
        createdAt: order.createdAt
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get user's orders
router.get('/my-orders', verifyUser, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;