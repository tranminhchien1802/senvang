// API route for handling authentication in Vercel
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  // Handle different auth actions
  switch (action) {
    case 'google':
      // Redirect to Google OAuth
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const redirectUri = `${request.headers.get('origin')}/api/auth/callback`;
      const scope = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
      
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`;
      
      return NextResponse.redirect(googleAuthUrl);
    
    case 'callback':
      // Handle Google OAuth callback
      const code = searchParams.get('code');
      if (code) {
        try {
          // Exchange code for tokens
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
              redirect_uri: `${request.headers.get('origin')}/api/auth/callback`,
            }),
          });
          
          const tokenData = await tokenResponse.json();
          
          if (tokenData.access_token) {
            // Get user info from Google
            const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
              headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
              },
            });
            
            const userInfo = await userInfoResponse.json();
            
            // Create a simple session token (in a real app, you'd use a more secure method)
            const sessionToken = Buffer.from(
              JSON.stringify({
                ...userInfo,
                exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
              })
            ).toString('base64');
            
            // Set cookie and redirect to frontend
            const response = NextResponse.redirect(`${request.headers.get('origin')}/login-success`);
            response.cookies.set('session', sessionToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              maxAge: 60 * 60 * 24 * 7, // 1 week
              path: '/',
            });
            
            return response;
          }
        } catch (error) {
          console.error('Error during Google OAuth callback:', error);
          return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
        }
      }
      break;
    
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}

export async function POST(request) {
  const body = await request.json();
  const { credential } = body;
  
  // Verify Google token
  try {
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    const tokenInfo = await response.json();
    
    if (tokenInfo.aud !== process.env.GOOGLE_CLIENT_ID) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }
    
    // Process the authenticated user
    const user = {
      id: tokenInfo.sub,
      name: tokenInfo.name,
      email: tokenInfo.email,
      picture: tokenInfo.picture,
    };
    
    // In a real app, you would create or update the user in your database here
    
    return NextResponse.json({ 
      success: true, 
      user,
      // Create a simple session token
      token: Buffer.from(
        JSON.stringify({
          ...user,
          exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        })
      ).toString('base64')
    });
  } catch (error) {
    console.error('Error verifying Google token:', error);
    return NextResponse.json({ error: 'Token verification failed' }, { status: 500 });
  }
}