// API route for verifying Google token on the backend
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

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check if Google OAuth is configured
    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error('GOOGLE_CLIENT_ID is not set in environment variables');
      return res.status(500).json({ 
        error: 'Google OAuth is not configured',
        details: 'Missing GOOGLE_CLIENT_ID environment variable'
      });
    }

    // Parse request body
    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return res.status(400).json({ error: 'Invalid request body', details: parseError.message });
    }

    const { credential } = body;

    if (!credential) {
      return res.status(400).json({ error: 'Credential not provided' });
    }

    // Verify the Google token on the backend
    const tokenResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    const tokenInfo = await tokenResponse.json();

    if (tokenResponse.status !== 200) {
      console.error('Google token verification failed:', tokenInfo);
      return res.status(400).json({ error: 'Invalid token', details: tokenInfo });
    }

    // Verify that the token was issued for this app
    if (tokenInfo.aud !== process.env.GOOGLE_CLIENT_ID) {
      console.error('Invalid audience:', { 
        token_aud: tokenInfo.aud, 
        env_aud: process.env.GOOGLE_CLIENT_ID 
      });
      return res.status(400).json({ 
        error: 'Invalid audience',
        details: {
          received: tokenInfo.aud,
          expected: process.env.GOOGLE_CLIENT_ID
        }
      });
    }

    // Process the authenticated user
    const user = {
      id: tokenInfo.sub,
      googleId: tokenInfo.sub,
      name: tokenInfo.name,
      email: tokenInfo.email,
      picture: tokenInfo.picture,
      email_verified: tokenInfo.email_verified,
    };

    // In a real application, you would create/update the user in your database here
    // For now, we'll just return the user info as a simple token
    
    const token = Buffer.from(JSON.stringify({
      ...user,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    })).toString('base64');

    res.status(200).json({ 
      success: true, 
      user,
      token 
    });
  } catch (error) {
    console.error('Error in Google token verification API:', error);
    res.status(500).json({ 
      error: 'Token verification failed', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}