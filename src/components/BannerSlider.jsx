import React, { useState, useEffect, useCallback } from 'react';
import { syncBannersFromBackend } from '../utils/bannerSync';

const BannerSlider = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // State để force refresh

  // Load banners from localStorage with simple sync
  useEffect(() => {
    const loadBanners = () => {
      // Load from localStorage - this is the primary source now
      let savedBanners = JSON.parse(localStorage.getItem('banners')) ||
                        JSON.parse(localStorage.getItem('bannerSlides')) ||
                        JSON.parse(localStorage.getItem('websiteBanners')) ||
                        JSON.parse(localStorage.getItem('master_website_data_v2')?.banners || '[]') ||
                        [];
      console.log('Loaded banners from localStorage:', savedBanners); // Debug log
      
      setBanners(savedBanners);
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

    // Listen for banner update events
    const handleBannerUpdate = (e) => {
      console.log('Banner update event received:', e.detail); // Debug log
      setBanners(e.detail || []);
      setRefreshTrigger(prev => prev + 1); // Force refresh component
    };

    // Listen for force data sync events
    const handleForceSync = () => {
      loadBanners();
      setRefreshTrigger(prev => prev + 1);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('bannersUpdated', handleBannerUpdate);
    window.addEventListener('forceDataSync', handleForceSync);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bannersUpdated', handleBannerUpdate);
      window.removeEventListener('forceDataSync', handleForceSync);
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
    // Nếu không có banner trong localStorage, sử dụng banner mặc định từ thư mục public
    const defaultBanners = [
      {
        id: 'default-1',
        title: 'DỊCH VỤ KẾ TOÁN CHUYÊN NGHIỆP',
        description: 'Hơn 10 năm kinh nghiệm đồng hành cùng 5000+ doanh nghiệp khởi sự thành công',
        image: '/image/banner1.png',
        buttonText: 'Xem Các Dịch Vụ',
        buttonLink: '/dich-vu'
      },
      {
        id: 'default-2',
        title: 'THÀNH LẬP DOANH NGHIỆP',
        description: 'Dễ dàng – Hiệu quả – Chất lượng. Đồng hành tận tâm và chuyên nghiệp',
        image: '/image/banner2.webp',
        buttonText: 'Liên Hệ Tư Vấn',
        buttonLink: '/lien-he'
      },
      {
        id: 'default-3',
        title: 'GIẢI PHÁP TÀI CHÍNH TOÀN DIỆN',
        description: 'Tư vấn chiến lược thuế, quản lý kế toán chuyên nghiệp',
        image: '/image/baner3.jpg',
        buttonText: 'Tìm Hiểu Thêm',
        buttonLink: '/'
      }
    ];
    
    // Cập nhật localStorage với banner mặc định
    localStorage.setItem('banners', JSON.stringify(defaultBanners));
    localStorage.setItem('bannerSlides', JSON.stringify(defaultBanners));
    localStorage.setItem('websiteBanners', JSON.stringify(defaultBanners));
    
    // Cập nhật state
    setBanners(defaultBanners);
    
    // Không render gì ở đây vì sẽ render lại sau khi cập nhật state
    return null;
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
                backgroundImage: banner.image ? `url(${banner.image})` : 'linear-gradient(45deg, #4b9cdb, #6a5acd)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                zIndex: 0
              }}
            ></div>
            
            {/* Main image */}
            {banner.image && banner.image.trim() && (
              <img
                src={banner.image}
                alt={banner.title || 'Banner image'}
                className="w-full h-full object-cover absolute inset-0"
                style={{ zIndex: 1 }} /* Higher z-index to appear above background */
                onError={(e) => {
                  console.log('Error loading image:', banner.image ? banner.image.substring(0, 50) + '...' : 'no image');
                  console.log('Image type:', typeof banner.image);
                  console.log('Is base64?', banner.image && banner.image.startsWith('data:image'));
                  e.target.style.display = 'none';
                  // Show fallback when image fails to load
                  const fallbackDiv = document.querySelector(`.banner-fallback-${banner.id || index}`);
                  if (fallbackDiv) fallbackDiv.style.display = 'flex';
                }}
                onLoad={(e) => {
                  console.log('Image loaded successfully:', banner.image ? banner.image.substring(0, 50) + '...' : 'no image');
                  // Hide fallback when image loads successfully
                  const fallbackDiv = document.querySelector(`.banner-fallback-${banner.id || index}`);
                  if (fallbackDiv) fallbackDiv.style.display = 'none';
                }}
              />
            )}
            {/* Fallback background when no image or image fails to load */}
            {(!banner.image || !banner.image.trim()) && (
              <div className={`w-full h-full absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center banner-fallback-${banner.id || index}`}
                style={{ zIndex: 1 }}>
                <div className="text-center text-white">
                  <h2 className="text-3xl font-bold mb-2">{banner.title || 'Banner không có tiêu đề'}</h2>
                  <p className="text-lg mb-4">{banner.description || 'Chưa có mô tả'}</p>
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