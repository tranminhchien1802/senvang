// Vercel Serverless Function - Admin Login
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Simple in-memory cache for Admin model to avoid re-importing
let AdminModel = null;

const getAdminModel = () => {
  if (AdminModel) return AdminModel;
  
  const mongoose = require('mongoose');
  
  // Define Admin schema inline to avoid import issues
  const adminSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  });

  adminSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

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
    const mongoose = require('mongoose');
    
    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not set');
      return res.status(500).json({ msg: 'Server configuration error' });
    }
    
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
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
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
    console.error('Login error:', err.message);
    console.error('Stack:', err.stack);
    
    // Try to disconnect MongoDB on error
    try {
      const mongoose = require('mongoose');
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
    } catch (e) {
      // Ignore disconnect errors
    }
    
    res.status(500).json({ 
      msg: 'Server error',
      error: err.message 
    });
  }
};
