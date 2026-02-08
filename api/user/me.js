// API route for getting current user session
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // In a real application, you would validate the session token here
  // For now, we'll just return a mock user if a session exists
  
  const sessionToken = req.cookies.session || req.headers.authorization?.replace('Bearer ', '');
  
  if (!sessionToken) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    // Decode the session token (in a real app, validate JWT properly)
    const sessionData = JSON.parse(Buffer.from(sessionToken, 'base64').toString());
    
    // Check if token is expired
    if (sessionData.exp && sessionData.exp < Date.now()) {
      return res.status(401).json({ authenticated: false, error: 'Token expired' });
    }

    res.status(200).json({ 
      authenticated: true, 
      user: {
        id: sessionData.id,
        name: sessionData.name,
        email: sessionData.email,
        picture: sessionData.picture
      }
    });
  } catch (error) {
    console.error('Error decoding session token:', error);
    res.status(401).json({ authenticated: false, error: 'Invalid session token' });
  }
}