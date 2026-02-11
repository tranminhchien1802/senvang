// src/utils/api.js
// In client-side only mode, we'll create a minimal API client that handles local storage operations
// and only makes actual API calls when backend is available

import { getApiBaseUrl } from '../config/apiConfig';

class ApiClient {
  constructor() {
    // Use centralized API configuration
    this.baseURL = getApiBaseUrl() ? `${getApiBaseUrl()}/api` : '/api';
  }

  async request(endpoint, options = {}) {
    // Handle both absolute and relative URLs
    const isAbsoluteUrl = endpoint.startsWith('http');
    const url = isAbsoluteUrl ? endpoint : `${this.baseURL}${endpoint}`;

    // For client-side only mode, we'll handle certain endpoints differently
    // Check if this is a Google login request
    if (endpoint.includes('/auth/google-login')) {
      // In client-side only mode, we don't make this request
      // Instead, we'll handle Google OAuth directly
      console.log('Google login handled client-side only, not calling backend');
      throw new Error('Google login should be handled client-side only');
    }

    // Check if this is a user login request
    if (endpoint.includes('/users/login')) {
      // In client-side only mode, we don't make this request
      console.log('User login handled client-side only, not calling backend');
      throw new Error('User login should be handled client-side only');
    }

    // For other requests, we'll proceed normally
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Handle different response types
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        return data;
      } else {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.text();
      }
    } catch (error) {
      console.error('API request failed:', error);
      // If it's a 404 error, we'll handle it as a client-side operation
      if (error.message.includes('404') || error.message.includes('Failed to fetch')) {
        console.log('Backend not available, falling back to client-side operations');
        // Return a success response for operations that can be handled client-side
        if (endpoint.includes('/auth/') || endpoint.includes('/users/')) {
          return { success: true, fallback: true, message: 'Handled client-side' };
        }
      }
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export default new ApiClient();