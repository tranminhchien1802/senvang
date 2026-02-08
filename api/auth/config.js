// API route for testing Google OAuth configuration
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Check if Google OAuth is properly configured
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!googleClientId || !googleClientSecret) {
    return res.status(500).json({
      error: 'Google OAuth not configured',
      details: {
        clientIdPresent: !!googleClientId,
        clientSecretPresent: !!googleClientSecret
      }
    });
  }

  // Try to make a simple request to Google to verify the credentials
  try {
    // This is just to verify the client ID format
    const isValidClientId = googleClientId.includes('.apps.googleusercontent.com');
    
    res.status(200).json({
      configured: true,
      clientIdValid: isValidClientId,
      clientId: googleClientId ? '[SET]' : '[MISSING]',
      clientSecret: googleClientSecret ? '[SET]' : '[MISSING]',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking Google OAuth config:', error);
    res.status(500).json({
      error: 'Configuration check failed',
      details: error.message
    });
  }
}