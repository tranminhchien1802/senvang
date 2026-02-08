// API route for Google OAuth callback
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code not provided' });
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: `${req.headers.origin}/api/auth/callback`,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error('Failed to get access token:', tokenData);
      return res.status(400).json({ error: 'Failed to get access token' });
    }

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userInfo = await userInfoResponse.json();

    // In a real application, you would create/update the user in your database here
    // For now, we'll just return the user info as a simple token
    
    const user = {
      id: userInfo.id,
      googleId: userInfo.id,
      name: userInfo.name,
      email: userInfo.email,
      picture: userInfo.picture,
      verified_email: userInfo.verified_email,
    };

    // Create a simple token (in a real app, use proper JWT signing)
    const token = Buffer.from(JSON.stringify({
      ...user,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    })).toString('base64');

    // Return success response with token
    // For frontend to handle the authentication result
    res.status(200).json({ 
      success: true, 
      user,
      token,
      redirectUrl: `${req.headers.origin}/login-success?token=${encodeURIComponent(token)}`
    });
  } catch (error) {
    console.error('Error during Google OAuth callback:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}