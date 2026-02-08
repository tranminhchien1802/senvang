// API route for health check
export default function handler(req, res) {
  res.status(200).json({
    status: 'OK',
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    // Include Google OAuth configuration status
    googleAuth: {
      configured: !!process.env.GOOGLE_CLIENT_ID,
      clientIdPresent: !!process.env.GOOGLE_CLIENT_ID
    }
  });
}