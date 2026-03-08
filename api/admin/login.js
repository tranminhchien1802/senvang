// Vercel Serverless Function - Admin Login
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Simple in-memory cache for Admin model
let AdminModel = null;

const getAdminModel = () => {
  if (AdminModel) return AdminModel;

  const adminSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  });

  adminSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

  adminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });

  AdminModel = mongoose.model('Admin', adminSchema);
  return AdminModel;
};

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ msg: 'Method not allowed' });
  }

  try {
    console.log('=== ADMIN LOGIN FUNCTION INVOKED ===');
    console.log('Request method:', req.method);
    console.log('Request body:', JSON.stringify(req.body));

    // Check environment variables
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is NOT SET!');
      return res.status(500).json({
        msg: 'Thiếu cấu hình MongoDB. Vui lòng kiểm tra MONGODB_URI trong environment variables.',
        debug: {
          MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
          JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET'
        }
      });
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected in login function');

    const { email, password } = req.body;

    console.log('Login attempt for:', email);

    if (!email || !password) {
      return res.status(400).json({
        msg: 'Vui lòng cung cấp email và mật khẩu'
      });
    }

    const Admin = getAdminModel();
    const admin = await Admin.findOne({ email });

    if (!admin) {
      console.log('Admin not found for email:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      console.log('Password mismatch for email:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT token
    const payload = { adminId: admin._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'default_secret', { expiresIn: '7d' });

    console.log('✅ Login successful for:', email);

    // Disconnect MongoDB
    await mongoose.disconnect();

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
    console.error('❌ Login error:', err.message);
    console.error('Stack:', err.stack);

    // Try to disconnect MongoDB on error
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
    } catch (e) {
      // Ignore disconnect errors
    }

    res.status(500).json({
      msg: 'Server error: ' + err.message,
      error: err.message
    });
  }
};
