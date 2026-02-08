const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Order = require('./models/Order');
const LoginActivity = require('./models/LoginActivity');

// Connect to database
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('=== KIỂM TRA DỮ LIỆU TRONG CSDL ===\n');

    // Count users
    const userCount = await User.countDocuments();
    console.log(`Tổng số người dùng: ${userCount}`);

    if (userCount > 0) {
      console.log('\n--- THÔNG TIN MỘT SỐ NGƯỜI DÙNG ---');
      const users = await User.find().limit(5);
      users.forEach(user => {
        console.log(`ID: ${user._id}`);
        console.log(`Tên: ${user.name}`);
        console.log(`Email: ${user.email}`);
        console.log(`Số điện thoại: ${user.phone || 'N/A'}`);
        console.log(`Ngày tạo: ${user.createdAt}`);
        console.log('-------------------');
      });
    }

    // Count orders
    const orderCount = await Order.countDocuments();
    console.log(`\nTổng số đơn hàng: ${orderCount}`);

    // Count login activities
    const loginActivityCount = await LoginActivity.countDocuments();
    console.log(`Tổng số hoạt động đăng nhập: ${loginActivityCount}`);

    if (loginActivityCount > 0) {
      console.log('\n--- MỘT SỐ HOẠT ĐỘNG ĐĂNG NHẬP GẦN ĐÂY ---');
      const activities = await LoginActivity.find().sort({ loginTime: -1 }).limit(5);
      activities.forEach(activity => {
        console.log(`Tên: ${activity.name}`);
        console.log(`Email: ${activity.email}`);
        console.log(`IP: ${activity.ip || 'N/A'}`);
        console.log(`Thời gian: ${activity.loginTime}`);
        console.log('-------------------');
      });
    }

    console.log('\n=== KIỂM TRA HOÀN TẤT ===');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });