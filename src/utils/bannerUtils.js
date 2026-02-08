/**
 * Utility functions for banner management
 */

/**
 * Force refresh banners across the application
 */
export const forceRefreshBanners = () => {
  // Dispatch a custom event to notify all components to reload banners
  window.dispatchEvent(new CustomEvent('refreshBanners'));
  
  // Also trigger a storage event as a fallback
  const banners = JSON.parse(localStorage.getItem('banners')) || [];
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'banners',
    oldValue: null,
    newValue: JSON.stringify(banners)
  }));
};

/**
 * Get banners from localStorage with fallback options
 */
export const getBanners = () => {
  return JSON.parse(localStorage.getItem('banners')) || 
         JSON.parse(localStorage.getItem('bannerSlides')) || 
         [];
};

/**
 * Save banners to all relevant localStorage keys for consistency
 */
export const saveBannersToStorage = (banners) => {
  const bannerString = JSON.stringify(banners);
  localStorage.setItem('banners', bannerString);
  localStorage.setItem('bannerSlides', bannerString);
  
  // Dispatch storage event to notify other components
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'banners',
    oldValue: null,
    newValue: bannerString
  }));
};