require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

async function updateAdminPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the admin user
    const admin = await Admin.findOne({ email: 'chien180203@gmail.com' });
    
    if (!admin) {
      console.log('Admin user not found');
      return;
    }

    // Hash the new password
    const newPassword = '123';
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update the password
    admin.password = hashedPassword;
    await admin.save();

    console.log('Admin password updated successfully');
    console.log('Email:', admin.email);
    console.log('New Password:', newPassword);

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error updating admin password:', error);
  }
}

updateAdminPassword();