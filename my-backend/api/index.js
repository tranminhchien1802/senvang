// Vercel Serverless Function Entry Point
// This file serves as the main entry point for Vercel serverless functions

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

// Create Express app for serverless
const app = express();

// MongoDB connection for serverless - optional
let mongoConnected = false;
const connectDB = async () => {
  if (!mongoConnected && process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      mongoConnected = true;
      console.log('✅ MongoDB connected');
    } catch (err) {
      console.error('❌ MongoDB connection error:', err.message);
      // Don't throw - allow serverless to continue without MongoDB
    }
  }
};
connectDB();

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

// Parse JSON bodies
app.use(express.json());

// Debug endpoint
app.get('/api/debug', (req, res) => {
  res.json({
    status: 'OK',
    mongoConnected,
    env: {
      MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
      JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV
    }
  });
});

// Import all routes with error handling
try {
  const authRouter = require('../routers/auth');
  const userRouter = require('../routers/User');
  const adminRouter = require('../routers/Admin');
  const orderRouter = require('../routers/Order');
  const bannersRouter = require('../routers/banners');
  const settingsRouter = require('../routers/Settings');
  const uploadRouter = require('../routers/upload');

  // Use routes
  app.use('/api/auth', authRouter);
  app.use('/api/users', userRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/orders', orderRouter);
  app.use('/api/banners', bannersRouter);
  app.use('/api/settings', settingsRouter);
  app.use('/api/upload', uploadRouter);
} catch (err) {
  console.error('Error loading routes:', err.message);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), mongoConnected });
});

// API 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: process.env.NODE_ENV === 'development' ? err.message : {},
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Export for Vercel
module.exports = async (req, res) => {
  try {
    return app(req, res);
  } catch (err) {
    console.error('Serverless function error:', err);
    res.status(500).json({ 
      message: 'Serverless function error',
      error: err.message 
    });
  }
};
