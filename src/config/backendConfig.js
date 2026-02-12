// Cấu hình backend cho các môi trường khác nhau
const getBackendUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side (browser)
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost') {
      // Development environment
      return 'http://localhost:5000/api';
    } else if (hostname.includes('vercel.app')) {
      // Vercel deployment - use Railway backend
      return 'https://senvang-backend-production.up.railway.app/api';
    } else {
      // Production environment on custom domain/hosting
      // You can customize this based on your actual hosting setup
      // For same-domain deployments, use relative path:
      // return '/api';
      
      // Or for separate backend server, replace with your actual backend URL:
      return 'https://your-backend-domain.com/api';
    }
  } else {
    // Server-side (Node.js) - this shouldn't be reached in a typical React app
    return '/api';
  }
};

export const BACKEND_API_URL = getBackendUrl();

export const getApiUrl = (endpoint) => {
  // If endpoint already includes the full API path, return as is
  if (endpoint.startsWith('http')) {
    return endpoint;
  }
  
  // Otherwise, prepend the backend URL
  return `${BACKEND_API_URL}${endpoint}`;
};