// my-backend/config/config.js
require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/senvang',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_here',
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '937635642814-9h3k7st6fojq02qvaicof52tqng6he97.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your_google_client_secret',
  },
  corsOrigin: process.env.CORS_ORIGIN || '*',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};

module.exports = config;