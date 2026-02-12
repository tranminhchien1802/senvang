// File: src/utils/apiFallback.js
// Fallback utilities when backend is not available

/**
 * Fallback function to handle banner operations when backend is not available
 */
export const bannerOperationsFallback = {
  /**
   * Get banners from localStorage when backend is not available
   */
  getBanners: () => {
    try {
      const banners = JSON.parse(localStorage.getItem('banners') || '[]');
      return { success: true, data: banners };
    } catch (error) {
      console.error('Error getting banners from localStorage:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  /**
   * Save banner to localStorage when backend is not available
   */
  saveBanner: (banner) => {
    try {
      const existingBanners = JSON.parse(localStorage.getItem('banners') || '[]');
      const updatedBanners = [...existingBanners, { ...banner, id: Date.now().toString() }];
      localStorage.setItem('banners', JSON.stringify(updatedBanners));
      
      // Also update other storage keys for consistency
      localStorage.setItem('bannerSlides', JSON.stringify(updatedBanners));
      localStorage.setItem('websiteBanners', JSON.stringify(updatedBanners));
      
      return { success: true, data: updatedBanners };
    } catch (error) {
      console.error('Error saving banner to localStorage:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update banner in localStorage when backend is not available
   */
  updateBanner: (bannerId, updatedBanner) => {
    try {
      const existingBanners = JSON.parse(localStorage.getItem('banners') || '[]');
      const updatedBanners = existingBanners.map(banner => 
        banner.id === bannerId ? { ...banner, ...updatedBanner } : banner
      );
      localStorage.setItem('banners', JSON.stringify(updatedBanners));
      
      // Also update other storage keys for consistency
      localStorage.setItem('bannerSlides', JSON.stringify(updatedBanners));
      localStorage.setItem('websiteBanners', JSON.stringify(updatedBanners));
      
      return { success: true, data: updatedBanners };
    } catch (error) {
      console.error('Error updating banner in localStorage:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete banner from localStorage when backend is not available
   */
  deleteBanner: (bannerId) => {
    try {
      const existingBanners = JSON.parse(localStorage.getItem('banners') || '[]');
      const updatedBanners = existingBanners.filter(banner => banner.id !== bannerId);
      localStorage.setItem('banners', JSON.stringify(updatedBanners));
      
      // Also update other storage keys for consistency
      localStorage.setItem('bannerSlides', JSON.stringify(updatedBanners));
      localStorage.setItem('websiteBanners', JSON.stringify(updatedBanners));
      
      return { success: true, data: updatedBanners };
    } catch (error) {
      console.error('Error deleting banner from localStorage:', error);
      return { success: false, error: error.message };
    }
  }
};

/**
 * Fallback function to handle settings operations when backend is not available
 */
export const settingsOperationsFallback = {
  /**
   * Get settings from localStorage when backend is not available
   */
  getSettings: (key = 'generalSettings') => {
    try {
      const settings = JSON.parse(localStorage.getItem(key) || '{}');
      return { success: true, data: settings };
    } catch (error) {
      console.error('Error getting settings from localStorage:', error);
      return { success: false, data: {}, error: error.message };
    }
  },

  /**
   * Save settings to localStorage when backend is not available
   */
  saveSettings: (key, settings) => {
    try {
      localStorage.setItem(key, JSON.stringify(settings));
      
      // Update master data as well
      try {
        const masterDataStr = localStorage.getItem('master_website_data_v2');
        let masterData = masterDataStr ? JSON.parse(masterDataStr) : {};
        if (!masterData.settings) masterData.settings = {};
        masterData.settings = { ...masterData.settings, ...settings };
        masterData.timestamp = Date.now();
        localStorage.setItem('master_website_data_v2', JSON.stringify(masterData));
      } catch (e) {
        console.warn('Could not update master data:', e);
      }
      
      return { success: true, data: settings };
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
      return { success: false, error: error.message };
    }
  }
};

/**
 * Fallback function to handle image upload when backend is not available
 */
export const imageUploadFallback = {
  /**
   * Convert image to base64 when upload to server is not available
   */
  uploadImage: async (file) => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve({
            success: true,
            url: event.target.result,
            filename: file.name,
            message: 'Image saved locally as base64'
          });
        };
        reader.onerror = (error) => {
          reject({
            success: false,
            error: error.message,
            message: 'Failed to read image file'
          });
        };
        reader.readAsDataURL(file);
      } catch (error) {
        reject({
          success: false,
          error: error.message,
          message: 'Failed to process image file'
        });
      }
    });
  }
};