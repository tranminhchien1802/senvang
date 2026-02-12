import React, { useState, useEffect } from 'react';
import { refreshBanners } from '../utils/bannerSync';

const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    description: '',
    image: '',
    buttonText: '',
    buttonLink: '',
    order: 0
  });
  const [uploading, setUploading] = useState(false);

  // Load banners from localStorage with improved sync
  useEffect(() => {
    const loadBanners = () => {
      // Try multiple storage keys to ensure we get the latest data
      let savedBanners = JSON.parse(localStorage.getItem('websiteBanners')) ||
                        JSON.parse(localStorage.getItem('banners')) ||
                        JSON.parse(localStorage.getItem('bannerSlides')) ||
                        JSON.parse(localStorage.getItem('master_website_data_v2')?.banners || '[]') ||
                        null;
                        
      if (savedBanners && savedBanners.length > 0) {
        setBanners(savedBanners);
      } else {
        // Initialize with default banners
        const defaultBanners = [
          {
            id: '1',
            title: 'DỊCH VỤ THÀNH LẬP DOANH NGHIỆP',
            description: 'Thủ tục nhanh chóng, chi phí minh bạch, hỗ trợ trọn đời',
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=600&fit=crop',
            buttonText: 'Tư Vấn Miễn Phí',
            buttonLink: '/dang-ky-kinh-doanh',
            order: 1
          },
          {
            id: '2',
            title: 'DỊCH VỤ KẾ TOÁN TRỌN GÓI',
            description: 'Dịch vụ kế toán chuyên nghiệp, báo cáo thuế đúng hạn',
            image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=600&fit=crop',
            buttonText: 'Xem Gói Dịch Vụ',
            buttonLink: '/ke-toan-doanh-nghiep',
            order: 2
          },
          {
            id: '3',
            title: 'THIẾT KẾ WEBSITE CHUYÊN NGHIỆP',
            description: 'Thiết kế website theo yêu cầu, chuẩn SEO, tốc độ cao',
            image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=600&fit=crop',
            buttonText: 'Thiết Kế Ngay',
            buttonLink: '/thiet-ke-web',
            order: 3
          }
        ];
        setBanners(defaultBanners);
        
        // Save to all storage keys for consistency
        localStorage.setItem('websiteBanners', JSON.stringify(defaultBanners));
        localStorage.setItem('banners', JSON.stringify(defaultBanners));
        localStorage.setItem('bannerSlides', JSON.stringify(defaultBanners));
      }
    };

    loadBanners();

    // Listen for storage changes to update banners when they change in other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'websiteBanners' || e.key === 'banners' || e.key === 'bannerSlides' || e.key === 'master_website_data_v2') {
        setTimeout(() => {
          const updatedBanners = JSON.parse(localStorage.getItem('websiteBanners')) ||
                               JSON.parse(localStorage.getItem('banners')) ||
                               JSON.parse(localStorage.getItem('bannerSlides')) ||
                               JSON.parse(localStorage.getItem('master_website_data_v2')?.banners || '[]') ||
                               [];
          setBanners(updatedBanners);
        }, 100);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setBannerForm({
      ...bannerForm,
      [name]: value
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      // Validate file
      const validation = await import('../../utils/imageStorage').then(module => module.validateImageFile(file));
      if (!validation.valid) {
        alert(validation.error);
        setUploading(false);
        return;
      }

      // Upload to server
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', 'banners');

      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      if (!token) {
        alert('Bạn cần đăng nhập để upload ảnh');
        setUploading(false);
        return;
      }

      // Import the backend config
      const { getApiUrl } = await import('../../config/backendConfig');
      
      const response = await fetch(getApiUrl('/upload/image'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi upload ảnh lên server');
      }

      const result = await response.json();
      
      if (result.success) {
        // Update form with the server URL
        setBannerForm({
          ...bannerForm,
          image: result.url
        });
        setUploading(false);
      } else {
        throw new Error(result.message || 'Lỗi khi upload ảnh');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      // Try fallback mechanism if backend upload fails
      try {
        const { imageUploadFallback } = await import('../utils/apiFallback');
        const result = await imageUploadFallback.uploadImage(file);
        
        if (result.success) {
          // Update form with the base64 image
          setBannerForm({
            ...bannerForm,
            image: result.url
          });
          setUploading(false);
          alert('Upload ảnh thất bại trên server, sử dụng ảnh cục bộ. Vui lòng kiểm tra kết nối mạng.');
        } else {
          console.error('Error using fallback for image upload:', result.error);
          alert('Error uploading image: ' + error.message);
          setUploading(false);
        }
      } catch (fallbackError) {
        console.error('Error using fallback for image upload:', fallbackError);
        alert('Error uploading image: ' + error.message);
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingBanner) {
        // Update existing banner
        const updatedBanners = banners.map(banner =>
          banner.id === editingBanner.id ? { ...banner, ...bannerForm } : banner
        );
        setBanners(updatedBanners);

        // Update in backend if available
        try {
          const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
          if (token) {
            const response = await fetch(`/api/banners/${editingBanner.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'x-auth-token': token
              },
              body: JSON.stringify(bannerForm)
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Lỗi khi cập nhật banner trên server');
            }

            const result = await response.json();
            console.log('Banner updated on backend successfully:', result);
          }
        } catch (backendError) {
          console.error('Error updating banner on backend:', backendError);
          // Use fallback mechanism
          try {
            const { bannerOperationsFallback } = await import('../utils/apiFallback');
            const fallbackResult = bannerOperationsFallback.updateBanner(editingBanner.id, bannerForm);
            if (fallbackResult.success) {
              console.log('Banner updated using fallback mechanism');
            } else {
              console.error('Error using fallback for banner update:', fallbackResult.error);
            }
          } catch (fallbackError) {
            console.error('Error using fallback for banner update:', fallbackError);
          }
        }
      } else {
        // Add new banner
        const newBanner = {
          ...bannerForm,
          id: Date.now().toString(),
          order: banners.length + 1
        };
        const updatedBanners = [...banners, newBanner];
        setBanners(updatedBanners);

        // Save to backend if available
        try {
          const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
          if (token) {
            const response = await fetch('/api/banners', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'x-auth-token': token
              },
              body: JSON.stringify(bannerForm)
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Lỗi khi tạo banner trên server');
            }

            const result = await response.json();
            console.log('Banner created on backend successfully:', result);
          }
        } catch (backendError) {
          console.error('Error creating banner on backend:', backendError);
          // Use fallback mechanism
          try {
            const { bannerOperationsFallback } = await import('../utils/apiFallback');
            const fallbackResult = bannerOperationsFallback.saveBanner(bannerForm);
            if (fallbackResult.success) {
              console.log('Banner saved using fallback mechanism');
            } else {
              console.error('Error using fallback for banner save:', fallbackResult.error);
            }
          } catch (fallbackError) {
            console.error('Error using fallback for banner save:', fallbackError);
          }
        }
      }

      // Save to localStorage as fallback
      const updatedBanners = editingBanner
        ? banners.map(banner => banner.id === editingBanner.id ? { ...banner, ...bannerForm } : banner)
        : [...banners, { ...bannerForm, id: Date.now().toString(), order: banners.length + 1 }];
      localStorage.setItem('websiteBanners', JSON.stringify(updatedBanners));

      // Also update other banner storage keys for consistency
      localStorage.setItem('banners', JSON.stringify(updatedBanners));
      localStorage.setItem('bannerSlides', JSON.stringify(updatedBanners));

      // Refresh banners to ensure all components have the latest data
      refreshBanners();

      // Reset form and close
      setBannerForm({
        title: '',
        description: '',
        image: '',
        buttonText: '',
        buttonLink: '',
        order: banners.length + 1
      });
      setShowForm(false);
      setEditingBanner(null);
    } catch (error) {
      console.error('Error handling banner submission:', error);
      alert('Lỗi khi xử lý banner: ' + error.message);
    }
  };

  const startEdit = (banner) => {
    setEditingBanner(banner);
    setBannerForm({
      title: banner.title,
      description: banner.description,
      image: banner.image,
      buttonText: banner.buttonText,
      buttonLink: banner.buttonLink,
      order: banner.order
    });
    setShowForm(true);
  };

  const deleteBanner = (bannerId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa banner này?')) {
      const updatedBanners = banners.filter(banner => banner.id !== bannerId);
      setBanners(updatedBanners);
      localStorage.setItem('websiteBanners', JSON.stringify(updatedBanners));
      
      // Also update other banner storage keys for consistency
      localStorage.setItem('banners', JSON.stringify(updatedBanners));
      localStorage.setItem('bannerSlides', JSON.stringify(updatedBanners));
      
      // Refresh banners to ensure all components have the latest data
      refreshBanners();
    }
  };

  const moveBanner = (bannerId, direction) => {
    const bannerIndex = banners.findIndex(b => b.id === bannerId);
    if (bannerIndex === -1) return;

    const newBanners = [...banners];
    if (direction === 'up' && bannerIndex > 0) {
      [newBanners[bannerIndex], newBanners[bannerIndex - 1]] = [newBanners[bannerIndex - 1], newBanners[bannerIndex]];
    } else if (direction === 'down' && bannerIndex < newBanners.length - 1) {
      [newBanners[bannerIndex], newBanners[bannerIndex + 1]] = [newBanners[bannerIndex + 1], newBanners[bannerIndex]];
    }

    // Update order values
    newBanners.forEach((banner, index) => {
      banner.order = index + 1;
    });

    setBanners(newBanners);
    localStorage.setItem('websiteBanners', JSON.stringify(newBanners));
    
    // Also update other banner storage keys for consistency
    localStorage.setItem('banners', JSON.stringify(newBanners));
    localStorage.setItem('bannerSlides', JSON.stringify(newBanners));
    
    // Refresh banners to ensure all components have the latest data
    refreshBanners();
  };

  return (
    <div className="py-12" style={{ padding: '3rem 0' }}>
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800" style={{ fontSize: '2em', color: '#333' }}>
            Quản Lý Banner
          </h1>
          <button
            onClick={() => {
              setEditingBanner(null);
              setBannerForm({
                title: '',
                description: '',
                image: '',
                buttonText: '',
                buttonLink: '',
                order: banners.length + 1
              });
              setShowForm(true);
            }}
            className="px-6 py-3 bg-[#D4AF37] text-white font-bold rounded-lg hover:bg-[#b8942f] transition-colors shadow-md"
          >
            Thêm Banner
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6" style={{ fontSize: '1.25em', color: '#333', marginBottom: '1.5rem' }}>
            Danh Sách Banner
          </h2>

          {banners.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-xl">Chưa có banner nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {banners.sort((a, b) => a.order - b.order).map((banner, index) => (
                    <tr key={banner.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {banner.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={banner.description}>
                        {banner.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => moveBanner(banner.id, 'up')}
                            disabled={index === 0}
                            className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => moveBanner(banner.id, 'down')}
                            disabled={index === banners.length - 1}
                            className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ↓
                          </button>
                          <button
                            onClick={() => startEdit(banner)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => deleteBanner(banner.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Banner Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-[#D4AF37] mb-6 text-center">
                {editingBanner ? 'SỬA BANNER' : 'THÊM BANNER MỚI'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Tiêu đề <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="title"
                      value={bannerForm.title}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300"
                      placeholder="Nhập tiêu đề banner"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Mô tả <span className="text-red-500">*</span></label>
                    <textarea
                      name="description"
                      value={bannerForm.description}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300"
                      placeholder="Nhập mô tả banner"
                      rows="3"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">URL hình ảnh <span className="text-red-500">*</span></label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="text"
                        name="image"
                        value={bannerForm.image}
                        onChange={handleFormChange}
                        className="flex-1 px-4 py-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300"
                        placeholder="Nhập URL hình ảnh cho banner"
                        required
                      />
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className={`px-4 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#b8942f] transition-colors font-medium cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {uploading ? 'Đang tải...' : 'Chọn ảnh'}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Chữ nút</label>
                    <input
                      type="text"
                      name="buttonText"
                      value={bannerForm.buttonText}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300"
                      placeholder="Nhập chữ hiển thị trên nút (ví dụ: Xem Ngay)"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Liên kết nút</label>
                    <input
                      type="text"
                      name="buttonLink"
                      value={bannerForm.buttonLink}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300"
                      placeholder="Nhập liên kết khi nhấn nút (ví dụ: /dang-ky-kinh-doanh)"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Thứ tự</label>
                    <input
                      type="number"
                      name="order"
                      value={bannerForm.order}
                      onChange={handleFormChange}
                      className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300"
                      placeholder="Nhập số thứ tự hiển thị"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#D4AF37] text-white font-bold rounded-lg hover:bg-[#b8942f] transition-all duration-300"
                  >
                    {editingBanner ? 'CẬP NHẬT' : 'THÊM'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerManager;