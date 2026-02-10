// API Configuration
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side (browser)
    // Use environment variable if available (for production with external backend)
    // Otherwise use Railway backend URL for production
    return import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? '' : 'https://senvang-backend-production.up.railway.app');
  } else {
    // Server-side (Node.js) - this shouldn't be reached in a typical React app
    // But fallback to Railway backend URL for production
    return '';
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
    GOOGLE_CALLBACK: `${API_BASE_URL}/api/auth/google/callback`,
    VERIFY: `${API_BASE_URL}/api/auth/verify`
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