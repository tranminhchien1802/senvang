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

// Import security headers middleware
const securityHeaders = require('./middleware/securityHeaders');
app.use(securityHeaders);

// Enhanced CORS configuration
const cors = require('cors');
const corsOptions = {
  origin: function (origin, callback) {
    // Allow all origins in development
    if (process.env.NODE_ENV !== 'production') {
      callback(null, true);
      return;
    }
    
    // For production, allow specific origins
    // Check if NODE_ENV is properly set to 'production'
    console.log('NODE_ENV:', process.env.NODE_ENV); // Debug log
    console.log('Origin:', origin); // Debug log
    
    // Define allowed origins for production
    const allowedOrigins = [
      process.env.CLIENT_URL || 'https://yourdomain.com',
      'https://senvang-olive.vercel.app',
      'https://ketoansenvang.net',
      'https://www.ketoansenvang.net'
    ];
    
    // Check if origin is in allowed list or ends with .vercel.app
    const isAllowed = allowedOrigins.includes(origin) || 
                     (origin && origin.endsWith('.vercel.app'));
    
    console.log('Is origin allowed:', isAllowed); // Debug log
    callback(null, isAllowed);
  },
  credentials: true,
  optionsSuccessStatus: 200,
  // Additional headers to ensure proper CORS handling
  preflightContinue: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'x-auth-token']
};
app.use(cors(corsOptions));

// Handle preflight requests - now handled by cors middleware
// app.options('*', (req, res) => {
//   // Use wildcard for development, check origin for production
//   if (process.env.NODE_ENV !== 'production') {
//     res.header('Access-Control-Allow-Origin', '*');
//   } else {
//     const origin = req.header('Origin');
//     const allowedOrigins = [
//       process.env.CLIENT_URL || 'https://yourdomain.com',
//       'https://*.vercel.app',
//       'https://senvang-olive.vercel.app',
//       'https://ketoansenvang.net',
//       'https://www.ketoansenvang.net'
//     ];
    
//     // Check if origin matches any allowed pattern
//     const isAllowed = allowedOrigins.some(pattern => {
//       if (pattern.includes('*')) {
//         // Handle wildcard patterns like 'https://*.vercel.app'
//         const regexPattern = new RegExp(pattern.replace(/\*/g, '.*'));
//         return regexPattern.test(origin);
//       }
//       return origin === pattern;
//     });
    
//     if (isAllowed) {
//       res.header('Access-Control-Allow-Origin', origin);
//     } else {
//       // Fallback to first allowed origin if not matched
//       res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'https://yourdomain.com');
//     }
//   }
  
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.sendStatus(200);
// });

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