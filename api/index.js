// Vercel Serverless Function - Catch-all for API routes
// This file handles all /api/* requests that don't have a specific handler

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

// Create Express app
const app = express();

// MongoDB connection - optional, don't fail if not connected
let mongoConnected = false;
const connectDB = async () => {
  if (!mongoConnected && process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      mongoConnected = true;
      console.log('✅ MongoDB connected');
    } catch (err) {
      console.error('❌ MongoDB connection error:', err.message);
    }
  }
};
connectDB();

// CORS - must allow all origins for admin panel
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

// Parse JSON
app.use(express.json());

// Debug logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  if (req.method === 'POST' && req.body) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Import all routes with error handling
try {
  const authRouter = require('../my-backend/routers/auth');
  const userRouter = require('../my-backend/routers/User');
  const adminRouter = require('../my-backend/routers/Admin');
  const orderRouter = require('../my-backend/routers/Order');
  const bannersRouter = require('../my-backend/routers/banners');
  const settingsRouter = require('../my-backend/routers/Settings');
  const uploadRouter = require('../my-backend/routers/upload');

  console.log('✅ All routes loaded successfully');

  // Use routes
  app.use('/api/auth', authRouter);
  app.use('/api/users', userRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/orders', orderRouter);
  app.use('/api/banners', bannersRouter);
  app.use('/api/settings', settingsRouter);
  app.use('/api/upload', uploadRouter);
} catch (err) {
  console.error('❌ Error loading routes:', err.message);
  console.error('Stack:', err.stack);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), mongoConnected });
});

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

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  console.log('⚠️ API endpoint not found:', req.path);
  res.status(404).json({ message: 'API endpoint not found', path: req.path });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Export for Vercel
module.exports = async (req, res) => {
  try {
    console.log('=== Serverless function invoked ===');
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('URL:', req.url);
    return app(req, res);
  } catch (err) {
    console.error('Serverless error:', err);
    res.status(500).json({
      message: 'Serverless function error',
      error: err.message
    });
  }
};
