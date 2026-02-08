// API route for Vercel
export default function handler(req, res) {
  res.status(200).json({ 
    status: 'OK', 
    message: 'API is running', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
}