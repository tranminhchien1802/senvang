import React, { useState, useEffect } from 'react';
import { syncBannersFromBackend, syncBannersToBackend, saveBannerToBackend, updateBannerInBackend, deleteBannerFromBackend } from '../utils/bannerSync';

const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState('');

  // Load banners from localStorage (primary source)
  useEffect(() => {
    const loadBanners = () => {
      try {
        setLoading(true);
        // Always load from localStorage as primary source
        const savedBanners = JSON.parse(localStorage.getItem('banners')) || [];
        setBanners(savedBanners);
      } catch (err) {
        setError('Lỗi khi tải dữ liệu banner');
        console.error('Error loading banners:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBanners();

    // Listen for storage changes to update banners when they change in other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'banners' || e.key === 'bannerSlides') {
        // Add a small delay to ensure the storage has been updated in all contexts
        setTimeout(() => {
          loadBanners();
        }, 100);
      }
    };

    // Listen for custom refresh events
    const handleRefreshEvent = () => {
      loadBanners();
    };

    // Also listen for custom events that might be dispatched from other parts of the app
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('refreshBanners', handleRefreshEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('refreshBanners', handleRefreshEvent);
    };
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Validate file type
        if (!file.type.match('image.*')) {
          alert('Vui lòng chọn tệp hình ảnh (JPEG, PNG, GIF, v.v.)');
          return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('Kích thước tệp vượt quá giới hạn 5MB. Vui lòng chọn hình ảnh nhỏ hơn.');
          return;
        }

        // Check if we already have 5 banners
        if (banners.length >= 5) {
          alert('Chỉ được phép tải lên tối đa 5 hình ảnh banner');
          return;
        }

        // Show loading indicator
        setImageLoading(true);

        // Convert image to base64 for local storage
        const reader = new FileReader();
        reader.onload = (event) => {
          // Create banner object with the base64 image and default text
          const newBanner = {
            id: Date.now(), // Local ID for immediate use
            title: 'Banner Mới', // Default title
            description: 'Mô tả banner mới', // Default description
            buttonText: 'Xem thêm', // Default button text
            buttonLink: '/', // Default link
            image: event.target.result, // Base64 image data
            order: banners.length + 1 // Ensure proper ordering
          };

          // Add to local state immediately for better UX
          const updatedBanners = [...banners, newBanner];
          setBanners(updatedBanners);

          // Update all banner storage keys to ensure consistency
          localStorage.setItem('banners', JSON.stringify(updatedBanners));
          localStorage.setItem('bannerSlides', JSON.stringify(updatedBanners));
          localStorage.setItem('websiteBanners', JSON.stringify(updatedBanners));

          // Force update the banners in BannerSlider by dispatching a custom event
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'banners',
            oldValue: JSON.stringify(banners),
            newValue: JSON.stringify(updatedBanners)
          }));

          // Dispatch custom events to notify other components about the update
          // Use setTimeout to ensure the event is processed after the storage update
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('refreshBanners', { detail: updatedBanners }));
            window.dispatchEvent(new CustomEvent('bannersUpdated', { detail: updatedBanners }));
          }, 200); // Small delay to ensure storage is updated first

          setImageLoading(false);
        };
        
        reader.onerror = () => {
          alert('Lỗi khi đọc tệp hình ảnh. Vui lòng thử lại.');
          setImageLoading(false);
        };
        
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Lỗi khi upload ảnh. Vui lòng thử lại.');
        setImageLoading(false);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa banner này?')) {
      try {
        // Remove from local state immediately for better UX
        const updatedBanners = banners.filter(banner => banner._id !== id && banner.id !== id);
        setBanners(updatedBanners);
        
        // Update localStorage immediately to ensure consistency
        localStorage.setItem('banners', JSON.stringify(updatedBanners));
        localStorage.setItem('bannerSlides', JSON.stringify(updatedBanners));
        
        // Trigger storage event to notify other tabs/windows
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'banners',
          oldValue: JSON.stringify(banners),
          newValue: JSON.stringify(updatedBanners)
        }));
        
        alert('Xóa banner thành công!');
      } catch (error) {
        console.error('Error deleting banner:', error);
        alert('Lỗi khi xóa banner. Vui lòng thử lại.');
      }
    }
  };

  const handleSaveAllBanners = () => {
    try {
      // Ensure all banner storage keys are synchronized
      localStorage.setItem('banners', JSON.stringify(banners));
      localStorage.setItem('bannerSlides', JSON.stringify(banners));
      localStorage.setItem('websiteBanners', JSON.stringify(banners));
      
      // Dispatch events to notify other components about the update
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'banners',
        oldValue: null,
        newValue: JSON.stringify(banners)
      }));
      
      window.dispatchEvent(new CustomEvent('refreshBanners'));
      window.dispatchEvent(new CustomEvent('bannersUpdated', { detail: banners }));
      
      alert('Dữ liệu banner đã được lưu và đồng bộ thành công!');
    } catch (error) {
      console.error('Error saving banners:', error);
      alert('Lỗi khi lưu dữ liệu banner. Vui lòng thử lại.');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Quản Lý Banner</h1>
          <button
            onClick={handleSaveAllBanners}
            className="px-4 py-2 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8942f] transition-colors"
          >
            Lưu Tất Cả Banner
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
            <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {!loading && (
          <>
            {/* Banner Upload Form */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Tải Lên Banner Mới</h2>

              <div className="space-y-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chọn Ảnh Banner
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={imageLoading}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${imageLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                  {imageLoading && (
                    <div className="mt-2 flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#D4AF37] mr-2"></div>
                      <span className="text-sm text-gray-600">Đang upload ảnh...</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Chọn ảnh banner mới (tối đa 5 ảnh, đề xuất: 1200x400px)
                  </p>

                  {previewImage && (
                    <div className="mt-3">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Banner Preview</h3>
                      <img
                        src={previewImage}
                        alt="Banner Preview"
                        className="max-w-full h-40 object-contain border border-gray-300 rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Banner List */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Danh Sách Banner</h2>
            <p className="text-sm text-gray-600">{banners.length} banner(s)</p>
          </div>

          {!loading && banners.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Chưa có banner nào được tạo
            </div>
          ) : !loading && (
            <div className="space-y-4">
              {banners.map((banner) => (
                <div key={banner._id || banner.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-gray-800">Banner #{banner._id?.substring(0, 8) || banner.id}</h3>
                      <p className="text-sm text-gray-600 truncate max-w-md">{banner.title}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(banner._id || banner.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded border border-red-200 hover:bg-red-50"
                    >
                      Xóa
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Tiêu đề:</span>
                      <p className="text-gray-600">{banner.title}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Nút bấm:</span>
                      <p className="text-gray-600">{banner.buttonText}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Liên kết:</span>
                      <p className="text-gray-600 truncate">{banner.buttonLink}</p>
                    </div>
                  </div>

                  {banner.image && (
                    <div className="mt-3">
                      <span className="font-medium text-gray-700">Ảnh Banner:</span>
                      <div className="mt-1">
                        <img 
                          src={banner.image} 
                          alt="Banner" 
                          className="w-32 h-20 object-cover border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {loading && (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
              <span className="ml-3 text-gray-600">Đang tải danh sách banner...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerManager;