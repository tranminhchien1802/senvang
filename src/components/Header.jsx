import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Utility function for Vietnamese text normalization and search
const normalizeAndSearch = (text, query) => {
  if (!text || !query) return false;

  // Normalize Vietnamese text (remove accents) for better matching
  const normalizeText = (str) => {
    return str
      .normalize('NFD') // Decompose characters
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .toLowerCase();
  };

  const normalizedText = normalizeText(text);
  const normalizedQuery = normalizeText(query);

  return normalizedText.includes(normalizedQuery);
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [companyInfo, setCompanyInfo] = useState({
    companyName: 'KẾ TOÁN SEN VÀNG',
    logo: ''
  });
  const navigate = useNavigate();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(!!localStorage.getItem('token'));
  const location = useLocation();

  // Load company info from localStorage with improved sync
  useEffect(() => {
    const loadCompanyInfo = async () => {
      // First try to get from backend
      let backendSettings = null;
      try {
        // Import the backend config
        const { getApiUrl } = await import('../config/backendConfig');
        
        const response = await fetch(getApiUrl('/settings/generalSettings'));
        if (response.ok) {
          // Handle both JSON and text responses
          const contentType = response.headers.get('content-type');
          let result;
          if (contentType && contentType.includes('application/json')) {
            result = await response.json();
            if (result.success && result.data) {
              backendSettings = result.data;
            }
          } else {
            // If response is not JSON, try to parse as JSON
            const text = await response.text();
            try {
              result = JSON.parse(text);
              if (result.success && result.data) {
                backendSettings = result.data;
              }
            } catch (parseError) {
              console.warn('Non-JSON response from backend:', text);
            }
          }
        }
      } catch (error) {
        console.warn('Error fetching settings from backend:', error);
        // Use fallback mechanism
        try {
          const { settingsOperationsFallback } = await import('../utils/apiFallback');
          const fallbackResult = settingsOperationsFallback.getSettings('generalSettings');
          if (fallbackResult.success) {
            backendSettings = fallbackResult.data;
          } else {
            // If fallback also fails, use empty object
            backendSettings = {};
          }
        } catch (fallbackError) {
          console.warn('Error using fallback for settings:', fallbackError);
          // Final fallback to localStorage
          const localSettings = JSON.parse(localStorage.getItem('generalSettings') || '{}');
          backendSettings = localSettings;
        }
      }

      // Try multiple storage keys to ensure we get the latest data
      let savedSettings = {};
      
      // First try generalSettings from localStorage
      const generalSettingsStr = localStorage.getItem('generalSettings');
      if (generalSettingsStr) {
        try {
          savedSettings = JSON.parse(generalSettingsStr);
        } catch (e) {
          console.warn('Error parsing generalSettings:', e);
        }
      }
      
      // Then try master data as fallback
      if (!savedSettings.logo && !savedSettings.companyName) {
        const masterDataStr = localStorage.getItem('master_website_data_v2');
        if (masterDataStr) {
          try {
            const masterData = JSON.parse(masterDataStr);
            if (masterData.settings) {
              savedSettings = { ...savedSettings, ...masterData.settings };
            }
          } catch (e) {
            console.warn('Error parsing master_website_data_v2:', e);
          }
        }
      }

      // Use backend settings if available, otherwise use local settings
      const finalSettings = backendSettings || savedSettings;

      setCompanyInfo({
        companyName: finalSettings.companyName || 'KẾ TOÁN SEN VÀNG',
        logo: finalSettings.logo || ''
      });
    };

    loadCompanyInfo();

    // Listen for settings updates from other components
    const handleSettingsUpdate = (e) => {
      const settings = e.detail || {};
      setCompanyInfo({
        companyName: settings.companyName || 'KẾ TOÁN SEN VÀNG',
        logo: settings.logo || ''
      });
    };

    // Listen for server settings updates
    const handleServerSettingsUpdate = (e) => {
      console.log('Server settings update received:', e.detail); // Debug log
      setCompanyInfo({
        companyName: e.detail.companyName || 'KẾ TOÁN SEN VÀNG',
        logo: e.detail.logo || ''
      });
    };

    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    window.addEventListener('settingsDataUpdated', handleServerSettingsUpdate);

    // Also listen for forceDataSync events
    const handleForceSync = () => {
      loadCompanyInfo();
    };

    window.addEventListener('forceDataSync', handleForceSync);

    // Also periodically check for updates (every 5 seconds) to sync with backend
    const interval = setInterval(() => {
      loadCompanyInfo(); // Refresh from backend periodically
    }, 5000);

    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
      window.removeEventListener('settingsDataUpdated', handleServerSettingsUpdate);
      window.removeEventListener('forceDataSync', handleForceSync);
      clearInterval(interval);
    };
  }, []);


  const menuItems = [
    { name: 'Trang Chủ', path: '/' },
    { name: 'Đăng Ký Kinh Doanh', path: '/dang-ky-kinh-doanh' },
    { name: 'Kế Toán Doanh Nghiệp', path: '/ke-toan-doanh-nghiep' },
    { name: 'Thuế Hộ Kinh Doanh', path: '/thue-ho-kinh-doanh' },
    { name: 'Thiết Kế Web', path: '/thiet-ke-web' },
    { name: 'Kiến Thức', path: '/kien-thuc' },
    { name: 'Liên Hệ', path: '/ContactForm' },
  ];

  // Xử lý sự kiện cuộn trang
  useEffect(() => {
    const handleScroll = () => {
      // 1. Kiểm tra xem đã cuộn chưa để đổi style header
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // 2. Tính toán thanh tiến trình (Scroll Progress Bar)
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Search functionality
  useEffect(() => {
    // Import services data for search
    const searchServices = async () => {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        return;
      }

      try {
        // Dynamically import the services data
        const { servicesData, otherServicesData } = await import('../data/servicesData');

        // Package data for new service categories
        const dangKyKinhDoanhPackages = [
          { id: 'dkkd1', title: 'GÓI KHỞI NGHIỆP', description: 'Thành lập doanh nghiệp cơ bản', price: '1.500.000đ', path: '/dang-ky-kinh-doanh', type: 'package' },
          { id: 'dkkd2', title: 'GÓI CƠ BẢN', description: 'Thành lập doanh nghiệp cơ bản với các tiện ích mở rộng', price: '2.500.000đ', path: '/dang-ky-kinh-doanh', type: 'package' },
          { id: 'dkkd3', title: 'GÓI TIÊU CHUẨN', description: 'Gói dịch vụ hoàn chỉnh cho doanh nghiệp mới thành lập', price: '4.500.000đ', path: '/dang-ky-kinh-doanh', type: 'package' },
          { id: 'dkkd4', title: 'GÓI NÂNG CAO', description: 'Gói dịch vụ chuyên sâu với nhiều tiện ích hỗ trợ', price: '6.000.000đ', path: '/dang-ky-kinh-doanh', type: 'package' }
        ];

        const keToanDoanhNghiepPackages = [
          { id: 'ktdn1', title: 'GÓI KHỞI NGHIỆP', description: 'Dịch vụ kế toán cơ bản cho doanh nghiệp mới', price: '1.500.000đ', path: '/ke-toan-doanh-nghiep', type: 'package' },
          { id: 'ktdn2', title: 'GÓI CƠ BẢN', description: 'Dịch vụ kế toán hoàn chỉnh cho doanh nghiệp', price: '2.500.000đ', path: '/ke-toan-doanh-nghiep', type: 'package' },
          { id: 'ktdn3', title: 'GÓI TIÊU CHUẨN', description: 'Gói dịch vụ kế toán chuyên nghiệp', price: '4.500.000đ', path: '/ke-toan-doanh-nghiep', type: 'package' },
          { id: 'ktdn4', title: 'GÓI NÂNG CAO', description: 'Gói dịch vụ kế toán cao cấp', price: '6.000.000đ', path: '/ke-toan-doanh-nghiep', type: 'package' }
        ];

        const thueHoKinhDoanhPackages = [
          { id: 'thhd1', title: 'GÓI CƠ BẢN', description: 'Dịch vụ kê khai thuế cho hộ kinh doanh cá thể', price: '500.000đ', path: '/thue-ho-kinh-doanh', type: 'package' },
          { id: 'thhd2', title: 'GÓI TIÊU CHUẨN', description: 'Dịch vụ kế toán thuế cho hộ kinh doanh quy mô vừa', price: '1.000.000đ', path: '/thue-ho-kinh-doanh', type: 'package' },
          { id: 'thhd3', title: 'GÓI NÂNG CAO', description: 'Dịch vụ kế toán thuế trọn gói cho hộ kinh doanh', price: '1.500.000đ', path: '/thue-ho-kinh-doanh', type: 'package' },
          { id: 'thhd4', title: 'GÓI VIP', description: 'Dịch vụ kế toán thuế chuyên nghiệp cho hộ kinh doanh', price: '2.000.000đ', path: '/thue-ho-kinh-doanh', type: 'package' }
        ];

        const thietKeWebPackages = [
          { id: 'web1', title: 'WEBSITE CƠ BẢN', description: 'Gói website phù hợp cho cá nhân, hộ kinh doanh nhỏ', price: '2.500.000đ', path: '/thiet-ke-web', type: 'package' },
          { id: 'web2', title: 'WEBSITE DOANH NGHIỆP', description: 'Gói website chuyên nghiệp cho doanh nghiệp', price: '5.000.000đ', path: '/thiet-ke-web', type: 'package' },
          { id: 'web3', title: 'WEBSITE BÁN HÀNG', description: 'Gói website bán hàng chuyên nghiệp', price: '8.000.000đ', path: '/thiet-ke-web', type: 'package' },
          { id: 'web4', title: 'WEBSITE THEO YÊU CẦU', description: 'Gói website tùy chỉnh theo yêu cầu đặc biệt', price: 'Liên hệ', path: '/thiet-ke-web', type: 'package' }
        ];

        // Combine all services for search
        const allServices = [
          ...servicesData.map(service => ({
            ...service,
            path: service.title.includes('Đăng ký kinh doanh') ? '/dang-ky-kinh-doanh' :
                  service.title.includes('Kế toán doanh nghiệp') ? '/ke-toan-doanh-nghiep' :
                  service.title.includes('Thuế hộ kinh doanh') ? '/thue-ho-kinh-doanh' :
                  service.title.includes('Thiết kế web') ? '/thiet-ke-web' : '/',
            type: 'service'
          })),
          ...otherServicesData.map(service => ({
            ...service,
            path: service.title.includes('Đăng ký kinh doanh') ? '/dang-ky-kinh-doanh' :
                  service.title.includes('Kế toán doanh nghiệp') ? '/ke-toan-doanh-nghiep' :
                  service.title.includes('Thuế hộ kinh doanh') ? '/thue-ho-kinh-doanh' :
                  service.title.includes('Thiết kế web') ? '/thiet-ke-web' : '/',
            type: 'service'
          })),
          ...dangKyKinhDoanhPackages,
          ...keToanDoanhNghiepPackages,
          ...thueHoKinhDoanhPackages,
          ...thietKeWebPackages
        ];

        // Additional content for search - only major sections and titles (no redundant items)
        const additionalContent = [
          // New service pages major sections
          { id: 'dkkd-section1', title: 'DỊCH VỤ ĐĂNG KÝ KINH DOANH', description: 'Phần tiêu đề dịch vụ chính', path: '/dang-ky-kinh-doanh', type: 'major-section' },
          { id: 'ktdn-section1', title: 'DỊCH VỤ KẾ TOÁN DOANH NGHIỆP', description: 'Phần tiêu đề dịch vụ chính', path: '/ke-toan-doanh-nghiep', type: 'major-section' },
          { id: 'thhd-section1', title: 'DỊCH VỤ THUẾ HỘ KINH DOANH', description: 'Phần tiêu đề dịch vụ chính', path: '/thue-ho-kinh-doanh', type: 'major-section' },
          { id: 'web-section1', title: 'DỊCH VỤ THIẾT KẾ WEBSITE', description: 'Phần tiêu đề dịch vụ chính', path: '/thiet-ke-web', type: 'major-section' }
        ];

        // Combine all services and additional content for search
        const searchableItems = [
          ...allServices,
          ...additionalContent
        ];

        // Search through all content with normalized matching
        const results = searchableItems.filter(item => {
          const itemTitle = item.title || '';
          const itemDescription = item.description || '';
          const itemPrice = item.price || '';

          return normalizeAndSearch(itemTitle, searchQuery) ||
                 normalizeAndSearch(itemDescription, searchQuery) ||
                 normalizeAndSearch(itemPrice, searchQuery);
        });

        setSearchResults(results);
      } catch (error) {
        console.error('Error loading services data:', error);
        setSearchResults([]);
      }
    };

    searchServices();
  }, [searchQuery]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('user');
    setIsUserLoggedIn(false);
    window.location.reload();
  };

  const goToLogin = (mode = 'login') => {
    const redirect = location.pathname;
    const params = new URLSearchParams();
    if (mode === 'register') {
      params.append('mode', 'register');
    }
    if (redirect !== '/') {
      params.append('redirect', redirect);
    }
    const queryString = params.toString();
    navigate(`/login${queryString ? '?' + queryString : ''}`);
  };

  return (
    // Header chính: Thêm transition để mượt mà khi đổi màu/kích thước
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Logo Area - Hàng riêng */}
      <div className={`w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md py-1' // Khi cuộn: Nền trắng trong suốt, nhỏ gọn
          : 'bg-white py-3' // Mặc định: Nền trắng, cao hơn để tạo không gian cho logo lớn
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-start"> {/* Căn trái logo trên cả mobile và desktop */}
            {/* --- LOGO --- */}
            <div className="flex-shrink-0 flex items-center" style={{ padding: '5px 0' }}>
              <Link to="/" className="relative group flex items-center">
                {companyInfo.logo ? (
                  <img
                    src={companyInfo.logo}
                    alt={companyInfo.companyName || "KẾ TOÁN SEN VÀNG"}
                    className="h-30 w-auto object-contain max-h-30" /* Half of h-60 = h-30 */
                    style={{
                      maxHeight: '7.5rem', /* Half of 15rem = 7.5rem */
                      width: 'auto',
                      minWidth: '250px' /* Half of 500px = 250px */
                    }}
                  />
                ) : (
                  <span className="text-4xl font-bold text-[#D4AF37] w-full md:w-auto">
                    {companyInfo.companyName || "KẾ TOÁN SEN VÀNG"}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Area - Hàng riêng với nền màu */}
      <div className="w-full bg-[#D4AF37]"> {/* Màu nền giống màu chủ đạo của website */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">

            {/* --- DESKTOP MENU --- */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-4 w-full">
              <nav className="flex flex-nowrap justify-center items-center space-x-1 lg:space-x-2 overflow-x-auto w-full" style={{ whiteSpace: 'nowrap' }}>
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative font-medium text-sm md:text-base transition-all duration-300 px-2 py-1 group flex-shrink-0 ${
                      location.pathname === item.path
                        ? 'text-white font-bold' // Khi active thì chữ trắng và đậm
                        : 'text-white hover:text-gray-200' // Chữ trắng, hover sang xám nhạt
                    }`}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {item.name}
                    {/* Hiệu ứng gạch chân chạy từ giữa ra 2 bên */}
                    <span className={`absolute bottom-0 left-1/2 w-0 h-0.5 bg-white transition-all duration-300 -translate-x-1/2 group-hover:w-full ${location.pathname === item.path ? 'w-full' : ''}`}></span>
                  </Link>
                ))}
              </nav>

              {/* Auth Buttons - Desktop */}
              <div className="flex items-center space-x-4 flex-shrink-0">
                {isUserLoggedIn ? (
                  <div className="flex items-center space-x-4">
                    <span className="text-white text-sm">Xin chào, {localStorage.getItem('userName') || localStorage.getItem('userEmail')?.split('@')[0]}</span>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                    >
                      Đăng xuất
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => goToLogin('login')}
                      className="px-4 py-2 bg-white text-[#D4AF37] rounded font-medium hover:bg-gray-100 transition-colors text-sm"
                    >
                      Đăng nhập
                    </button>
                    <button
                      onClick={() => goToLogin('register')}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded font-medium hover:bg-gray-300 transition-colors text-sm"
                    >
                      Đăng ký
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* --- MOBILE MENU BUTTON --- */}
            <div className="md:hidden flex items-center flex-shrink-0">
              <button
                onClick={toggleMenu}
                className="text-white hover:text-gray-200 focus:outline-none p-2"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- SCROLL PROGRESS BAR (Thanh tiến trình đọc - Đặc biệt) --- */}
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-100 ease-out z-50"
        style={{ width: `${scrollProgress}%`, boxShadow: '0 0 10px #007bff' }}
      ></div>

      {/* --- MOBILE MENU (Animation Slide Down) --- */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-gray-200 ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-3 rounded-md text-base font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-[#D4AF37] text-white font-bold shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-[#D4AF37]'
              }`}
            >
              {item.name}
            </Link>
          ))}
          {/* Search Bar for Mobile - Only show on service pages */}
          {(location.pathname.includes('/dang-ky-kinh-doanh') ||
            location.pathname.includes('/ke-toan-doanh-nghiep') ||
            location.pathname.includes('/thue-ho-kinh-doanh') ||
            location.pathname.includes('/thiet-ke-web')) && (
            <div className="relative mt-4">
              <input
                type="text"
                placeholder="Tìm kiếm dịch vụ..."
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchResults(true)}
              />
              <svg
                className="absolute right-3 top-2.5 h-5 w-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>

              {/* Search Results Dropdown for Mobile */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto backdrop-blur-sm">
                  {searchResults.map((result) => (
                    <Link
                      key={result.id}
                      to={`${result.path || location.pathname}${searchQuery ? '?search=' + encodeURIComponent(searchQuery) : ''}`}
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                      onClick={(e) => {
                        setSearchQuery('');
                        setShowSearchResults(false);
                        setIsMenuOpen(false); // Close mobile menu after selection

                        // If this is a section type result, we might want to handle it specially
                        if (result.type === 'section' || result.type === 'subsection') {
                          // Navigate to the page, and potentially scroll to section later
                          // For now, we just navigate to the page with search params
                        }
                      }}
                    >
                      <div className="font-bold text-primary">{result.title}</div>
                      {result.description && (
                        <div className="text-sm text-gray-600 mt-1 truncate">{result.description}</div>
                      )}
                      {result.price && (
                        <div className="text-xs text-primary mt-1">{result.price}</div>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Auth Buttons - Mobile */}
          <div className="flex flex-col space-y-2 mt-4">
            {isUserLoggedIn ? (
              <div className="flex flex-col space-y-2">
                <span className="text-gray-600 text-center">Xin chào, {localStorage.getItem('userName') || localStorage.getItem('userEmail')?.split('@')[0]}</span>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-red-600 text-white rounded font-medium hover:bg-red-700 transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    goToLogin('login');
                    setIsMenuOpen(false);
                  }}
                  className="px-4 py-3 bg-[#D4AF37] text-white rounded font-medium hover:bg-[#b8942f] transition-colors"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => {
                    goToLogin('register');
                    setIsMenuOpen(false);
                  }}
                  className="px-4 py-3 bg-gray-200 text-gray-800 rounded font-medium hover:bg-gray-300 transition-colors"
                >
                  Đăng ký
                </button>
              </div>
            )}
          </div>

          {/* Nút gọi trên mobile */}
          <a href="tel:0932097986" className="block text-center mt-4 px-4 py-3 border border-primary text-primary rounded-md font-bold hover:bg-primary hover:text-white transition-colors">
            GỌI NGAY: 093 209 7986
          </a>
        </div>
      </div>

    </header>
  );
};

export default Header;