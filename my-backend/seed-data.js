const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Order = require('./models/Order');
const Admin = require('./models/Admin');

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/my-react-db')
  .then(async () => {
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Order.deleteMany({});
    await Admin.deleteMany({});
    
    console.log('Cleared existing data');

    // Create sample users
    const users = [
      {
        name: "Nguyễn Văn A",
        email: "nguyenvana@email.com",
        password: "123456", // This will be hashed by the pre-save middleware
        phone: "0123456789"
      },
      {
        name: "Trần Thị B",
        email: "tranthib@email.com",
        password: "123456",
        phone: "0987654321"
      },
      {
        name: "Lê Văn C",
        email: "levanc@email.com",
        password: "123456",
        phone: "0901234567"
      }
    ];

    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.name} (${user.email})`);
    }

    // Create sample orders
    const orders = [
      {
        userId: createdUsers[0]._id,
        orderType: 'registration',
        customerInfo: {
          fullName: "Nguyễn Văn A",
          phone: "0123456789",
          email: "nguyenvana@email.com"
        },
        status: 'completed',
        transactionId: `REG${Date.now()}1001`,
        packagePrice: 'Miễn phí',
        packagePriceNumber: 0,
        packageName: 'Đăng ký tài khoản'
      },
      {
        userId: createdUsers[0]._id,
        orderType: 'package',
        packageName: 'CƠ BẢN',
        packagePrice: '2.500.000đ',
        packagePriceNumber: 2500000,
        customerInfo: {
          fullName: "Nguyễn Văn A",
          phone: "0123456789",
          email: "nguyenvana@email.com"
        },
        status: 'paid',
        transactionId: `TXN${Date.now()}1001`
      },
      {
        userId: createdUsers[1]._id,
        orderType: 'registration',
        customerInfo: {
          fullName: "Trần Thị B",
          phone: "0987654321",
          email: "tranthib@email.com"
        },
        status: 'completed',
        transactionId: `REG${Date.now()}1002`,
        packagePrice: 'Miễn phí',
        packagePriceNumber: 0,
        packageName: 'Đăng ký tài khoản'
      },
      {
        userId: createdUsers[1]._id,
        orderType: 'package',
        packageName: 'TIÊU CHUẨN',
        packagePrice: '4.500.000đ',
        packagePriceNumber: 4500000,
        customerInfo: {
          fullName: "Trần Thị B",
          phone: "0987654321",
          email: "tranthib@email.com"
        },
        status: 'pending',
        transactionId: `TXN${Date.now()}1002`
      },
      {
        userId: createdUsers[2]._id,
        orderType: 'registration',
        customerInfo: {
          fullName: "Lê Văn C",
          phone: "0901234567",
          email: "levanc@email.com"
        },
        status: 'completed',
        transactionId: `REG${Date.now()}1003`,
        packagePrice: 'Miễn phí',
        packagePriceNumber: 0,
        packageName: 'Đăng ký tài khoản'
      },
      {
        userId: createdUsers[2]._id,
        orderType: 'package',
        packageName: 'VIP TOÀN DIỆN',
        packagePrice: '12.000.000đ',
        packagePriceNumber: 12000000,
        customerInfo: {
          fullName: "Lê Văn C",
          phone: "0901234567",
          email: "levanc@email.com"
        },
        status: 'paid',
        transactionId: `TXN${Date.now()}1003`
      }
    ];

    for (const orderData of orders) {
      const order = new Order(orderData);
      await order.save();
      console.log(`Created order: ${order.transactionId} for ${order.customerInfo.fullName}`);
    }

    // Create sample admin
    const admin = new Admin({
      username: 'admin',
      email: 'admin@ketoansenvang.com',
      password: 'admin123' // This will be hashed
    });
    
    await admin.save();
    console.log(`Created admin: ${admin.username} (${admin.email})`);

    console.log('\n=== SAMPLE DATA CREATED SUCCESSFULLY ===');
    console.log(`Users created: ${createdUsers.length}`);
    console.log(`Orders created: ${orders.length}`);
    console.log('Admin created: 1');
    console.log('\nYou can now access the admin panel with:');
    console.log('Email: admin@ketoansenvang.com');
    console.log('Password: admin123');

    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });