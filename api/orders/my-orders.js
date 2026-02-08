import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// Import models
const OrderSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: null
  },
  packageName: String,
  packagePrice: String,
  packagePriceNumber: Number,
  customerInfo: {
    fullName: String,
    phone: String,
    email: String
  },
  transactionId: String,
  captcha: String,
  paymentQrCode: String,
  paymentDeadline: Date,
  status: {
    type: String,
    default: 'pending'
  }
}, {
  timestamps: true
});

const UserSchema = new mongoose.Schema({
  googleId: String,
  email: String,
  name: String,
  avatar: String,
  role: {
    type: String,
    default: 'user'
  }
}, {
  timestamps: true
});

const OrderModel = mongoose.models.Order || mongoose.model('Order', OrderSchema);
const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

// Middleware to verify user token
const verifyUser = async (req) => {
  const token = req.headers['x-auth-token'];
  if (!token) throw new Error('No token, authorization denied');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    const user = await UserModel.findById(decoded.userId);
    if (!user) throw new Error('User not found');
    return user;
  } catch (err) {
    throw new Error('Token is not valid');
  }
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ msg: 'Method not allowed' });
  }

  try {
    // Connect to MongoDB
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    // Verify user token
    let user;
    try {
      user = await verifyUser(req);
    } catch (err) {
      return res.status(401).json({ msg: err.message });
    }

    const orders = await OrderModel.find({ userId: user._id })
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};