// API route for checking environment configuration
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Check environment variables
  const config = {
    googleClientIdSet: !!process.env.GOOGLE_CLIENT_ID,
    googleClientId: process.env.GOOGLE_CLIENT_ID ? '[HIDDEN]' : null,
    googleClientSecretSet: !!process.env.GOOGLE_CLIENT_SECRET,
    environment: process.env.NODE_ENV || 'development',
    apiUrl: req.url,
    origin: req.headers.origin,
    host: req.headers.host,
    userAgent: req.headers['user-agent']
  };

  res.status(200).json(config);
}