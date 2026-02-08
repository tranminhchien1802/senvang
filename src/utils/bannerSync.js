import axios from 'axios';

import { API_BASE_URL } from '../config/apiConfig';

const BASE_API_URL = API_BASE_URL ? `${API_BASE_URL}/api` : '/api';

/**
 * Sync banners from backend to localStorage
 */
export const syncBannersFromBackend = async (token) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/banners`, {  // Changed from /banners/active to /banners to get all banners
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      // Store banners in localStorage
      const bannerData = response.data.data;
      
      // Update all banner storage keys to ensure consistency
      localStorage.setItem('banners', JSON.stringify(bannerData));
      localStorage.setItem('bannerSlides', JSON.stringify(bannerData));
      localStorage.setItem('websiteBanners', JSON.stringify(bannerData));
      
      // Dispatch a custom event to notify other components about the update
      window.dispatchEvent(new CustomEvent('bannersUpdated', { detail: bannerData }));
      
      return bannerData;
    } else {
      // If response is not successful, return local data
      const fallbackData = JSON.parse(localStorage.getItem('banners')) || [];
      return fallbackData;
    }
  } catch (error) {
    console.warn('Backend sync failed, using local data:', error.message);
    // Fallback to existing localStorage data
    const fallbackData = JSON.parse(localStorage.getItem('banners')) || [];
    return fallbackData;
  }
};

/**
 * Sync banners from localStorage to backend
 */
export const syncBannersToBackend = async (token) => {
  try {
    // Get banners from all possible storage locations and merge them
    const bannerStorageKeys = ['banners', 'bannerSlides', 'websiteBanners'];
    let localBanners = [];
    
    for (const key of bannerStorageKeys) {
      const storedBanners = JSON.parse(localStorage.getItem(key) || '[]');
      if (storedBanners.length > 0) {
        localBanners = [...localBanners, ...storedBanners];
        break; // Use the first non-empty storage
      }
    }

    // Remove duplicates based on ID
    const uniqueLocalBanners = localBanners.filter((banner, index, self) =>
      index === self.findIndex(b => b.id === banner.id || b._id === banner.id || b._id === banner._id)
    );

    // Get current banners from backend
    const response = await axios.get(`${API_BASE_URL}/banners`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      const backendBanners = response.data.data;

      // Delete all backend banners that don't exist in local storage
      for (const backendBanner of backendBanners) {
        const existsLocally = uniqueLocalBanners.some(localBanner =>
          localBanner._id === backendBanner._id || localBanner.id === backendBanner._id || localBanner.id === backendBanner.id
        );

        if (!existsLocally) {
          try {
            await axios.delete(`${API_BASE_URL}/banners/${backendBanner._id || backendBanner.id}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            console.log(`Deleted banner ${backendBanner._id || backendBanner.id} from backend`);
          } catch (deleteError) {
            console.error(`Error deleting banner ${backendBanner._id || backendBanner.id}:`, deleteError);
          }
        }
      }

      // Update or create banners from local storage
      for (const localBanner of uniqueLocalBanners) {
        // Check if banner exists in backend
        const existingBanner = backendBanners.find(b =>
          b._id === localBanner._id || b.id === localBanner.id || b._id === localBanner.id
        );

        if (existingBanner) {
          // Update existing banner - only update fields that are not ID related
          const updateData = {
            title: localBanner.title || '',
            description: localBanner.description || '',
            buttonText: localBanner.buttonText || '',
            buttonLink: localBanner.buttonLink || '/',
            image: localBanner.image || ''
          };

          try {
            await axios.put(`${API_BASE_URL}/banners/${existingBanner._id || existingBanner.id}`, updateData, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            console.log(`Updated banner ${existingBanner._id || existingBanner.id}`);
          } catch (updateError) {
            console.error(`Error updating banner ${existingBanner._id || existingBanner.id}:`, updateError);
          }
        } else {
          // Create new banner
          const createData = {
            title: localBanner.title || '',
            description: localBanner.description || '',
            buttonText: localBanner.buttonText || '',
            buttonLink: localBanner.buttonLink || '/',
            image: localBanner.image || ''
          };

          try {
            await axios.post(`${API_BASE_URL}/banners`, createData, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            console.log(`Created new banner with title: ${createData.title}`);
          } catch (createError) {
            console.error('Error creating banner:', createError);
          }
        }
      }
      
      console.log(`Sync completed: Processed ${uniqueLocalBanners.length} local banners with ${backendBanners.length} backend banners`);
    }
  } catch (error) {
    console.warn('Backend sync failed, continuing with local data:', error.message);
    // Silently fail to avoid disrupting the UI - this is expected when backend is not available
  }
};

/**
 * Force sync banners bidirectionally
 */
export const forceSyncBanners = async (token) => {
  console.log('Starting forced banner synchronization...');
  
  // First, pull from backend to ensure we have latest
  await syncBannersFromBackend(token);
  
  // Then push local changes to backend
  await syncBannersToBackend(token);
  
  // Pull again to ensure consistency after updates
  const finalBanners = await syncBannersFromBackend(token);
  
  console.log('Forced banner synchronization completed.');
  return finalBanners;
};

/**
 * Upload banner image to backend
 */
export const uploadBannerImage = async (file, token) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post(`${API_BASE_URL}/banners/upload`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.url;
  } catch (error) {
    console.error('Error uploading banner image:', error);
    // Don't show an alert here since the BannerManager handles fallback
    // Just re-throw the error so the calling function can handle it
    throw error;
  }
};

/**
 * Save banner to backend
 */
export const saveBannerToBackend = async (bannerData, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/banners`, bannerData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Update local storage after successful save
    const currentBanners = JSON.parse(localStorage.getItem('banners') || '[]');
    const updatedBanners = [...currentBanners, { ...bannerData, _id: response.data._id }];
    localStorage.setItem('banners', JSON.stringify(updatedBanners));
    localStorage.setItem('bannerSlides', JSON.stringify(updatedBanners));
    localStorage.setItem('websiteBanners', JSON.stringify(updatedBanners));
    
    // Dispatch a custom event to notify other components about the update
    window.dispatchEvent(new CustomEvent('bannersUpdated', { detail: updatedBanners }));

    return response.data;
  } catch (error) {
    console.error('Error saving banner to backend:', error);
    throw error;
  }
};

/**
 * Update banner in backend
 */
export const updateBannerInBackend = async (bannerId, bannerData, token) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/banners/${bannerId}`, bannerData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Update local storage after successful update
    const currentBanners = JSON.parse(localStorage.getItem('banners') || '[]');
    const updatedBanners = currentBanners.map(banner => 
      (banner.id === bannerId || banner._id === bannerId) ? { ...banner, ...bannerData } : banner
    );
    localStorage.setItem('banners', JSON.stringify(updatedBanners));
    localStorage.setItem('bannerSlides', JSON.stringify(updatedBanners));
    localStorage.setItem('websiteBanners', JSON.stringify(updatedBanners));
    
    // Dispatch a custom event to notify other components about the update
    window.dispatchEvent(new CustomEvent('bannersUpdated', { detail: updatedBanners }));

    return response.data;
  } catch (error) {
    console.error('Error updating banner in backend:', error);
    throw error;
  }
};

/**
 * Delete banner from backend
 */
export const deleteBannerFromBackend = async (bannerId, token) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/banners/${bannerId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Remove from local storage after successful deletion
    const currentBanners = JSON.parse(localStorage.getItem('banners') || '[]');
    const updatedBanners = currentBanners.filter(banner => 
      banner.id !== bannerId && banner._id !== bannerId
    );
    localStorage.setItem('banners', JSON.stringify(updatedBanners));
    localStorage.setItem('bannerSlides', JSON.stringify(updatedBanners));
    localStorage.setItem('websiteBanners', JSON.stringify(updatedBanners));
    
    // Dispatch a custom event to notify other components about the update
    window.dispatchEvent(new CustomEvent('bannersUpdated', { detail: updatedBanners }));

    return response.data;
  } catch (error) {
    console.error('Error deleting banner from backend:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Refresh banners from localStorage to ensure all components have the latest data
 */
export const refreshBanners = () => {
  const bannerData = JSON.parse(localStorage.getItem('banners') || '[]');
  
  // Ensure all storage keys are consistent
  localStorage.setItem('banners', JSON.stringify(bannerData));
  localStorage.setItem('bannerSlides', JSON.stringify(bannerData));
  localStorage.setItem('websiteBanners', JSON.stringify(bannerData));
  
  // Dispatch a custom event to notify other components about the refresh
  window.dispatchEvent(new CustomEvent('bannersUpdated', { detail: bannerData }));
  
  return bannerData;
};