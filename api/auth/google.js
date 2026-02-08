// API route for Google OAuth login
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Check if Google OAuth is configured
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(400).json({
      msg: 'Google OAuth chưa được cấu hình. Vui lòng liên hệ quản trị viên để cập nhật GOOGLE_CLIENT_ID và GOOGLE_CLIENT_SECRET.'
    });
  }

  // Get the origin of the requesting site
  const origin = req.headers.origin || req.headers.host;
  
  // Construct the Google OAuth URL
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${origin}/api/auth/callback`)}&response_type=code&scope=profile email`;

  // Redirect to Google OAuth
  res.writeHead(307, { Location: googleAuthUrl });
  res.end();
}