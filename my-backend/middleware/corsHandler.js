// middleware/corsHandler.js
const corsHandler = (req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    res.header('Access-Control-Allow-Origin', '*');
  } else {
    const origin = req.header('Origin');
    const allowedOrigins = [
      process.env.CLIENT_URL || 'https://yourdomain.com',
      'https://*.vercel.app',
      'https://senvang-olive.vercel.app',
      'https://ketoansenvang.net',
      'https://www.ketoansenvang.net'
    ];
    
    // Check if origin matches any allowed pattern
    const isAllowed = allowedOrigins.some(pattern => {
      if (pattern.includes('*')) {
        // Handle wildcard patterns like 'https://*.vercel.app'
        const regexPattern = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
        return regexPattern.test(origin);
      }
      return origin === pattern;
    });
    
    if (isAllowed) {
      res.header('Access-Control-Allow-Origin', origin);
    } else {
      // Fallback to first allowed origin if not matched
      res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'https://yourdomain.com');
    }
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
};

module.exports = corsHandler;