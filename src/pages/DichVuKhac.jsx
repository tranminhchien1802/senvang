// File: src/pages/DichVuKhac.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PurchaseModal from '../components/PurchaseModal';
import ServiceOrderForm from '../components/ServiceOrderForm';
import emailjs from '@emailjs/browser';

const DichVuKhac = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [openAccordion, setOpenAccordion] = useState(null);
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);
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

  // Giả lập việc tải dữ liệu
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingPackages(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Load packages from localStorage
  const [servicePackages, setServicePackages] = useState([]);

  // Load packages from localStorage
  useEffect(() => {
    const loadPackages = () => {
      let savedPackages = [];
      try {
        const storedPackages = localStorage.getItem('dichVuKhacPackages');
        savedPackages = storedPackages ? JSON.parse(storedPackages) : [];
      } catch (error) {
        console.error('Error loading DichVuKhac packages:', error);
        savedPackages = [];
      }
      setServicePackages(savedPackages);
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
    servicePackages.forEach(pkg => {
      searchableItems.push({
        ...pkg,
        type: 'package',
        path: '/dich-vu-khac',
        title: pkg.title || pkg.name,
        description: pkg.description,
        price: pkg.price
      });
    });

    // Add other page content to search
    const additionalContent = [
      { id: 'section-hero', title: 'GIẢI PHÁP VÀ HỖ TRỢ CHUYÊN SÂU', path: '/dich-vu-khac', type: 'section' },
      { id: 'section-accordion', title: 'CÁC DỊCH VỤ KẾ TOÁN VÀ HỖ TRỢ KHÁC', path: '/dich-vu-khac', type: 'section' },
      { id: 'section-packages', title: 'BẢNG GIÁ DỊCH VỤ TRỌN GÓI', path: '/dich-vu-khac', type: 'section' },
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
  }, [pageSearchQuery, servicePackages]);

  // State for sorting
  const [sortOption, setSortOption] = useState('none'); // 'none', 'asc', 'desc'

  // Sort and filter packages
  const filteredAndSortedPackages = searchQuery
    ? servicePackages.filter(pkg =>
        ((pkg.title || pkg.name) &&
         ((pkg.title && pkg.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (pkg.name && pkg.name.toLowerCase().includes(searchQuery.toLowerCase())))) ||
        (pkg.description && pkg.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (pkg.features && Array.isArray(pkg.features) && pkg.features.some(feature => feature && feature.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (pkg.suitableFor && pkg.suitableFor.toLowerCase().includes(searchQuery.toLowerCase())) ||
        // Also search in price (extract numeric values from price string)
        (pkg.price && pkg.price.toString().replace(/[^\d]/g, '').includes(searchQuery.replace(/[^\d]/g, '')))
      )
    : servicePackages;

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

  const filteredServicePackages = sortedPackages;

  // Load packages from localStorage
  useEffect(() => {
    const loadPackages = () => {
      let savedPackages = [];
      try {
        const storedPackages = localStorage.getItem('dichVuKhacPackages');
        savedPackages = storedPackages ? JSON.parse(storedPackages) : [];
      } catch (error) {
        console.error('Error loading DichVuKhac packages:', error);
        savedPackages = [];
      }
      setServicePackages(savedPackages);
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
      if (normalizedQuery.includes('giải pháp') || normalizedQuery.includes('hỗ trợ chuyên sâu')) {
        // Scroll to the hero section
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
          heroSection.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (normalizedQuery.includes('dịch vụ') && normalizedQuery.includes('khác')) {
        // Scroll to the accordion section
        const accordionSection = document.querySelector('.accordion-section');
        if (accordionSection) {
          accordionSection.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (normalizedQuery.includes('gói') && normalizedQuery.includes('trọn gói')) {
        // Scroll to the packages section
        const packagesSection = document.querySelector('.packages-section');
        if (packagesSection) {
          packagesSection.scrollIntoView({ behavior: 'smooth' });
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
      
      {/* Styles & Keyframes */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes shimmer {
              0% { transform: translateX(-150%) skewX(-20deg); }
              100% { transform: translateX(150%) skewX(-20deg); }
            }
            @keyframes pulse-gray {
              0%, 100% { background-color: #2a2a2a; }
              50% { background-color: #333; }
            }
            .skeleton-card {
              animation: pulse-gray 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
          `,
        }}
      />

      {/* Hero Section */}
      <section className="hero-section py-20 text-center border-b border-[#333]">
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
            GIẢI PHÁP VÀ HỖ TRỢ CHUYÊN SÂU
          </h1>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg mt-4">
            Ngoài các dịch vụ chủ đạo, chúng tôi cung cấp các giải pháp đặc thù giúp tối ưu hóa hiệu suất tài chính và pháp lý cho doanh nghiệp.
          </p>
        </div>
      </section>

      {/* Accordion Section */}
      <section className="accordion-section py-20 bg-[#202020]">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#FFD700] uppercase tracking-wider">
            CÁC DỊCH VỤ KẾ TOÁN VÀ HỖ TRỢ KHÁC
          </h2>

          <div className="space-y-4">
            {/* Item 1 */}
            <div className="accordion-item border border-[#444] rounded bg-[#282828] overflow-hidden">
              <div
                className="accordion-header p-5 flex justify-between items-center cursor-pointer hover:bg-[#333] transition-colors"
                onClick={() => setOpenAccordion(openAccordion === 1 ? null : 1)}
              >
                <h3 className="text-xl font-bold text-[#FFD700]">GIẢI PHÁP KẾ TOÁN TOÀN DIỆN</h3>
                <span className="text-2xl text-[#FFD700] font-bold">{openAccordion === 1 ? '−' : '+'}</span>
              </div>
              <div
                className={`accordion-content bg-[#1a1a1a] transition-all duration-300 ease-in-out ${openAccordion === 1 ? 'max-h-[500px] opacity-100 p-5' : 'max-h-0 opacity-0 p-0 overflow-hidden'}`}
              >
                <p className="text-gray-300 mb-4">Giải pháp kế toán chiến lược, vượt xa việc ghi chép sổ sách thông thường.</p>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-center"><span className="text-[#FFD700] mr-2">★</span> Rà soát và hoàn thiện sổ sách kế toán</li>
                  <li className="flex items-center"><span className="text-[#FFD700] mr-2">★</span> Đại diện giải trình quyết toán Thuế</li>
                  <li className="flex items-center"><span className="text-[#FFD700] mr-2">★</span> Phân tích dòng tiền chuyên sâu</li>
                </ul>
              </div>
            </div>

            {/* Item 2 */}
            <div className="accordion-item border border-[#444] rounded bg-[#282828] overflow-hidden">
              <div
                className="accordion-header p-5 flex justify-between items-center cursor-pointer hover:bg-[#333] transition-colors"
                onClick={() => setOpenAccordion(openAccordion === 2 ? null : 2)}
              >
                <h3 className="text-xl font-bold text-[#FFD700]">TƯ VẤN CHIẾN LƯỢC & ĐẶC THÙ</h3>
                <span className="text-2xl text-[#FFD700] font-bold">{openAccordion === 2 ? '−' : '+'}</span>
              </div>
              <div
                className={`accordion-content bg-[#1a1a1a] transition-all duration-300 ease-in-out ${openAccordion === 2 ? 'max-h-[500px] opacity-100 p-5' : 'max-h-0 opacity-0 p-0 overflow-hidden'}`}
              >
                 <ul className="space-y-2 text-gray-400">
                  <li className="flex items-center"><span className="text-[#FFD700] mr-2">★</span> Tư vấn nghiệp vụ Top 1 thị trường</li>
                  <li className="flex items-center"><span className="text-[#FFD700] mr-2">★</span> Hỗ trợ cả Thứ 7, CN & Nghỉ lễ</li>
                  <li className="flex items-center"><span className="text-[#FFD700] mr-2">★</span> Bảo hộ thương hiệu & Tài sản số</li>
                </ul>
              </div>
            </div>

             {/* Item 3 */}
             <div className="accordion-item border border-[#444] rounded bg-[#282828] overflow-hidden">
              <div
                className="accordion-header p-5 flex justify-between items-center cursor-pointer hover:bg-[#333] transition-colors"
                onClick={() => setOpenAccordion(openAccordion === 3 ? null : 3)}
              >
                <h3 className="text-xl font-bold text-[#FFD700]">CÔNG CỤ HỖ TRỢ</h3>
                <span className="text-2xl text-[#FFD700] font-bold">{openAccordion === 3 ? '−' : '+'}</span>
              </div>
              <div
                className={`accordion-content bg-[#1a1a1a] transition-all duration-300 ease-in-out ${openAccordion === 3 ? 'max-h-[500px] opacity-100 p-5' : 'max-h-0 opacity-0 p-0 overflow-hidden'}`}
              >
                <div className="text-center">
                  <p className="text-gray-300 mb-4">Sử dụng công cụ của chúng tôi để ước tính chi phí và nghĩa vụ thuế.</p>
                  <button className="bg-[#FFD700] text-black font-bold py-2 px-6 rounded hover:bg-[#e6c200] transition-colors">
                    TRUY CẬP CÔNG CỤ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="packages-section py-20 bg-[#1A1A1A]">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#FFD700] uppercase tracking-wide">
            BẢNG GIÁ DỊCH VỤ TRỌN GÓI
          </h2>

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoadingPackages ? (
              // Loading Skeletons
              Array(6).fill(0).map((_, index) => (
                <div 
                  key={`skeleton-${index}`}
                  className="skeleton-card rounded-lg h-[450px] w-full"
                ></div>
              ))
            ) : (
              // Real Data Cards
              filteredServicePackages.map((pkg) => (
                <div
                  key={pkg._id || pkg.id}
                  className={`package-card flex flex-col justify-between rounded-lg shadow-xl relative overflow-hidden group transition-all duration-300 hover:-translate-y-2
                     ${pkg.isPopular ? 'ring-4 ring-white transform scale-105 z-10' : ''}
                  `}
                  style={{
                    backgroundColor: '#FFD700', // Nền Vàng
                    color: '#1A1A1A', // Chữ Đen
                    minHeight: '450px'
                  }}
                >
                   {/* Shimmer Effect Overlay */}
                   <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)',
                      width: '50%',
                      height: '100%',
                      transform: 'skewX(-20deg)',
                      animation: 'shimmer 1.5s infinite',
                      zIndex: '20',
                    }}
                  ></div>

                  {pkg.isPopular && (
                    <div className="absolute top-0 right-0 bg-[#D32F2F] text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase z-30 shadow-sm">
                      Phổ biến nhất
                    </div>
                  )}

                  <div className="p-8 relative z-10 flex-grow">
                    <h3 className="text-2xl font-black mb-4 uppercase border-b-2 border-black pb-2">
                      {pkg.title}
                    </h3>
                    
                    <div className="price-tag mb-6">
                      <p className="text-sm font-semibold opacity-80 mb-1">TRỌN GÓI CHỈ TỪ</p>
                      <span className={`text-3xl font-black ${pkg.price === 'Liên hệ' || pkg.price === 'Thương lượng' ? 'text-[#D32F2F]' : 'text-[#D32F2F]'}`}>
                        {pkg.price}
                      </span>
                    </div>

                    <div>
                      <p className="text-base font-bold text-gray-900">
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
                      <ul className="space-y-2 mt-2">
                        {pkg.features.map((feature, i) => (
                          <li key={i} className="flex items-start text-sm font-bold text-gray-900">
                            <span className="text-[#D32F2F] font-bold mr-2 text-lg">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="p-8 pt-0 relative z-10">
                    <button
                      className="w-full py-3 px-6 rounded font-bold uppercase tracking-wider transition-all duration-300 shadow-lg border-2 border-black"
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
                        e.currentTarget.style.borderColor = '#000000';
                      }}
                      onClick={() => {
                        onOpenOrderForm(pkg);
                      }}
                    >
                      MUA NGAY
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* NEW SECTION: Cam Kết & Lý Do Chọn (Phần thêm mới) */}
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

export default DichVuKhac;