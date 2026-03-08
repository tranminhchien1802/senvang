// Vercel Serverless Function - Catch-all for API routes
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// Create Express app
const express = require('express');
const app = express();

// MongoDB connection
const mongoose = require('mongoose');
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

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

// Parse JSON
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Load routes one by one with error handling
const loadRoute = (path, routerName) => {
  try {
    const router = require(path);
    return router;
  } catch (err) {
    console.error(`❌ Failed to load ${routerName}:`, err.message);
    return null;
  }
};

// Try to load all routers
const routers = {
  auth: loadRoute('../my-backend/routers/auth', 'auth router'),
  users: loadRoute('../my-backend/routers/User', 'User router'),
  admin: loadRoute('../my-backend/routers/Admin', 'Admin router'),
  orders: loadRoute('../my-backend/routers/Order', 'Order router'),
  banners: loadRoute('../my-backend/routers/banners', 'banners router'),
  settings: loadRoute('../my-backend/routers/Settings', 'Settings router'),
  upload: loadRoute('../my-backend/routers/upload', 'upload router')
};

// Register routes that loaded successfully
if (routers.auth) app.use('/api/auth', routers.auth);
if (routers.users) app.use('/api/users', routers.users);
if (routers.admin) app.use('/api/admin', routers.admin);
if (routers.orders) app.use('/api/orders', routers.orders);
if (routers.banners) app.use('/api/banners', routers.banners);
if (routers.settings) app.use('/api/settings', routers.settings);
if (routers.upload) app.use('/api/upload', routers.upload);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(), 
    mongoConnected,
    routesLoaded: Object.keys(routers).filter(k => routers[k]).length
  });
});

// Debug endpoint
app.get('/api/debug', (req, res) => {
  res.json({
    status: 'OK',
    mongoConnected,
    routesLoaded: Object.keys(routers).filter(k => routers[k]).length,
    env: {
      MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
      JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV
    }
  });
});

// 404 handler
app.use('/api/*', (req, res) => {
  console.log('⚠️ API endpoint not found:', req.path);
  res.status(404).json({ message: 'API endpoint not found', path: req.path });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    message: 'Internal server error',
    error: err.message
  });
});

// Vercel serverless handler
module.exports = async (req, res) => {
  try {
    console.log('=== Serverless function invoked ===');
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('URL:', req.url);
    
    // Connect to MongoDB before handling request
    await connectDB();
    
    return app(req, res);
  } catch (err) {
    console.error('Serverless error:', err);
    
    // Disconnect MongoDB
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
    } catch (e) {
      // Ignore disconnect errors
    }
    
    res.status(500).json({
      message: 'Serverless function error',
      error: err.message
    });
  }
};
