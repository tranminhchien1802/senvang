// File: src/pages/DichVu.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PurchaseModal from '../components/PurchaseModal';
import ServiceOrderForm from '../components/ServiceOrderForm';
import emailjs from '@emailjs/browser';

const DichVu = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  // State for service page search bar
  const [pageSearchQuery, setPageSearchQuery] = useState(searchQuery);
  const [pageSearchResults, setPageSearchResults] = useState([]);
  const [showPageSearchResults, setShowPageSearchResults] = useState(false);

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

  // Lấy dữ liệu gói dịch vụ từ localStorage (được quản lý từ admin)
  const [packages, setPackages] = useState([]);

  // Load packages from localStorage
  useEffect(() => {
    const loadPackages = () => {
      let savedPackages = [];
      try {
        const storedPackages = localStorage.getItem('dichVuPackages');
        savedPackages = storedPackages ? JSON.parse(storedPackages) : [];
      } catch (error) {
        console.error('Error loading DichVu packages:', error);
        savedPackages = [];
      }
      setPackages(savedPackages);
    };

    loadPackages();

    // Listen for changes to the packages in localStorage
    const handleStorageChange = () => {
      loadPackages();
    };

    window.addEventListener('storage', handleStorageChange);

    // Clean up event listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Search functionality for the page
  useEffect(() => {
    if (pageSearchQuery.trim() === '') {
      setPageSearchResults([]);
      return;
    }

    // Combine packages with other content for search
    const searchableItems = [];

    // Add packages to search
    packages.forEach(pkg => {
      searchableItems.push({
        ...pkg,
        type: 'package',
        path: '/dich-vu',
        title: pkg.title || pkg.name,
        description: pkg.description,
        price: pkg.price
      });
    });

    // Add other page content to search
    const additionalContent = [
      { id: 'section-hero', title: 'DỊCH VỤ THÀNH LẬP & VẬN HÀNH DOANH NGHIỆP', path: '/dich-vu', type: 'section' },
      { id: 'section-services', title: 'CÁC LĨNH VỰC HOẠT ĐỘNG CHỦ ĐẠO', path: '/dich-vu', type: 'section' },
      { id: 'section-packages', title: 'CÁC GÓI THÀNH LẬP KHUYẾN MÃI', path: '/dich-vu', type: 'section' },
    ];

    searchableItems.push(...additionalContent);

    // Search through all content with normalized matching
    const results = searchableItems.filter(item => {
      const itemTitle = item.title || '';
      const itemDescription = item.description || '';
      const itemPrice = item.price || '';

      return normalizeAndSearch(itemTitle, pageSearchQuery) ||
             normalizeAndSearch(itemDescription, pageSearchQuery) ||
             normalizeAndSearch(itemPrice, pageSearchQuery);
    });

    setPageSearchResults(results);
  }, [pageSearchQuery, packages]);

  // State for sorting
  const [sortOption, setSortOption] = useState('none'); // 'none', 'asc', 'desc'

  // Sort and filter packages
  const filteredAndSortedPackages = searchQuery
    ? packages.filter(pkg =>
        ((pkg.title || pkg.name) &&
         ((pkg.title && pkg.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (pkg.name && pkg.name.toLowerCase().includes(searchQuery.toLowerCase())))) ||
        (pkg.description && pkg.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (pkg.features && Array.isArray(pkg.features) && pkg.features.some(feature => feature && feature.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (pkg.suitableFor && pkg.suitableFor.toLowerCase().includes(searchQuery.toLowerCase())) ||
        // Also search in price (extract numeric values from price string)
        (pkg.price && pkg.price.toString().replace(/[^\d]/g, '').includes(searchQuery.replace(/[^\d]/g, '')))
      )
    : packages;

  // Apply sorting based on price if selected
  const sortedPackages = [...filteredAndSortedPackages].sort((a, b) => {
    if (sortOption === 'asc' || sortOption === 'desc') {
      // Extract numeric value from the price string (remove non-digits and non-commas, then format)
      let priceA = 0;
      let priceB = 0;

      if (a.price !== undefined && a.price !== null) {
        // If price is already a number, use it directly
        if (typeof a.price === 'number') {
          priceA = a.price;
        } else {
          // Format: 1.500.000đ -> extract 1500000
          priceA = parseFloat(a.price.toString().replace(/[^\d]/g, '')) || 0;
        }
      }

      if (b.price !== undefined && b.price !== null) {
        if (typeof b.price === 'number') {
          priceB = b.price;
        } else {
          priceB = parseFloat(b.price.toString().replace(/[^\d]/g, '')) || 0;
        }
      }

      if (sortOption === 'asc') {
        return priceA - priceB;
      } else if (sortOption === 'desc') {
        return priceB - priceA;
      }
    }
    return 0;
  });

  const filteredPackages = sortedPackages;

  // Function to open order form
  const onOpenOrderForm = (pkg) => {
    setSelectedPackage(pkg);
    setIsOrderFormOpen(true);
  };

  // Effect to scroll to relevant sections when search query matches section titles
  useEffect(() => {
    if (searchQuery) {
      // Scroll to relevant sections based on search query
      const normalizedQuery = searchQuery.toLowerCase();

      // Check for common section titles and scroll to them
      if (normalizedQuery.includes('các lĩnh vực') || normalizedQuery.includes('lĩnh vực hoạt động') || normalizedQuery.includes('lĩnh vực')) {
        // Scroll to the services section
        const servicesSection = document.querySelector('.services-grid-section');
        if (servicesSection) {
          servicesSection.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (normalizedQuery.includes('gói') || normalizedQuery.includes('gói thành lập') || normalizedQuery.includes('khuyến mãi')) {
        // Scroll to the packages section
        const packagesSection = document.querySelector('.packages-section');
        if (packagesSection) {
          packagesSection.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (normalizedQuery.includes('dịch vụ') && normalizedQuery.includes('thành lập')) {
        // Scroll to the hero section
        const heroSection = document.querySelector('.hero-service-section');
        if (heroSection) {
          heroSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#1A1A1A', color: '#E0E0E0' }}>
      {/* Search Bar - Below the header */}
      <div className="container max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Tìm kiếm dịch vụ..."
              className="w-full px-4 py-3 bg-[#333] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] transition-all duration-300"
              value={pageSearchQuery}
              onChange={(e) => setPageSearchQuery(e.target.value)}
              onFocus={() => setShowPageSearchResults(true)}
              onBlur={() => setTimeout(() => setShowPageSearchResults(false), 200)}
            />
            <svg
              className="absolute right-3 top-3.5 h-6 w-6 text-gray-400"
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

            {/* Search Results Dropdown */}
            {showPageSearchResults && pageSearchResults.length > 0 && (
              <div className="absolute z-50 mt-2 w-full bg-[#282828] border border-[#444] rounded-lg shadow-xl max-h-80 overflow-y-auto backdrop-blur-sm">
                {pageSearchResults.map((result) => (
                  <a
                    key={result.id}
                    href={`${result.path || location.pathname}${pageSearchQuery ? '?search=' + encodeURIComponent(pageSearchQuery) : ''}`}
                    className="block px-4 py-3 text-gray-300 hover:bg-[#333] hover:text-[#FFD700] border-b border-[#444] last:border-b-0 transition-colors duration-200"
                    onClick={(e) => {
                      setPageSearchQuery('');
                      setShowPageSearchResults(false);

                      // If this is a section type result, we might want to handle it specially
                      if (result.type === 'section' || result.type === 'subsection') {
                        // Navigate to the page, and potentially scroll to section later
                        // For now, we just navigate to the page with search params
                      }
                    }}
                  >
                    <div className="font-bold text-[#FFD700]">{result.title}</div>
                    {result.description && (
                      <div className="text-sm text-gray-400 mt-1 truncate">{result.description}</div>
                    )}
                    {result.price && (
                      <div className="text-xs text-[#FFD700] mt-1">{result.price}</div>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Sort Controls */}
          <div className="flex items-center">
            <label className="text-gray-300 mr-2">Sắp xếp:</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-[#333] text-white px-3 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
            >
              <option value="none">Mặc định</option>
              <option value="asc">Giá tăng dần</option>
              <option value="desc">Giá giảm dần</option>
            </select>
          </div>
        </div>
      </div>
      {/* Inject shimmer animation style */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes shimmer {
              0% { transform: translateX(-150%) skewX(-20deg); }
              100% { transform: translateX(150%) skewX(-20deg); }
            }
          `,
        }}
      />

      {/* Hero Service Section */}
      <section className="hero-service-section bg-[#1A1A1A] py-20 text-center border-b border-[#333]">
        <div className="container max-w-6xl mx-auto px-4">
          <h1
            className="text-3xl md:text-5xl font-bold text-white mb-6 uppercase tracking-wide"
            style={{
              borderBottom: '4px solid #FFD700',
              display: 'inline-block',
              paddingBottom: '10px',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            DỊCH VỤ THÀNH LẬP & VẬN HÀNH DOANH NGHIỆP
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg mt-4">
            Giải pháp toàn diện tối ưu hóa từ A-Z cho doanh nghiệp của bạn.
          </p>
        </div>
      </section>

      {/* Services Grid Section (Các lĩnh vực hoạt động) */}
      <section className="services-grid-section py-20 bg-[#202020]">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-[#FFD700] uppercase tracking-wider">
            CÁC LĨNH VỰC HOẠT ĐỘNG CHỦ ĐẠO
          </h2>
          
          <div className="services-grid grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Service 1 */}
            <div className="service-card bg-[#282828] p-8 border-l-4 border-[#FFD700] rounded hover:bg-[#333] transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <span className="text-6xl font-bold text-[#FFD700]">01</span>
              </div>
              <h4 className="text-xl font-bold text-[#FFD700] mb-4 flex items-center relative z-10">
                <span className="bg-[#FFD700] text-black w-8 h-8 flex items-center justify-center rounded-full mr-3 text-sm font-bold">01</span>
                ĐĂNG KÝ KINH DOANH
              </h4>
              <p className="text-gray-300 mb-4 relative z-10">
                Thực hiện trọn gói hồ sơ và thủ tục đăng ký thành lập mới, thay đổi nội dung ĐKKD nhanh chóng.
              </p>
              <ul className="text-gray-400 space-y-2 text-sm relative z-10">
                 <li><span className="text-[#FFD700] mr-2">✓</span>Thành lập công ty toàn quốc</li>
                 <li><span className="text-[#FFD700] mr-2">✓</span>Thành lập chi nhánh, kho hàng</li>
                 <li><span className="text-[#FFD700] mr-2">✓</span>Thay đổi nội dung ĐKKD</li>
              </ul>
              {/* Shimmer effect for service cards too */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 translate-x-[-100%] group-hover:animate-[shimmer_1s_infinite]"></div>
            </div>

            {/* Service 2 */}
            <div className="service-card bg-[#282828] p-8 border-l-4 border-[#FFD700] rounded hover:bg-[#333] transition-all duration-300 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <span className="text-6xl font-bold text-[#FFD700]">02</span>
              </div>
              <h4 className="text-xl font-bold text-[#FFD700] mb-4 flex items-center relative z-10">
                 <span className="bg-[#FFD700] text-black w-8 h-8 flex items-center justify-center rounded-full mr-3 text-sm font-bold">02</span>
                 THUẾ & KẾ TOÁN
              </h4>
              <p className="text-gray-300 mb-4 relative z-10">
                Tối ưu hóa chi phí thuế, đảm bảo tuân thủ pháp luật và giảm thiểu rủi ro cho doanh nghiệp.
              </p>
              <ul className="text-gray-400 space-y-2 text-sm relative z-10">
                 <li><span className="text-[#FFD700] mr-2">✓</span>Khai báo thuế, Hoàn thiện sổ sách</li>
                 <li><span className="text-[#FFD700] mr-2">✓</span>Quyết toán thuế TNDN – TNCN</li>
                 <li><span className="text-[#FFD700] mr-2">✓</span>Bảo hiểm xã hội & lao động</li>
              </ul>
            </div>

             {/* Service 3 */}
             <div className="service-card bg-[#282828] p-8 border-l-4 border-[#FFD700] rounded hover:bg-[#333] transition-all duration-300 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <span className="text-6xl font-bold text-[#FFD700]">03</span>
              </div>
              <h4 className="text-xl font-bold text-[#FFD700] mb-4 flex items-center relative z-10">
                 <span className="bg-[#FFD700] text-black w-8 h-8 flex items-center justify-center rounded-full mr-3 text-sm font-bold">03</span>
                 TIẾP THỊ & WEBSITE
              </h4>
              <p className="text-gray-300 mb-4 relative z-10">
                Xây dựng hiện diện trực tuyến chuyên nghiệp và bảo hộ thương hiệu bền vững.
              </p>
              <ul className="text-gray-400 space-y-2 text-sm relative z-10">
                 <li><span className="text-[#FFD700] mr-2">✓</span>Thiết kế Logo & Website</li>
                 <li><span className="text-[#FFD700] mr-2">✓</span>Đăng ký bảo hộ thương hiệu</li>
                 <li><span className="text-[#FFD700] mr-2">✓</span>Thông báo bộ công thương</li>
              </ul>
            </div>

             {/* Service 4 */}
             <div className="service-card bg-[#282828] p-8 border-l-4 border-[#FFD700] rounded hover:bg-[#333] transition-all duration-300 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <span className="text-6xl font-bold text-[#FFD700]">04</span>
              </div>
              <h4 className="text-xl font-bold text-[#FFD700] mb-4 flex items-center relative z-10">
                 <span className="bg-[#FFD700] text-black w-8 h-8 flex items-center justify-center rounded-full mr-3 text-sm font-bold">04</span>
                 TƯ VẤN CHIẾN LƯỢC
              </h4>
              <p className="text-gray-300 mb-4 relative z-10">
                Đồng hành cùng doanh nghiệp giải quyết các bài toán khó về vận hành và tài chính.
              </p>
              <ul className="text-gray-400 space-y-2 text-sm relative z-10">
                 <li><span className="text-[#FFD700] mr-2">✓</span>Tư vấn nghiệp vụ chuyên sâu</li>
                 <li><span className="text-[#FFD700] mr-2">✓</span>Hỗ trợ ngoài giờ hành chính</li>
                 <li><span className="text-[#FFD700] mr-2">✓</span>Định hình giá trị thương hiệu</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section — Styled matching "Dịch Vụ Khác" (Yellow Cards) */}
      <section className="packages-section py-20 bg-[#1A1A1A]">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#FFD700] uppercase tracking-wide">
            CÁC GÓI THÀNH LẬP KHUYẾN MÃI
          </h2>
          
          <div className="intro-text text-gray-300 mb-12 max-w-4xl mx-auto text-center">
            <p className="text-lg">
              Lựa chọn gói dịch vụ phù hợp nhất với quy mô doanh nghiệp của bạn với chi phí minh bạch.
            </p>
          </div>

          {/* Search and Sort Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
            <div className="relative flex-grow max-w-md">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc giá gói..."
                className="w-full px-6 py-3 bg-[#333] text-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
                value={pageSearchQuery}
                onChange={(e) => setPageSearchQuery(e.target.value)}
                onFocus={() => setShowPageSearchResults(true)}
                onBlur={() => setTimeout(() => setShowPageSearchResults(false), 200)}
              />
              <svg
                className="absolute right-4 top-3.5 h-6 w-6 text-gray-400"
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

              {/* Search Results Dropdown */}
              {showPageSearchResults && pageSearchResults.length > 0 && (
                <div className="absolute z-50 mt-2 w-full bg-[#282828] border border-[#444] rounded-lg shadow-xl max-h-80 overflow-y-auto backdrop-blur-sm">
                  {pageSearchResults.map((result) => (
                    <a
                      key={result.id}
                      href={`${result.path || location.pathname}${pageSearchQuery ? '?search=' + encodeURIComponent(pageSearchQuery) : ''}`}
                      className="block px-4 py-3 text-gray-300 hover:bg-[#333] hover:text-[#FFD700] border-b border-[#444] last:border-b-0 transition-colors duration-200"
                      onClick={(e) => {
                        setPageSearchQuery('');
                        setShowPageSearchResults(false);

                        // If this is a section type result, we might want to handle it specially
                        if (result.type === 'section' || result.type === 'subsection') {
                          // Navigate to the page, and potentially scroll to section later
                          // For now, we just navigate to the page with search params
                        }
                      }}
                    >
                      <div className="font-bold text-[#FFD700]">{result.title}</div>
                      {result.description && (
                        <div className="text-sm text-gray-400 mt-1 truncate">{result.description}</div>
                      )}
                      {result.price && (
                        <div className="text-xs text-[#FFD700] mt-1">{result.price}</div>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <label className="text-gray-300 whitespace-nowrap">Sắp xếp theo:</label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-4 py-3 bg-[#333] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
              >
                <option value="none">Mặc định</option>
                <option value="asc">Giá tăng dần</option>
                <option value="desc">Giá giảm dần</option>
              </select>
            </div>
          </div>

          <div className="packages-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg._id || pkg.id || pkg.title}
                className={`package-card flex flex-col justify-between rounded-lg shadow-xl relative overflow-hidden group transition-transform duration-300 hover:-translate-y-2
                  ${pkg.isPopular ? 'ring-4 ring-white transform scale-105 z-10' : ''}
                `}
                style={{
                  backgroundColor: pkg.isPopular ? '#FFD700' : '#FFD700', // Popular packages with yellow background
                  color: pkg.isPopular ? '#1A1A1A' : '#1A1A1A', // Popular packages with dark text
                  minHeight: '420px',
                }}
              >
                {/* Shimmer Effect Overlay */}
                <div
                  className="shimmer absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)',
                    width: '50%',
                    height: '100%',
                    transform: 'skewX(-20deg)',
                    animation: 'shimmer 1.5s infinite',
                    zIndex: '20',
                  }}
                ></div>

                <div className="p-8 relative z-10 flex-grow text-center">
                   {pkg.isPopular && (
                     <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase">
                       Phổ biến
                     </div>
                   )}
                   
                  <h3 className="text-xl font-bold mb-4 uppercase border-b-2 border-black pb-2 inline-block w-full">
                    {pkg.title}
                  </h3>

                  <div className="price-group mb-6">
                    <span className={`text-3xl font-black ${pkg.price === 'Liên hệ' || pkg.price === 'Thương lượng' ? 'text-red-600' : 'text-[#D32F2F]'}`}>
                      {pkg.price}
                    </span>
                  </div>

                  <div className="mb-4 text-left pl-4">
                    <p className="text-base font-semibold text-gray-900">
                      {pkg.description}
                    </p>
                    {pkg.suitableFor && pkg.suitableFor.trim() !== '' && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-800 font-bold mb-1">Phù hợp với:</p>
                        <p className="text-sm text-gray-700">{pkg.suitableFor}</p>
                      </div>
                    )}
                    {pkg.timeComplete && pkg.timeComplete.trim() !== '' && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-800 font-bold mb-1">Thời gian hoàn thành:</p>
                        <p className="text-sm text-gray-700">{pkg.timeComplete}</p>
                      </div>
                    )}
                  </div>

                  {pkg.features && Array.isArray(pkg.features) && pkg.features.length > 0 && (
                    <ul className="space-y-2 mb-4 text-left pl-4">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start text-sm font-semibold text-gray-900">
                          <span className="text-red-600 font-bold mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="p-6 pt-0 relative z-10">
                  <button
                    className="w-full py-3 px-6 rounded font-bold uppercase tracking-wider transition-all duration-300 shadow-md border-2 border-[#1A1A1A]"
                    style={{
                       backgroundColor: '#1A1A1A', // Mặc định: Nền Đen
                       color: '#FFD700', // Mặc định: Chữ Vàng
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#D32F2F'; // Hover: Nền Đỏ
                      e.currentTarget.style.color = '#FFFFFF'; // Hover: Chữ Trắng
                      e.currentTarget.style.borderColor = '#D32F2F';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#1A1A1A';
                      e.currentTarget.style.color = '#FFD700';
                      e.currentTarget.style.borderColor = '#1A1A1A';
                    }}
                    onClick={() => {
                      onOpenOrderForm(pkg);
                    }}
                  >
                    MUA NGAY
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW SECTION: Cam Kết & Lý Do Chọn */}
      <section className="why-choose-us py-20 bg-[#202020] border-t border-[#333]">
        <div className="container max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-white uppercase">
              TẠI SAO CHỌN <span className="text-[#FFD700]">KẾ TOÁN SEN VÀNG?</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="p-6 border border-[#333] rounded bg-[#1A1A1A] hover:border-[#FFD700] transition-all duration-300 group hover:-translate-y-1">
                    <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🛡️</div>
                    <h3 className="text-lg font-bold text-[#FFD700] mb-3 uppercase">Bảo Mật Tuyệt Đối</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Chúng tôi cam kết bảo mật 100% dữ liệu tài chính và thông tin doanh nghiệp với quy trình lưu trữ nghiêm ngặt.
                    </p>
                </div>

                <div className="p-6 border border-[#333] rounded bg-[#1A1A1A] hover:border-[#FFD700] transition-all duration-300 group hover:-translate-y-1">
                    <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">💰</div>
                    <h3 className="text-lg font-bold text-[#FFD700] mb-3 uppercase">Chi Phí Minh Bạch</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Báo giá trọn gói, không phát sinh chi phí ẩn. Tư vấn giải pháp tiết kiệm và hiệu quả nhất cho từng mô hình.
                    </p>
                </div>

                <div className="p-6 border border-[#333] rounded bg-[#1A1A1A] hover:border-[#FFD700] transition-all duration-300 group hover:-translate-y-1">
                    <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🤝</div>
                    <h3 className="text-lg font-bold text-[#FFD700] mb-3 uppercase">Đồng Hành Tận Tâm</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Đội ngũ chuyên gia luôn sẵn sàng hỗ trợ giải quyết các vấn đề phát sinh 24/7, kể cả ngày nghỉ và Lễ Tết.
                    </p>
                </div>
            </div>

            <div className="mt-16 text-center">
                 <p className="text-gray-300 mb-6 italic">"Sự thành công của bạn là niềm tự hào của chúng tôi"</p>
                 <a href="/ContactForm" className="block max-w-max mx-auto">
                    <button
                       className="py-3 px-10 bg-[#FFD700] text-[#1A1A1A] font-bold rounded uppercase tracking-widest hover:bg-white hover:text-[#D32F2F] transition-all duration-300 shadow-lg transform hover:scale-105"
                    >
                       KẾT NỐI VỚI CHUYÊN GIA NGAY
                    </button>
                 </a>
            </div>
        </div>
      </section>

      {/* Order Form Modal */}
      {isOrderFormOpen && selectedPackage && (
        <ServiceOrderForm
          serviceName={selectedPackage.title || selectedPackage.name}
          servicePrice={selectedPackage.price}
          onClose={() => setIsOrderFormOpen(false)}
          onSubmit={() => {
            setIsOrderFormOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default DichVu;