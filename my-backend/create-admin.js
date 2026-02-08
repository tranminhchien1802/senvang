// Script to create an initial admin account
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      email: { $in: ['chien180203@gmail.com', 'ketoansenvang.net@gmail.com'] }
    });

    if (existingAdmin) {
      console.log('Admin account already exists');
      console.log('Email:', existingAdmin.email);
      console.log('Username:', existingAdmin.username);
      await mongoose.connection.close();
      return;
    }

    // Create new admins
    const admin1 = new Admin({
      username: 'admin_user',
      email: 'chien180203@gmail.com',
      password: 'thanhtruc1', // This will be hashed by the pre-save hook
      role: 'admin'
    });

    const admin2 = new Admin({
      username: 'admin_user2',
      email: 'ketoansenvang.net@gmail.com',
      password: 'thanhtruc1', // This will be hashed by the pre-save hook
      role: 'admin'
    });

    await admin1.save();
    await admin2.save();
    console.log('Admin accounts created successfully');
    console.log('Emails: chien180203@gmail.com, ketoansenvang.net@gmail.com');
    console.log('Password: 123');
    
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error creating admin:', error);
  }
}

createAdmin();