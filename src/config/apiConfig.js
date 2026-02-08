// API Configuration
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side (browser)
    // Use relative paths for Vercel deployment
    // Check if we're in production environment
    const isProduction = window.location.hostname.includes('vercel.app') || 
                        window.location.hostname.includes('ketoansenvang.net');
    
    if (isProduction) {
      // For production, use relative path which will route to Vercel Functions
      return '';
    } else {
      // For local development, use environment variable or default
      return import.meta.env.VITE_API_URL || process.env.VITE_API_URL || '';
    }
  } else {
    // Server-side (Node.js)
    // Use environment variable or default
    return process.env.API_BASE_URL || process.env.BACKEND_URL || '';
  }
};

export const API_BASE_URL = getApiBaseUrl();

// Export individual API endpoints
export const API_ENDPOINTS = {
  ORDERS: {
    CREATE: `${API_BASE_URL}/api/orders/create`,
    MY_ORDERS: `${API_BASE_URL}/api/orders/my-orders`
  },
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    GOOGLE_CALLBACK: `${API_BASE_URL}/api/auth/google/callback`
  },
  USERS: {
    PROFILE: `${API_BASE_URL}/api/users/profile`,
    UPDATE: `${API_BASE_URL}/api/users/update`
  },
  ADMIN: {
    ORDERS: `${API_BASE_URL}/api/admin/orders`,
    USERS: `${API_BASE_URL}/api/admin/users`,
    SEND_ORDER_CONFIRMATION: `${API_BASE_URL}/api/admin/send-order-confirmation`
  },
  BANNERS: {
    GET_ALL: `${API_BASE_URL}/api/banners`,
    CREATE: `${API_BASE_URL}/api/banners/create`
  }
};