// middleware/corsHandler.js
const corsHandler = (req, res, next) => {
  // Allow ALL origins (for development and Vercel deployment)
  const origin = req.header('Origin');
  
  // Allow all origins
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Expose-Headers', 'Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }
  
  next();
};

module.exports = corsHandler;