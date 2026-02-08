// File: src/utils/dataSync.js
// Utility functions to sync data across the application
// Enhanced to support cross-port data persistence

const MASTER_DATA_KEY = 'master_website_data';

/**
 * Sync service data from individual service pages to central storage
 */
export const syncServiceData = () => {
  // Get data from individual service pages
  const dangKyKinhDoanhServices = JSON.parse(localStorage.getItem('dangKyKinhDoanhServices')) || [];
  const keToanDoanhNghiepServices = JSON.parse(localStorage.getItem('keToanDoanhNghiepServices')) || [];
  const thueHoKinhDoanhServices = JSON.parse(localStorage.getItem('thueHoKinhDoanhServices')) || [];
  const thietKeWebServices = JSON.parse(localStorage.getItem('thietKeWebServices')) || [];

  // Sync to featured services if empty
  const featuredServices = JSON.parse(localStorage.getItem('featuredServices')) || [];
  if (featuredServices.length === 0) {
    const allServices = [
      ...dangKyKinhDoanhServices,
      ...keToanDoanhNghiepServices,
      ...thueHoKinhDoanhServices,
      ...thietKeWebServices
    ];

    const popularServices = allServices.filter(service => service.popular || service.isPopular);
    localStorage.setItem('featuredServices', JSON.stringify(popularServices));
  }

  // Sync to admin dashboard data
  const totalServices = dangKyKinhDoanhServices.length +
                       keToanDoanhNghiepServices.length +
                       thueHoKinhDoanhServices.length +
                       thietKeWebServices.length;

  // Store summary data for admin dashboard
  const summaryData = {
    totalServices,
    serviceCounts: {
      dangKyKinhDoanh: dangKyKinhDoanhServices.length,
      keToanDoanhNghiep: keToanDoanhNghiepServices.length,
      thueHoKinhDoanh: thueHoKinhDoanhServices.length,
      thietKeWeb: thietKeWebServices.length
    },
    lastSync: new Date().toISOString()
  };

  localStorage.setItem('serviceSummary', JSON.stringify(summaryData));
};

/**
 * Cross-port data persistence functionality
 */
const syncMasterData = () => {
  // Try to get master data from any possible source
  const masterData = localStorage.getItem(MASTER_DATA_KEY);

  if (masterData) {
    // Always restore data from master regardless of current storage state
    const parsedMasterData = JSON.parse(masterData);

    // Always restore from master data (this ensures cross-port sync)
    if (parsedMasterData.banners && parsedMasterData.banners.length > 0) {
      localStorage.setItem('banners', JSON.stringify(parsedMasterData.banners));
    }

    if (parsedMasterData.articles && parsedMasterData.articles.length > 0) {
      localStorage.setItem('knowledgeArticles', JSON.stringify(parsedMasterData.articles));
    }

    if (parsedMasterData.featuredArticles && parsedMasterData.featuredArticles.length > 0) {
      localStorage.setItem('featuredArticles', JSON.stringify(parsedMasterData.featuredArticles));
    }

    if (parsedMasterData.blogPosts && parsedMasterData.blogPosts.length > 0) {
      localStorage.setItem('blogPosts', JSON.stringify(parsedMasterData.blogPosts));
    }

    if (parsedMasterData.newsArticles && parsedMasterData.newsArticles.length > 0) {
      localStorage.setItem('newsArticles', JSON.stringify(parsedMasterData.newsArticles));
    }

    if (parsedMasterData.homepageArticles && parsedMasterData.homepageArticles.length > 0) {
      localStorage.setItem('homepageArticles', JSON.stringify(parsedMasterData.homepageArticles));
    }

    if (parsedMasterData.products && parsedMasterData.products.length > 0) {
      localStorage.setItem('homepageProducts', JSON.stringify(parsedMasterData.products));
    }

    if (parsedMasterData.settings) {
      localStorage.setItem('generalSettings', JSON.stringify(parsedMasterData.settings));
    }

    if (parsedMasterData.impressiveNumbers && parsedMasterData.impressiveNumbers.length > 0) {
      localStorage.setItem('impressiveNumbers', JSON.stringify(parsedMasterData.impressiveNumbers));
    }

    // Also restore service data
    if (parsedMasterData.dangKyKinhDoanhServices && parsedMasterData.dangKyKinhDoanhServices.length > 0) {
      localStorage.setItem('dangKyKinhDoanhServices', JSON.stringify(parsedMasterData.dangKyKinhDoanhServices));
    }

    if (parsedMasterData.keToanDoanhNghiepServices && parsedMasterData.keToanDoanhNghiepServices.length > 0) {
      localStorage.setItem('keToanDoanhNghiepServices', JSON.stringify(parsedMasterData.keToanDoanhNghiepServices));
    }

    if (parsedMasterData.thueHoKinhDoanhServices && parsedMasterData.thueHoKinhDoanhServices.length > 0) {
      localStorage.setItem('thueHoKinhDoanhServices', JSON.stringify(parsedMasterData.thueHoKinhDoanhServices));
    }

    if (parsedMasterData.thietKeWebServices && parsedMasterData.thietKeWebServices.length > 0) {
      localStorage.setItem('thietKeWebServices', JSON.stringify(parsedMasterData.thietKeWebServices));
    }
  } else {
    // If no master data exists, create it from current data
    const masterDataObj = {
      banners: JSON.parse(localStorage.getItem('banners') || '[]'),
      articles: JSON.parse(localStorage.getItem('knowledgeArticles') || '[]'),
      featuredArticles: JSON.parse(localStorage.getItem('featuredArticles') || '[]'),
      blogPosts: JSON.parse(localStorage.getItem('blogPosts') || '[]'),
      newsArticles: JSON.parse(localStorage.getItem('newsArticles') || '[]'),
      homepageArticles: JSON.parse(localStorage.getItem('homepageArticles') || '[]'),
      products: JSON.parse(localStorage.getItem('homepageProducts') || '[]'),
      settings: JSON.parse(localStorage.getItem('generalSettings') || '{}'),
      impressiveNumbers: JSON.parse(localStorage.getItem('impressiveNumbers') || '[]'),
      dangKyKinhDoanhServices: JSON.parse(localStorage.getItem('dangKyKinhDoanhServices') || '[]'),
      keToanDoanhNghiepServices: JSON.parse(localStorage.getItem('keToanDoanhNghiepServices') || '[]'),
      thueHoKinhDoanhServices: JSON.parse(localStorage.getItem('thueHoKinhDoanhServices') || '[]'),
      thietKeWebServices: JSON.parse(localStorage.getItem('thietKeWebServices') || '[]'),
      timestamp: new Date().toISOString()
    };

    localStorage.setItem(MASTER_DATA_KEY, JSON.stringify(masterDataObj));
  }

  // Update master data with current data (in case there are newer updates)
  updateMasterData();
};

const updateMasterData = () => {
  const masterData = localStorage.getItem(MASTER_DATA_KEY);
  const currentMaster = masterData ? JSON.parse(masterData) : {};

  // Update master with current data
  const updatedMaster = {
    ...currentMaster,
    banners: JSON.parse(localStorage.getItem('banners') || '[]'),
    articles: JSON.parse(localStorage.getItem('knowledgeArticles') || '[]'),
    featuredArticles: JSON.parse(localStorage.getItem('featuredArticles') || '[]'),
    blogPosts: JSON.parse(localStorage.getItem('blogPosts') || '[]'),
    newsArticles: JSON.parse(localStorage.getItem('newsArticles') || '[]'),
    homepageArticles: JSON.parse(localStorage.getItem('homepageArticles') || '[]'),
    products: JSON.parse(localStorage.getItem('homepageProducts') || '[]'),
    settings: JSON.parse(localStorage.getItem('generalSettings') || '{}'),
    impressiveNumbers: JSON.parse(localStorage.getItem('impressiveNumbers') || '[]'),
    dangKyKinhDoanhServices: JSON.parse(localStorage.getItem('dangKyKinhDoanhServices') || '[]'),
    keToanDoanhNghiepServices: JSON.parse(localStorage.getItem('keToanDoanhNghiepServices') || '[]'),
    thueHoKinhDoanhServices: JSON.parse(localStorage.getItem('thueHoKinhDoanhServices') || '[]'),
    thietKeWebServices: JSON.parse(localStorage.getItem('thietKeWebServices') || '[]'),
    timestamp: new Date().toISOString()
  };

  localStorage.setItem(MASTER_DATA_KEY, JSON.stringify(updatedMaster));
};

/**
 * Initialize default data if not exists
 */
export const initializeDefaultData = () => {
  // First, sync master data to ensure persistence across ports
  syncMasterData();

  // Initialize default services if they don't exist
  if (!localStorage.getItem('dangKyKinhDoanhServices')) {
    const defaultDangKyServices = [
      {
        id: 1,
        name: 'GÓI STARTED',
        price: '1.570.000đ',
        description: 'Dịch vụ thành lập doanh nghiệp cơ bản cho doanh nghiệp mới',
        features: [
          'Soạn/nộp hồ sơ',
          'Đăng bố cáo',
          'Cấp ĐKKD & MST',
          'Dấu tròn'
        ],
        suitableFor: 'Doanh nghiệp mới thành lập',
        timeToComplete: 'Trọn gói 3-5 ngày',
        popular: true
      },
      {
        id: 2,
        name: 'GÓI STANDARD',
        price: '3.239.000đ',
        description: 'Dịch vụ thành lập doanh nghiệp với các tiện ích mở rộng',
        features: [
          'Gói STARTED',
          'Khai thuế ban đầu',
          'Token 12 tháng',
          'Bảng tên công ty',
          'Dấu giám đốc'
        ],
        suitableFor: 'Doanh nghiệp vừa và nhỏ',
        timeToComplete: 'Trọn gói 5-7 ngày',
        popular: false
      }
    ];
    localStorage.setItem('dangKyKinhDoanhServices', JSON.stringify(defaultDangKyServices));
  }

  if (!localStorage.getItem('keToanDoanhNghiepServices')) {
    const defaultKeToanServices = [
      {
        id: 'ktdn1',
        title: 'KẾ TOÁN TM DỊCH VỤ',
        price: '1.500.000đ',
        description: 'Dịch vụ kế toán cho doanh nghiệp thương mại dịch vụ',
        features: [
          'Kê khai thuế GTGT hàng tháng/quý',
          'Kê khai thuế TNCN cuối năm',
          'Lập báo cáo tài chính',
          'Quyết toán thuế cuối năm',
          'Tư vấn kế toán miễn phí'
        ],
        suitableFor: 'Doanh nghiệp thương mại dịch vụ',
        timeComplete: 'Trọn gói 1 năm',
        popular: true,
        isPopular: true
      },
      {
        id: 'ktdn2',
        title: 'KẾ TOÁN THI CÔNG XÂY DỰNG',
        price: '2.500.000đ',
        description: 'Dịch vụ kế toán cho doanh nghiệp thi công xây dựng',
        features: [
          'Kê khai thuế GTGT hàng tháng/quý',
          'Kê khai thuế TNCN cuối năm',
          'Lập báo cáo tài chính',
          'Quyết toán thuế cuối năm',
          'Tư vấn kế toán miễn phí'
        ],
        suitableFor: 'Doanh nghiệp thi công xây dựng',
        timeComplete: 'Trọn gói 1 năm',
        popular: false,
        isPopular: false
      }
    ];
    localStorage.setItem('keToanDoanhNghiepServices', JSON.stringify(defaultKeToanServices));
  }

  if (!localStorage.getItem('thueHoKinhDoanhServices')) {
    const defaultThueServices = [
      {
        id: 1,
        name: 'GÓI CƠ BẢN',
        price: '500.000đ',
        description: 'Dịch vụ kê khai thuế cho hộ kinh doanh cá thể',
        features: [
          'Kê khai thuế GTGT hàng quý',
          'Kê khai thuế TNCN cuối năm',
          'Tư vấn thuế cơ bản',
          'Lưu trữ hồ sơ 1 năm',
          'Hỗ trợ khi cơ quan thuế yêu cầu'
        ],
        suitableFor: 'Hộ kinh doanh nhỏ',
        timeToComplete: 'Trọn gói 1 năm',
        popular: true
      },
      {
        id: 2,
        name: 'GÓI TIÊU CHUẨN',
        price: '1.000.000đ',
        description: 'Dịch vụ kế toán thuế cho hộ kinh doanh quy mô vừa',
        features: [
          'Tất cả dịch vụ gói cơ bản',
          'Lập báo cáo tài chính năm',
          'Tư vấn thuế chuyên sâu',
          'Lưu trữ hồ sơ 2 năm',
          'Hỗ trợ quyết toán thuế'
        ],
        suitableFor: 'Hộ kinh doanh quy mô vừa',
        timeToComplete: 'Trọn gói 1 năm',
        popular: false
      }
    ];
    localStorage.setItem('thueHoKinhDoanhServices', JSON.stringify(defaultThueServices));
  }

  if (!localStorage.getItem('thietKeWebServices')) {
    const defaultWebServices = [
      {
        id: 'web1',
        title: 'WEBSITE CƠ BẢN',
        price: '2.500.000đ',
        description: 'Gói website phù hợp cho cá nhân, hộ kinh doanh nhỏ',
        features: [
          'Tối đa 5 trang nội dung',
          'Thiết kế responsive',
          'Tối ưu SEO cơ bản',
          'Hỗ trợ kỹ thuật 3 tháng'
        ],
        suitableFor: 'Cá nhân, hộ kinh doanh nhỏ',
        timeComplete: '3-5 ngày',
        isPopular: true
      },
      {
        id: 'web2',
        title: 'WEBSITE DOANH NGHIỆP',
        price: '5.000.000đ',
        description: 'Gói website chuyên nghiệp cho doanh nghiệp',
        features: [
          'Tối đa 10 trang nội dung',
          'Thiết kế theo yêu cầu',
          'Tích hợp form liên hệ',
          'Tối ưu SEO nâng cao',
          'Hỗ trợ kỹ thuật 6 tháng'
        ],
        suitableFor: 'Doanh nghiệp vừa và nhỏ',
        timeComplete: '7-10 ngày',
        isPopular: false
      }
    ];
    localStorage.setItem('thietKeWebServices', JSON.stringify(defaultWebServices));
  }

  // Sync all data after initialization
  syncServiceData();
};

/**
 * Call this function to ensure all data is synchronized
 */
export const ensureDataSync = () => {
  // Immediately sync master data to ensure persistence across ports
  syncMasterData();

  initializeDefaultData();
  syncServiceData();

  // Set up periodic sync to keep master data updated
  setInterval(() => {
    updateMasterData();
  }, 10000); // Update master data every 10 seconds for faster sync
};