// src/utils/api.js
import config from '../config/api';

class ApiClient {
  constructor() {
    // Determine the API base URL based on environment
    if (typeof window !== 'undefined') {
      // Browser environment
      this.baseURL = process.env.REACT_APP_API_URL || process.env.VITE_API_URL || '/api';
    } else {
      // Server environment
      this.baseURL = process.env.API_URL || 'http://localhost:5000/api';
    }
  }

  async request(endpoint, options = {}) {
    // Handle both absolute and relative URLs
    const isAbsoluteUrl = endpoint.startsWith('http');
    const url = isAbsoluteUrl ? endpoint : `${this.baseURL}${endpoint}`;
    
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