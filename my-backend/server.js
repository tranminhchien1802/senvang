const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Chỉ khai báo một lần ở đây
const session = require('express-session');
const path = require('path');
require('dotenv').config();
const config = require('./config/config');

const app = express();

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production' ? true : false,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport setup
const { passport } = require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// Import security headers middleware
const securityHeaders = require('./middleware/securityHeaders');
app.use(securityHeaders);

// Enhanced CORS configuration
app.options('*', cors()); // Handle preflight requests

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // List of allowed origins
    const allowedOrigins = [
      'https://senvang-eight.vercel.app',   // Your current Vercel domain
      'https://senvang-olive.vercel.app',   // Your Vercel domain
      'https://senvang-jef9.onrender.com',  // Your Render domain
      'http://localhost:5173',             // Vite dev server
      'http://localhost:3000',             // Common dev port
      'http://localhost:3001',             // Another common dev port
      'http://localhost:8080',             // Another common dev port
      process.env.CLIENT_URL,               // From environment variable
      config.clientUrl                      // From config file
    ].filter(Boolean); // Remove any undefined values

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`CORS blocked: ${origin} is not in allowed origins list`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
};
app.use(cors(corsOptions));

// COOP headers for Google OAuth popup
app.use((req, res, next) => {
  // Allow Google OAuth popup to communicate with parent window
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

// Additional headers to support OAuth flows
app.use((req, res, next) => {
  // Allow cross-origin requests for OAuth
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-auth-token");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());

// Serve static files from public directory (for built frontend)
// Add headers to static files to prevent COEP issues
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    // For SVG files, set appropriate headers to avoid COEP issues
    if (filePath.endsWith('.svg')) {
      res.set('Cross-Origin-Resource-Policy', 'cross-origin');
      res.set('Content-Security-Policy', "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; img-src 'self' data: https://*;");
    }
  }
}));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Kết nối MongoDB (không bắt buộc phải thành công)
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✅ Kết nối MongoDB thành công');
    } else {
      console.log('⚠️ Không tìm thấy MONGODB_URI, một số tính năng sẽ bị giới hạn');
    }
  } catch (err) {
    console.error('❌ Không thể kết nối MongoDB:', err.message);
    console.log('⚠️ Chạy ở chế độ giới hạn (một số tính năng không khả dụng)');
  }
};

connectDB();

// Test route to check if server is receiving requests
app.get('/test', (req, res) => {
  console.log('Test endpoint hit from:', req.header('Origin'));
  console.log('Request headers:', req.headers);
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    origin: req.header('Origin'),
    env: process.env.NODE_ENV,
    client_url: process.env.CLIENT_URL
  });
});

// Routes
app.use('/api/auth', require('./routers/auth')); // Add Google OAuth routes
app.use('/api/users', require('./routers/User'));
app.use('/api/admin', require('./routers/Admin'));
app.use('/api/orders', require('./routers/Order'));
app.use('/api/banners', require('./routers/banners'));
app.use('/api/settings', require('./routers/Settings'));
app.use('/api/upload', require('./routers/upload'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Backend hoạt động!', version: '1.0.0' });
});

// Catch-all route for SPA - should come after all API routes
app.get('*', (req, res) => {
  // Serve frontend for all non-API routes
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle 404 for API routes that don't exist
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API endpoint không tồn tại' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Lỗi server nội bộ', error: process.env.NODE_ENV === 'development' ? err.message : {} });
});

const PORT = process.env.PORT || config.port;
const server = app.listen(PORT, () => {
  const address = server.address();
  const host = address.address === '::' ? 'localhost' : address.address;
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  console.log(`🚀 Server chạy tại ${protocol}://${host}:${address.port}`);
  console.log(`🌍 Backend URL: ${protocol}://${host}:${address.port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;