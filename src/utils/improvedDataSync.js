// File: src/utils/improvedDataSync.js
// Improved data synchronization utility to handle cross-browser and cross-tab data persistence

const MASTER_DATA_KEY = 'master_website_data_v2';
const SYNC_TIMESTAMP_KEY = 'last_sync_timestamp';

/**
 * Get data from all possible storage locations and merge them
 */
const getAllStoredData = () => {
  const storageKeys = [
    'banners', 'bannerSlides', 'websiteBanners',
    'knowledgeArticles', 'featuredArticles', 'blogPosts', 'newsArticles', 'homepageArticles',
    'homepageProducts', 'generalSettings', 'impressiveNumbers',
    'dangKyKinhDoanhServices', 'keToanDoanhNghiepServices', 
    'thueHoKinhDoanhServices', 'thietKeWebServices'
  ];

  const allData = {};
  
  storageKeys.forEach(key => {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue) {
        allData[key] = JSON.parse(storedValue);
      }
    } catch (e) {
      console.warn(`Error parsing localStorage key: ${key}`, e);
    }
  });

  return allData;
};

/**
 * Sync data to backend when available
 */
export const syncDataToBackend = async (token) => {
  try {
    // Only attempt sync if we have a valid token
    if (!token) {
      console.log('No token provided, skipping backend sync');
      return;
    }

    // Get all current data
    const allData = getAllStoredData();

    // Attempt to sync each data type to backend
    for (const [key, data] of Object.entries(allData)) {
      if (Array.isArray(data) && data.length > 0) {
        // Determine the appropriate API endpoint based on the key
        let endpoint = '';
        switch (key) {
          case 'banners':
          case 'bannerSlides':
          case 'websiteBanners':
            endpoint = '/banners';
            break;
          case 'dangKyKinhDoanhServices':
          case 'keToanDoanhNghiepServices':
          case 'thueHoKinhDoanhServices':
          case 'thietKeWebServices':
            // These would need specific service endpoints
            continue; // Skip for now
          default:
            continue; // Skip unsupported data types
        }

        if (endpoint) {
          try {
            const response = await fetch(`${getApiBaseUrl()}/api${endpoint}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'x-auth-token': token
              },
              body: JSON.stringify(data)
            });

            if (!response.ok) {
              console.warn(`Failed to sync ${key} to backend:`, response.status);
            } else {
              console.log(`Successfully synced ${key} to backend`);
            }
          } catch (syncError) {
            console.warn(`Error syncing ${key} to backend:`, syncError.message);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in syncDataToBackend:', error);
  }
};

/**
 * Sync data from backend to localStorage
 */
export const syncDataFromBackend = async (token) => {
  try {
    if (!token) {
      console.log('No token provided, skipping backend sync');
      return;
    }

    // Fetch banners from backend
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/banners`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          // Update all banner storage keys
          localStorage.setItem('banners', JSON.stringify(result.data));
          localStorage.setItem('bannerSlides', JSON.stringify(result.data));
          localStorage.setItem('websiteBanners', JSON.stringify(result.data));
          
          // Dispatch event to notify components
          window.dispatchEvent(new CustomEvent('bannersUpdated', { detail: result.data }));
        }
      }
    } catch (bannerError) {
      console.warn('Error fetching banners from backend:', bannerError.message);
    }

    // Fetch general settings from backend
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          localStorage.setItem('generalSettings', JSON.stringify(result.data));
          
          // Dispatch event to notify components
          window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: result.data }));
        }
      }
    } catch (settingsError) {
      console.warn('Error fetching settings from backend:', settingsError.message);
    }
  } catch (error) {
    console.error('Error in syncDataFromBackend:', error);
  }
};

/**
 * Improved master data sync with cross-tab support
 */
export const syncMasterData = () => {
  try {
    // Get current data from localStorage
    const currentData = getAllStoredData();

    // Get master data
    const masterDataStr = localStorage.getItem(MASTER_DATA_KEY);
    let masterData = {};

    if (masterDataStr) {
      try {
        masterData = JSON.parse(masterDataStr);
      } catch (e) {
        console.warn('Error parsing master data, creating new:', e);
      }
    }

    // Merge current data into master data (with current taking precedence)
    const mergedData = { ...masterData, ...currentData, timestamp: Date.now() };

    // Save merged data back to master
    localStorage.setItem(MASTER_DATA_KEY, JSON.stringify(mergedData));

    // Update localStorage with master data to ensure consistency
    for (const [key, value] of Object.entries(mergedData)) {
      if (key !== 'timestamp') { // Don't store the timestamp as a separate data key
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
          console.warn(`Error saving ${key} to localStorage:`, e);
        }
      }
    }

    // Update timestamp
    localStorage.setItem(SYNC_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error('Error in syncMasterData:', error);
  }
};

/**
 * Initialize data sync with fallback mechanisms
 */
export const initializeDataSync = () => {
  // Sync master data first
  syncMasterData();

  // Set up periodic sync to keep data consistent
  setInterval(syncMasterData, 5000); // Sync every 5 seconds

  // Listen for storage events to sync across tabs
  window.addEventListener('storage', (e) => {
    // When another tab updates data, refresh our data
    if (e.key && !e.key.endsWith('_persist')) { // Ignore Redux Persist keys
      // Small delay to ensure the data is fully written
      setTimeout(syncMasterData, 100);
    }
  });

  // Listen for custom sync events
  window.addEventListener('forceDataSync', () => {
    syncMasterData();
  });
};

/**
 * Force refresh all data across the application
 */
export const forceRefreshAllData = () => {
  // Dispatch events to notify all components to refresh
  window.dispatchEvent(new CustomEvent('bannersUpdated', { 
    detail: JSON.parse(localStorage.getItem('banners') || '[]') 
  }));
  
  window.dispatchEvent(new CustomEvent('settingsUpdated', { 
    detail: JSON.parse(localStorage.getItem('generalSettings') || '{}') 
  }));

  // Refresh all service data
  ['dangKyKinhDoanhServices', 'keToanDoanhNghiepServices', 'thueHoKinhDoanhServices', 'thietKeWebServices'].forEach(key => {
    window.dispatchEvent(new CustomEvent('servicesUpdated', { 
      detail: { key, data: JSON.parse(localStorage.getItem(key) || '[]') }
    }));
  });
};

/**
 * Get API base URL with fallback
 */
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side (browser)
    // Use environment variable if available (for production with external backend)
    // Otherwise use localhost for development
    // When running both frontend and backend locally, use the same origin
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      // Use backend URL for local development if available, otherwise use relative path
      return 'http://localhost:5000'; // Use backend URL for local development
    } else {
      // For production, use relative path to leverage server proxy
      return ''; // Use relative path to leverage server proxy configuration
    }
  } else {
    // Server-side (Node.js) - this shouldn't be reached in a typical React app
    return '';
  }
};

/**
 * Safe JSON parsing utility
 */
export const safeJsonParse = (str, defaultValue = null) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.warn('Error parsing JSON:', e);
    return defaultValue;
  }
};

/**
 * Safe API call utility that handles HTML responses
 */
export const safeApiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    // Check if response is HTML (indicates an error page)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      // Response is HTML, likely an error page
      const htmlText = await response.text();
      console.error('Received HTML response instead of JSON:', htmlText.substring(0, 200) + '...');
      throw new Error('Server returned an error page instead of JSON data');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Safe API call failed:', error);
    throw error;
  }
};

// Initialize data sync when module is loaded
initializeDataSync();

export {
  MASTER_DATA_KEY,
  SYNC_TIMESTAMP_KEY
};