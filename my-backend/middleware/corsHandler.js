// middleware/corsHandler.js
const corsHandler = (req, res, next) => {
  // Allow all origins in development
  if (process.env.NODE_ENV !== 'production') {
    res.header('Access-Control-Allow-Origin', '*');
  } else {
    // Production: Check if origin is in allowed list
    const origin = req.header('Origin');
    
    // Define allowed origins
    const allowedOrigins = [
      process.env.CLIENT_URL || 'https://yourdomain.com',
      'https://senvang-olive.vercel.app',
      'https://ketoansenvang.net',
      'https://www.ketoansenvang.net'
    ];
    
    // Check if the origin matches any of the allowed origins
    const isAllowed = allowedOrigins.includes(origin) || 
                     (origin && origin.endsWith('.vercel.app')); // Allow any vercel.app subdomain
    
    if (isAllowed && origin) {
      res.header('Access-Control-Allow-Origin', origin);
    } else {
      // Fallback to CLIENT_URL or default domain
      res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'https://yourdomain.com');
    }
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
};

module.exports = corsHandler;