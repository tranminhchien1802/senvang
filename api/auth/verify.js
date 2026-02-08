// API route for verifying Google token on the backend
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ error: 'Credential not provided' });
  }

  try {
    // Verify the Google token on the backend
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    const tokenInfo = await response.json();

    if (response.status !== 200) {
      return res.status(400).json({ error: 'Invalid token', details: tokenInfo });
    }

    // Verify that the token was issued for this app
    if (tokenInfo.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(400).json({ error: 'Invalid audience' });
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
    console.error('Error verifying Google token:', error);
    res.status(500).json({ error: 'Token verification failed' });
  }
}