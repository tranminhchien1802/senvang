const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
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

// CORS configuration - unified approach
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? [
        process.env.CLIENT_URL || 'https://yourdomain.com',
        'https://*.vercel.app',
        'https://senvang-olive.vercel.app',
        'https://ketoansenvang.net',
        'https://www.ketoansenvang.net'
      ]
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173', 'http://localhost:5174'],
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// Import security headers middleware
const securityHeaders = require('./middleware/securityHeaders');
app.use(securityHeaders);

// Handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' ? 
    (process.env.CLIENT_URL || 'https://yourdomain.com') : '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

app.use(express.json());

// Serve static files from public directory (for built frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Kết nối MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Kết nối MongoDB thành công');
  } catch (err) {
    console.error('❌ Lỗi kết nối MongoDB:', err);
    process.exit(1); // Exit process with failure
  }
};

connectDB();

// Routes
app.use('/api/auth', require('./routers/auth')); // Add Google OAuth routes
app.use('/api/users', require('./routers/User'));
app.use('/api/admin', require('./routers/Admin'));
app.use('/api/orders', require('./routers/Order'));
app.use('/api/banners', require('./routers/banners'));

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