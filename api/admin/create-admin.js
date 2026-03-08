// Vercel Serverless Function - Create Admin (One-time setup)
// Call this endpoint ONCE to create initial admin account
// URL: https://your-domain.vercel.app/api/admin/create-admin

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

let AdminModel = null;

const getAdminModel = () => {
  if (AdminModel) return AdminModel;

  const adminSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
    createdAt: { type: Date, default: Date.now }
  });

  adminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });

  adminSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

  AdminModel = mongoose.model('Admin', adminSchema);
  return AdminModel;
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ msg: 'Method not allowed' });
  }

  try {
    console.log('=== CREATE ADMIN FUNCTION ===');

    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ msg: 'MONGODB_URI not set' });
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    const Admin = getAdminModel();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      email: { $in: ['admin@example.com', 'chien180203@gmail.com'] }
    });

    if (existingAdmin) {
      await mongoose.disconnect();
      return res.json({
        msg: 'Admin already exists',
        email: existingAdmin.email,
        username: existingAdmin.username
      });
    }

    // Create admin account
    // DEFAULT CREDENTIALS:
    // Email: admin@example.com
    // Password: Admin@123
    const admin = new Admin({
      username: 'Admin User',
      email: 'admin@example.com',
      password: 'Admin@123',
      role: 'admin'
    });

    await admin.save();
    console.log('Admin created:', admin.email);

    await mongoose.disconnect();

    res.json({
      msg: 'Admin created successfully',
      email: admin.email,
      username: admin.username,
      note: 'Please change password after first login!'
    });

  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({
      msg: 'Server error',
      error: err.message
    });
  }
};
