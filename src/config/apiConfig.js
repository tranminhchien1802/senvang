// API Configuration
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side (browser)
    const hostname = window.location.hostname;
    
    // Production on Vercel
    if (hostname.includes('vercel.app') || hostname === 'ketoansenvang.net' || hostname === 'www.ketoansenvang.net') {
      // Use the same domain for API (Vercel will route to backend)
      return window.location.origin;
    }
    
    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }
    
    // Default
    return '';
  }
  return '';
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
    GOOGLE_LOGIN: `${API_BASE_URL}/api/auth/google-login`,
    GOOGLE_CALLBACK: `${API_BASE_URL}/api/auth/google/callback`,
    VERIFY: `${API_BASE_URL}/api/auth/verify`
  },
  USERS: {
    PROFILE: `${API_BASE_URL}/api/users/profile`,
    UPDATE: `${API_BASE_URL}/api/users/update`
  },
  ADMIN: {
    LOGIN: `${API_BASE_URL}/api/admin/login`,
    ORDERS: `${API_BASE_URL}/api/admin/orders`,
    USERS: `${API_BASE_URL}/api/admin/users`,
    SEND_ORDER_CONFIRMATION: `${API_BASE_URL}/api/admin/send-order-confirmation`,
    CHANGE_PASSWORD: `${API_BASE_URL}/api/admin/change-password`
  },
  EMAIL: {
    SEND_CUSTOMER_ORDER_CONFIRMATION: `${API_BASE_URL}/api/admin/send-customer-order-confirmation`
  },
  BANNERS: {
    GET_ALL: `${API_BASE_URL}/api/banners`,
    CREATE: `${API_BASE_URL}/api/banners/create`
  }
};