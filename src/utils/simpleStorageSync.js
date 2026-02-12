// File: src/utils/simpleStorageSync.js
// Đơn giản hóa việc lưu trữ và đồng bộ dữ liệu giữa các trình duyệt

// Hàm lưu logo
export const saveLogo = (logoData) => {
  try {
    // Lưu vào localStorage
    localStorage.setItem('companyLogo', logoData);
    
    // Cập nhật vào các key khác để đảm bảo nhất quán
    const settings = JSON.parse(localStorage.getItem('generalSettings') || '{}');
    settings.logo = logoData;
    localStorage.setItem('generalSettings', JSON.stringify(settings));
    
    // Gửi sự kiện để các thành phần khác cập nhật
    window.dispatchEvent(new CustomEvent('logoUpdated', { detail: logoData }));
    
    return { success: true, message: 'Lưu logo thành công' };
  } catch (error) {
    console.error('Lỗi khi lưu logo:', error);
    return { success: false, message: 'Lỗi khi lưu logo' };
  }
};

// Hàm lấy logo
export const getLogo = () => {
  try {
    return localStorage.getItem('companyLogo') || 
           JSON.parse(localStorage.getItem('generalSettings') || '{}').logo || 
           null;
  } catch (error) {
    console.error('Lỗi khi lấy logo:', error);
    return null;
  }
};

// Hàm lưu banner
export const saveBanner = (bannerData) => {
  try {
    // Lưu vào localStorage
    localStorage.setItem('banners', JSON.stringify(bannerData));
    
    // Cập nhật vào các key khác để đảm bảo nhất quán
    localStorage.setItem('bannerSlides', JSON.stringify(bannerData));
    localStorage.setItem('websiteBanners', JSON.stringify(bannerData));
    
    // Gửi sự kiện để các thành phần khác cập nhật
    window.dispatchEvent(new CustomEvent('bannersUpdated', { detail: bannerData }));
    
    return { success: true, message: 'Lưu banner thành công' };
  } catch (error) {
    console.error('Lỗi khi lưu banner:', error);
    return { success: false, message: 'Lỗi khi lưu banner' };
  }
};

// Hàm lấy banner
export const getBanners = () => {
  try {
    return JSON.parse(localStorage.getItem('banners')) ||
           JSON.parse(localStorage.getItem('bannerSlides')) ||
           JSON.parse(localStorage.getItem('websiteBanners')) ||
           [];
  } catch (error) {
    console.error('Lỗi khi lấy banner:', error);
    return [];
  }
};

// Hàm lắng nghe thay đổi từ các tab khác
export const setupStorageSyncListener = () => {
  window.addEventListener('storage', (e) => {
    // Khi có thay đổi trong localStorage từ tab khác
    if (e.key === 'companyLogo' || e.key === 'generalSettings') {
      const newLogo = getLogo();
      if (newLogo) {
        window.dispatchEvent(new CustomEvent('logoUpdated', { detail: newLogo }));
      }
    }
    
    if (e.key === 'banners' || e.key === 'bannerSlides' || e.key === 'websiteBanners') {
      const newBanners = getBanners();
      window.dispatchEvent(new CustomEvent('bannersUpdated', { detail: newBanners }));
    }
  });
};

// Khởi tạo listener khi module được import
setupStorageSyncListener();