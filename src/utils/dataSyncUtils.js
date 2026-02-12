// File: src/utils/dataSyncUtils.js
// Utilities for data synchronization between clients

// Cache for storing last known data and timestamps
const dataCache = new Map();

/**
 * Check if data has been updated on server compared to local cache
 */
export const checkDataUpdates = async (endpoint, key) => {
  try {
    const { getApiUrl } = await import('../config/backendConfig');
    const response = await fetch(getApiUrl(endpoint));
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    const serverData = result.data;
    
    // Get cached data
    const cached = dataCache.get(key);
    
    // Check if data has changed
    const serverHash = generateHash(serverData);
    const cachedHash = cached ? cached.hash : null;
    
    if (serverHash !== cachedHash) {
      // Data has changed, update cache
      dataCache.set(key, {
        data: serverData,
        hash: serverHash,
        timestamp: Date.now()
      });
      
      // Dispatch update event
      window.dispatchEvent(new CustomEvent(`${key}Updated`, { 
        detail: serverData 
      }));
      
      return {
        hasChanged: true,
        data: serverData,
        previousData: cached ? cached.data : null
      };
    }
    
    return {
      hasChanged: false,
      data: serverData,
      previousData: cached ? cached.data : null
    };
  } catch (error) {
    console.error(`Error checking updates for ${key}:`, error);
    return {
      hasChanged: false,
      data: null,
      previousData: null,
      error: error.message
    };
  }
};

/**
 * Simple hash function for comparing data changes
 */
const generateHash = (obj) => {
  const str = JSON.stringify(obj, Object.keys(obj).sort());
  let hash = 0;
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  
  return hash.toString();
};

/**
 * Poll for data updates at regular intervals
 */
export const startPollingForUpdates = (endpoint, key, interval = 5000) => {
  // Clear any existing polling for this key
  if (window[`polling_${key}`]) {
    clearInterval(window[`polling_${key}`]);
  }
  
  // Start polling
  window[`polling_${key}`] = setInterval(async () => {
    await checkDataUpdates(endpoint, key);
  }, interval);
  
  // Check immediately
  checkDataUpdates(endpoint, key);
  
  return () => {
    if (window[`polling_${key}`]) {
      clearInterval(window[`polling_${key}`]);
      window[`polling_${key}`] = null;
    }
  };
};

/**
 * Stop polling for updates
 */
export const stopPollingForUpdates = (key) => {
  if (window[`polling_${key}`]) {
    clearInterval(window[`polling_${key}`]);
    window[`polling_${key}`] = null;
  }
};

/**
 * Get cached data
 */
export const getCachedData = (key) => {
  return dataCache.get(key);
};

/**
 * Clear cached data
 */
export const clearCachedData = (key) => {
  if (key) {
    dataCache.delete(key);
  } else {
    dataCache.clear();
  }
};