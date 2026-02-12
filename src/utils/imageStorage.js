// File: src/utils/imageStorage.js
// Utility functions to handle image storage and retrieval with fallback mechanisms

/**
 * Save image to localStorage with fallback to IndexedDB if size exceeds limits
 */
export const saveImageToStorage = async (key, imageData) => {
  try {
    // First, try to save to localStorage
    localStorage.setItem(key, JSON.stringify(imageData));
    return { success: true, storage: 'localStorage' };
  } catch (error) {
    // If localStorage fails due to size limits, try IndexedDB
    if (error.name === 'QuotaExceededError') {
      try {
        await saveToIndexedDB(key, imageData);
        return { success: true, storage: 'indexedDB' };
      } catch (idbError) {
        console.error('Failed to save image to both localStorage and IndexedDB:', idbError);
        return { success: false, error: idbError.message };
      }
    } else {
      console.error('Error saving image to localStorage:', error);
      return { success: false, error: error.message };
    }
  }
};

/**
 * Retrieve image from storage with fallback mechanism
 */
export const getImageFromStorage = async (key) => {
  try {
    // First, try to get from localStorage
    const storedData = localStorage.getItem(key);
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.warn('Error reading from localStorage, trying IndexedDB:', error);
  }

  // If localStorage fails, try IndexedDB
  try {
    const indexedDBData = await getFromIndexedDB(key);
    return indexedDBData;
  } catch (idbError) {
    console.error('Error reading from IndexedDB:', idbError);
    return null;
  }
};

/**
 * Save data to IndexedDB
 */
const saveToIndexedDB = (key, data) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ImageStorageDB', 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('images')) {
        db.createObjectStore('images', { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['images'], 'readwrite');
      const store = transaction.objectStore('images');

      const putRequest = store.put({ id: key, data: data, timestamp: Date.now() });

      putRequest.onsuccess = () => resolve();
      putRequest.onerror = (error) => reject(error.target.error);
    };

    request.onerror = (error) => reject(error.target.error);
  });
};

/**
 * Get data from IndexedDB
 */
const getFromIndexedDB = (key) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ImageStorageDB', 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('images')) {
        db.createObjectStore('images', { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['images'], 'readonly');
      const store = transaction.objectStore('images');

      const getRequest = store.get(key);

      getRequest.onsuccess = () => {
        if (getRequest.result) {
          resolve(getRequest.result.data);
        } else {
          resolve(null);
        }
      };

      getRequest.onerror = (error) => reject(error.target.error);
    };

    request.onerror = (error) => reject(error.target.error);
  });
};

/**
 * Convert file to base64 for storage
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

/**
 * Validate image file
 */
export const validateImageFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  // Check file type
  if (!file.type.match('image.*')) {
    return { valid: false, error: 'File is not an image' };
  }

  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: 'File size exceeds 5MB limit' };
  }

  return { valid: true };
};

/**
 * Save banner image with improved error handling
 */
export const saveBannerImage = async (bannerId, file) => {
  try {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const base64Image = await fileToBase64(file);
    
    // Save to localStorage with a specific key pattern
    const key = `banner_image_${bannerId}`;
    const result = await saveImageToStorage(key, {
      id: bannerId,
      image: base64Image,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadTime: Date.now()
    });

    if (!result.success) {
      throw new Error(`Failed to save image: ${result.error}`);
    }

    return { success: true, key, storage: result.storage };
  } catch (error) {
    console.error('Error saving banner image:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get banner image from storage
 */
export const getBannerImage = async (bannerId) => {
  try {
    const key = `banner_image_${bannerId}`;
    const imageData = await getImageFromStorage(key);
    return imageData;
  } catch (error) {
    console.error('Error getting banner image:', error);
    return null;
  }
};

/**
 * Save logo image with improved error handling
 */
export const saveLogoImage = async (file) => {
  try {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const base64Image = await fileToBase64(file);
    
    // Save to localStorage with a specific key
    const result = await saveImageToStorage('logo_image', {
      image: base64Image,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadTime: Date.now()
    });

    if (!result.success) {
      throw new Error(`Failed to save logo: ${result.error}`);
    }

    // Also update the general settings with the new logo
    const settings = JSON.parse(localStorage.getItem('generalSettings') || '{}');
    settings.logo = base64Image;
    localStorage.setItem('generalSettings', JSON.stringify(settings));

    // Update master data as well
    try {
      const masterDataStr = localStorage.getItem('master_website_data_v2');
      let masterData = masterDataStr ? JSON.parse(masterDataStr) : {};
      if (!masterData.settings) masterData.settings = {};
      masterData.settings.logo = base64Image;
      masterData.timestamp = Date.now();
      localStorage.setItem('master_website_data_v2', JSON.stringify(masterData));
    } catch (e) {
      console.warn('Could not update master data with logo:', e);
    }

    // Dispatch event to notify components
    window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: settings }));

    return { success: true, storage: result.storage };
  } catch (error) {
    console.error('Error saving logo image:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get logo image from storage
 */
export const getLogoImage = async () => {
  try {
    const imageData = await getImageFromStorage('logo_image');
    return imageData;
  } catch (error) {
    console.error('Error getting logo image:', error);
    return null;
  }
};