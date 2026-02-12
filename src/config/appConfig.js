// File: src/config/appConfig.js
// Configuration for application behavior

// Toggle to enable/disable backend API calls
// Set to false to use only localStorage (offline mode)
// Set to true to use backend API when available
const USE_BACKEND_API = process.env.REACT_APP_USE_BACKEND_API !== 'false';

// Toggle to enable/disable CORS fallback
// Set to true to automatically fallback to localStorage when CORS errors occur
const ENABLE_CORS_FALLBACK = true;

// Maximum time to wait for backend response before falling back to localStorage (in ms)
const BACKEND_TIMEOUT = 5000; // 5 seconds

// API endpoints configuration
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || '',
  TIMEOUT: BACKEND_TIMEOUT
};

export {
  USE_BACKEND_API,
  ENABLE_CORS_FALLBACK,
  BACKEND_TIMEOUT,
  API_CONFIG
};