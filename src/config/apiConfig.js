// API Configuration
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side (browser)
    // Use relative paths for Vercel deployment
    return '';
  } else {
    // Server-side (Node.js)
    // Use environment variable or default
    return process.env.API_BASE_URL || process.env.BACKEND_URL || 'http://localhost:5000';
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
    USERS: `${API_BASE_URL}/api/admin/users`
  },
  BANNERS: {
    GET_ALL: `${API_BASE_URL}/api/banners`,
    CREATE: `${API_BASE_URL}/api/banners/create`
  }
};