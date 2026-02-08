const mongoose = require('mongoose');
require('dotenv').config();

// Import Admin model
const Admin = require('./models/Admin');

// Connect to database
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: '24810106@student.hcmute.edu.vn' });
    
    if (existingAdmin) {
      console.log('Admin với email này đã tồn tại');
      console.log('Thông tin hiện tại:');
      console.log(`ID: ${existingAdmin._id}`);
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Username: ${existingAdmin.username}`);
      console.log(`Ngày tạo: ${existingAdmin.createdAt}`);
      
      // Ask if user wants to update password
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      readline.question('Bạn có muốn cập nhật mật khẩu không? (y/n): ', async (answer) => {
        if (answer.toLowerCase() === 'y') {
          readline.question('Nhập mật khẩu mới: ', async (newPassword) => {
            existingAdmin.password = newPassword;
            await existingAdmin.save();
            console.log('Mật khẩu đã được cập nhật!');
            readline.close();
            mongoose.connection.close();
          });
        } else {
          readline.close();
          mongoose.connection.close();
        }
      });
    } else {
      // Check if admin with old email exists
      const oldAdmin = await Admin.findOne({ email: 'admin@ketoansenvang.com' });
      
      if (oldAdmin) {
        // Update the old admin to use new email
        oldAdmin.email = '24810106@student.hcmute.edu.vn';
        await oldAdmin.save();
        console.log('✅ Đã cập nhật tài khoản admin với email mới!');
        console.log(`Email: ${oldAdmin.email}`);
        console.log(`ID: ${oldAdmin._id}`);
        console.log(`Username: ${oldAdmin.username || 'admin'}`);
      } else {
        // Create new admin
        const newAdmin = new Admin({
          username: 'admin_hcmute',
          email: '24810106@student.hcmute.edu.vn',
          password: 'admin123' // This will be hashed by the pre-save middleware
        });

        await newAdmin.save();
        console.log('✅ Tạo tài khoản admin mới thành công!');
        console.log(`Email: ${newAdmin.email}`);
        console.log(`ID: ${newAdmin._id}`);
        console.log(`Username: ${newAdmin.username}`);
      }
      
      mongoose.connection.close();
    }
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });