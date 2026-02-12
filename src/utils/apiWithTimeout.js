// File: src/utils/apiWithTimeout.js
// API utilities with timeout and fallback capabilities

import { API_CONFIG } from '../config/appConfig';

/**
 * Fetch with timeout
 */
export const fetchWithTimeout = async (url, options = {}, timeout = API_CONFIG.TIMEOUT) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
};

/**
 * API call with fallback to localStorage
 */
export const apiCallWithFallback = async (apiCallFn, fallbackFn, options = {}) => {
  const { enableCORSFallback = true, useBackend = true } = options;
  
  if (!useBackend) {
    // Skip backend call entirely, use only fallback
    return await fallbackFn();
  }
  
  try {
    // Try the API call
    const result = await apiCallFn();
    return result;
  } catch (error) {
    console.warn('API call failed, using fallback:', error.message);
    
    if (enableCORSFallback) {
      // Check if this is a CORS/network error
      if (error.name === 'TypeError' || 
          error.message.includes('Failed to fetch') || 
          error.message.includes('CORS') ||
          error.message.includes('timeout')) {
        // Use fallback mechanism
        try {
          return await fallbackFn();
        } catch (fallbackError) {
          console.error('Both API and fallback failed:', fallbackError);
          throw error; // Re-throw original error
        }
      }
    }
    
    // If not a CORS/network error, or fallback is disabled, re-throw original error
    throw error;
  }
};

/**
 * Upload image with fallback
 */
export const uploadImageWithFallback = async (file, endpoint, token, fallbackFn) => {
  const { USE_BACKEND_API, ENABLE_CORS_FALLBACK } = await import('../config/appConfig');

  if (!USE_BACKEND_API) {
    // Use only fallback
    console.log('Backend API disabled, using fallback for image upload');
    return await fallbackFn();
  }

  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', 'logo');

    const { getApiUrl } = await import('../config/backendConfig');
    const apiUrl = getApiUrl(endpoint);

    const response = await fetchWithTimeout(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-auth-token': token
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.warn('Image upload failed, using fallback:', error.message);

    if (ENABLE_CORS_FALLBACK) {
      try {
        return await fallbackFn();
      } catch (fallbackError) {
        console.error('Both upload and fallback failed:', fallbackError);
        throw error; // Re-throw original error
      }
    }

    throw error;
  }
};

/**
 * Get data with fallback
 */
export const getDataWithFallback = async (endpoint, fallbackFn) => {
  const { USE_BACKEND_API, ENABLE_CORS_FALLBACK } = await import('../config/appConfig');
  
  if (!USE_BACKEND_API) {
    // Use only fallback
    return await fallbackFn();
  }
  
  try {
    const { getApiUrl } = await import('../config/backendConfig');
    const apiUrl = getApiUrl(endpoint);
    
    const response = await fetchWithTimeout(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    let result;
    
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      const text = await response.text();
      try {
        result = JSON.parse(text);
      } catch (parseError) {
        console.warn('Non-JSON response from backend:', text);
        throw new Error('Invalid response format from backend');
      }
    }
    
    return result;
  } catch (error) {
    console.warn('Get data failed, using fallback:', error.message);
    
    if (ENABLE_CORS_FALLBACK) {
      try {
        return await fallbackFn();
      } catch (fallbackError) {
        console.error('Both get and fallback failed:', fallbackError);
        throw error; // Re-throw original error
      }
    }
    
    throw error;
  }
};