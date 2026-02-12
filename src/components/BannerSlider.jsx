import React, { useState, useEffect, useCallback } from 'react';
import { syncBannersFromBackend } from '../utils/bannerSync';

const BannerSlider = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // State để force refresh

  // Load banners from localStorage with improved sync
  useEffect(() => {
    const loadBanners = async () => {
      // First try to get from backend
      let backendBanners = null;
      try {
        const response = await fetch('/api/banners/active');
        if (response.ok) {
          const result = await response.json();
          if (result.success && Array.isArray(result.data)) {
            backendBanners = result.data;
            
            // Update localStorage with backend data for offline access
            localStorage.setItem('banners', JSON.stringify(result.data));
            localStorage.setItem('bannerSlides', JSON.stringify(result.data));
            localStorage.setItem('websiteBanners', JSON.stringify(result.data));
          }
        }
      } catch (error) {
        console.warn('Error fetching banners from backend:', error);
      }

      // Try multiple storage keys to ensure we get the latest data
      let savedBanners = JSON.parse(localStorage.getItem('banners')) ||
                        JSON.parse(localStorage.getItem('bannerSlides')) ||
                        JSON.parse(localStorage.getItem('websiteBanners')) ||
                        JSON.parse(localStorage.getItem('master_website_data_v2')?.banners || '[]') ||
                        [];
      console.log('Loaded banners from localStorage:', savedBanners); // Debug log
      
      // Use backend banners if available, otherwise use local banners
      const finalBanners = backendBanners || savedBanners;
      setBanners(finalBanners);
    };

    loadBanners();

    // Listen for storage changes to update banners when they change in admin
    const handleStorageChange = (e) => {
      // Reload regardless of which key changed, to ensure consistency
      if (e.key === 'banners' || e.key === 'bannerSlides' || e.key === 'websiteBanners' || e.key === 'master_website_data_v2') {
        console.log('Storage change detected for key:', e.key); // Debug log
        // Force reload the banners from localStorage
        setTimeout(() => {
          const freshBanners = JSON.parse(localStorage.getItem('banners')) ||
                              JSON.parse(localStorage.getItem('bannerSlides')) ||
                              JSON.parse(localStorage.getItem('websiteBanners')) ||
                              JSON.parse(localStorage.getItem('master_website_data_v2')?.banners || '[]') ||
                              [];
          console.log('Fresh banners loaded after storage change:', freshBanners); // Debug log
          setBanners(freshBanners);
          setRefreshTrigger(prev => prev + 1); // Force refresh component
        }, 100);
      }
    };

    // Listen for custom refresh events
    const handleRefreshEvent = () => {
      loadBanners(); // Reload from backend when refresh event occurs
    };

    // Listen for banner update events from bannerSync utility
    const handleBannerUpdate = (e) => {
      console.log('Banner update event received:', e.detail); // Debug log
      setBanners(e.detail || []);
      setRefreshTrigger(prev => prev + 1); // Force refresh component
    };

    // Also periodically check for updates (every 10 seconds) to sync with backend
    const interval = setInterval(() => {
      loadBanners(); // Refresh from backend periodically
    }, 10000);

    // Listen for force data sync events
    const handleForceSync = () => {
      loadBanners();
      setRefreshTrigger(prev => prev + 1);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('refreshBanners', handleRefreshEvent);
    window.addEventListener('bannersUpdated', handleBannerUpdate);
    window.addEventListener('forceDataSync', handleForceSync);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('refreshBanners', handleRefreshEvent);
      window.removeEventListener('bannersUpdated', handleBannerUpdate);
      window.removeEventListener('forceDataSync', handleForceSync);
      clearInterval(interval);
    };
  }, [refreshTrigger]); // Add refreshTrigger to dependency array

  // Auto-play functionality
  useEffect(() => {
    if (banners.length <= 1 || !isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex(prevIndex =>
        prevIndex >= banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 5 seconds (as requested)

    return () => clearInterval(interval);
  }, [banners.length, isAutoPlaying]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(prevIndex => 
      prevIndex <= 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex(prevIndex => 
      prevIndex >= banners.length - 1 ? 0 : prevIndex + 1
    );
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  if (banners.length === 0) {
    return (
      <div className="relative h-96 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Chưa có banner nào được tạo</p>
          <p className="text-gray-400 text-sm mt-2">Vui lòng thêm banner trong phần quản trị</p>
        </div>
      </div>
    );
  }


  return (
    <div className="relative w-full overflow-hidden rounded-lg" style={{ height: 'auto', aspectRatio: '16/6' }}>
      {/* Banner slides */}
      <div className="relative w-full h-full">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background container with blurred image */}
            <div 
              className="w-full h-full absolute inset-0"
              style={{
                backgroundImage: `url(${banner.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                zIndex: 0
              }}
            ></div>
            
            {/* Main image */}
            {banner.image && (
              <img
                src={banner.image}
                alt={banner.title || 'Banner image'}
                className="w-full h-full object-contain absolute inset-0"
                style={{ zIndex: 1 }} /* Higher z-index to appear above background */
                onError={(e) => {
                  console.log('Error loading image:', banner.image);
                  console.log('Image type:', typeof banner.image);
                  console.log('Is base64?', banner.image.startsWith('data:image'));
                  e.target.style.display = 'none';
                  // Show fallback when image fails to load
                  const fallbackDiv = document.querySelector(`.banner-fallback-${banner.id || index}`);
                  if (fallbackDiv) fallbackDiv.style.display = 'flex';
                }}
                onLoad={(e) => {
                  console.log('Image loaded successfully:', banner.image.substring(0, 50) + '...');
                  // Hide fallback when image loads successfully
                  const fallbackDiv = document.querySelector(`.banner-fallback-${banner.id || index}`);
                  if (fallbackDiv) fallbackDiv.style.display = 'none';
                }}
              />
            )}
            {/* Fallback background when no image or image fails to load */}
            {!banner.image && (
              <div className={`w-full h-full absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center banner-fallback-${banner.id || index}`}
                style={{ zIndex: 1 }}>
                <div className="text-center text-white">
                  <h2 className="text-3xl font-bold mb-2">{banner.title}</h2>
                  <p className="text-lg mb-4">{banner.description}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;