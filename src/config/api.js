// src/config/api.js
const config = {
  // Base URL cho API calls
  BASE_API_URL: typeof window !== 'undefined' 
    ? process.env.REACT_APP_API_URL || window.location.origin + '/api'
    : process.env.API_URL || 'http://localhost:5000',
  
  // Google OAuth Client ID
  GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID,

  // EmailJS configuration
  EMAILJS_PUBLIC_KEY: process.env.REACT_APP_EMAILJS_PUBLIC_KEY || process.env.VITE_REACT_APP_EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID: process.env.REACT_APP_EMAILJS_SERVICE_ID || process.env.VITE_REACT_APP_SERVICE_ID,
  EMAILJS_TEMPLATE_ID: process.env.REACT_APP_EMAILJS_TEMPLATE_ID || process.env.VITE_REACT_APP_TEMPLATE_ID,
};

export default config;