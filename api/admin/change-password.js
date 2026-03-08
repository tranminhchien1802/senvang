// Vercel Serverless Function - Change Admin Password
const jwt = require('jsonwebtoken');
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

// Middleware to verify admin token
const verifyAdmin = async (req, res, next) => {
  const token = req.headers['x-auth-token'];

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    
    const Admin = getAdminModel();
    const admin = await Admin.findById(decoded.adminId);

    if (!admin) {
      return res.status(401).json({ msg: 'Admin not found' });
    }

    req.admin = admin;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ msg: 'Method not allowed' });
  }

  try {
    console.log('=== CHANGE PASSWORD FUNCTION ===');

    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ msg: 'MONGODB_URI not set' });
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Verify admin token
    await verifyAdmin(req, res, async () => {
      try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        // Validate required fields
        if (!currentPassword || !newPassword || !confirmPassword) {
          return res.status(400).json({
            msg: 'Vui lòng nhập đầy đủ mật khẩu hiện tại, mật khẩu mới và xác nhận mật khẩu'
          });
        }

        // Validate new password length
        if (newPassword.length < 6) {
          return res.status(400).json({
            msg: 'Mật khẩu mới phải có ít nhất 6 ký tự'
          });
        }

        // Validate confirm password
        if (newPassword !== confirmPassword) {
          return res.status(400).json({
            msg: 'Mật khẩu xác nhận không khớp với mật khẩu mới'
          });
        }

        // Find current admin
        const Admin = getAdminModel();
        const admin = await Admin.findById(req.admin._id);
        if (!admin) {
          return res.status(404).json({ msg: 'Admin không tồn tại' });
        }

        // Verify current password
        const isMatch = await admin.comparePassword(currentPassword);
        if (!isMatch) {
          return res.status(401).json({ msg: 'Mật khẩu hiện tại không đúng' });
        }

        // Update password
        admin.password = newPassword;
        await admin.save();

        console.log(`Password changed successfully for admin: ${admin.email}`);

        await mongoose.disconnect();

        res.json({
          msg: 'Đổi mật khẩu thành công',
          admin: {
            id: admin._id,
            username: admin.username,
            email: admin.email
          }
        });
      } catch (err) {
        console.error('Change password error:', err.message);
        res.status(500).json({
          msg: 'Server error',
          error: err.message
        });
      }
    });

  } catch (err) {
    console.error('Change password function error:', err.message);
    
    try {
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
