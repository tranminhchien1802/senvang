# Google OAuth 2.0 Setup Guide

This guide explains how to properly configure Google OAuth 2.0 for your application to fix the "Access blocked: Authorisation error" and "origin_mismatch" issues.

## Prerequisites

- A Google account
- Access to Google Cloud Console
- Your deployed application URL

## Step-by-Step Instructions

### 1. Create a Google Cloud Project (if you don't have one)

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on "Select a project" at the top
3. Click "New Project"
4. Enter a project name (e.g., "SenVang-Website")
5. Click "Create"

### 2. Enable the Google+ API

1. In your project dashboard, search for "Google+ API"
2. Click on "Google+ API"
3. Click "Enable"

### 3. Create OAuth 2.0 Client ID

1. In the left sidebar, click "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. If prompted, set up the OAuth consent screen first:
   - Choose "External" user type
   - Fill in the app name (e.g., "Sen Vang Website")
   - Add your email to user support email
   - Add your email to developer contact information
   - Click "Save and Continue"
   - Skip adding scopes for now and click "Save and Continue"
   - In test users, add any emails that need access during testing
   - Click "Save and Continue" to submit

### 4. Configure Authorized Origins and Redirect URIs

When creating your OAuth 2.0 client ID, you'll need to specify authorized origins and redirect URIs:

**Application Type:** Web Application

**Authorized JavaScript Origins:**
- `http://localhost:5173` (for development)
- `http://localhost:4173` (alternative Vite port)
- `https://yourdomain.com` (replace with your actual domain)
- `https://www.yourdomain.com` (replace with your actual domain)
- `https://your-project-name.vercel.app` (if using Vercel)
- `https://your-project-name.pages.dev` (if using Cloudflare Pages)
- `https://your-project-name.onrender.com` (if using Render)

**Authorized Redirect URIs:**
- `http://localhost:5173` (for development)
- `http://localhost:4173` (alternative Vite port)
- `https://yourdomain.com` (replace with your actual domain)
- `https://www.yourdomain.com` (replace with your actual domain)
- `https://your-project-name.vercel.app` (if using Vercel)
- `https://your-project-name.pages.dev` (if using Cloudflare Pages)
- `https://your-project-name.onrender.com` (if using Render)

### 5. Get Your Client ID

After creating the OAuth 2.0 client ID, you'll receive:
- Client ID (copy this value)
- Client Secret (store securely, though not needed for frontend-only apps)

### 6. Update Environment Variables

1. Copy your Client ID from Google Cloud Console
2. Update your `.env` file:
   ```bash
   # Google OAuth Configuration
   VITE_GOOGLE_CLIENT_ID=your_actual_google_client_id_here
   ```
3. Make sure to restart your development server after making changes

### 7. Deploy Updated Configuration

When deploying to production:
1. Update your hosting platform's environment variables with the new Google Client ID
2. Redeploy your application

## Common Issues and Solutions

### Origin Mismatch Error
- Ensure all domains where your app runs are listed in "Authorized JavaScript Origins"
- For local development, make sure `http://localhost:5173` is included
- For deployed sites, ensure the exact domain (with or without www) is included

### Authorization Error
- Check that your OAuth consent screen is properly configured
- Ensure your app is published (not in testing mode) if you want it accessible to all users
- Verify that your client ID is correctly added to your environment variables

## Testing Your Configuration

1. Restart your development server: `npm run dev`
2. Open your browser to `http://localhost:5173`
3. Try logging in with Google
4. Check the browser console for any error messages

## Security Notes

- Never expose your Client Secret in frontend code
- Keep your Client ID secure but it's safe to include in frontend builds
- Regularly review the authorized origins and redirect URIs
- Monitor your API usage in Google Cloud Console