import React, { useState, useEffect } from 'react';
import WebDesignProcess from '../components/WebDesignProcess';
import ServiceOrderForm from '../components/ServiceOrderForm';
import FaqAccordion from '../components/FaqAccordion';
import { dichVuThietKeWebFAQs } from '../data/faqData';

const DichVuThietKeWeb = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    // Load packages from localStorage
    const savedPackages = JSON.parse(localStorage.getItem('webDesignServices')) || [
      {
        id: 'web1',
        title: 'GÓI 1: WEB GIỚI THIỆU',
        price: '3.000.000đ',
        description: 'Gói website giới thiệu cơ bản cho doanh nghiệp',
        features: [
          'Thiết kế web giới thiệu doanh nghiệp',
          'Responsive - tương thích di động',
          'Tối ưu SEO cơ bản',
          'Tích hợp form liên hệ',
          'Hỗ trợ kỹ thuật 3 tháng'
        ],
        suitableFor: 'Doanh nghiệp mới, cá nhân kinh doanh',
        timeComplete: '7-15 ngày',
        isPopular: true
      },
      {
        id: 'web2',
        title: 'GÓI 2: WEB GIỚI THIỆU + QUẢN TRỊ',
        price: '4.000.000đ',
        description: 'Gói website giới thiệu có trang quản trị',
        features: [
          'Thiết kế web giới thiệu doanh nghiệp',
          'Trang quản trị nội dung',
          'Tự cập nhật nội dung dễ dàng',
          'Tối ưu SEO nâng cao',
          'Hỗ trợ kỹ thuật 6 tháng'
        ],
        suitableFor: 'Doanh nghiệp vừa và nhỏ',
        timeComplete: '7-15 ngày',
        isPopular: false
      },
      {
        id: 'web3',
        title: 'GÓI 3: WEB GIỚI THIỆU + RESPONSIVE',
        price: '6.000.000đ',
        description: 'Gói website giới thiệu tương thích responsive',
        features: [
          'Thiết kế web giới thiệu doanh nghiệp',
          'Responsive - tương thích mọi thiết bị',
          'Tối ưu trải nghiệm người dùng',
          'Tích hợp mạng xã hội',
          'Hỗ trợ kỹ thuật 12 tháng'
        ],
        suitableFor: 'Doanh nghiệp muốn hiện diện chuyên nghiệp',
        timeComplete: '7-15 ngày',
        isPopular: true
      },
      {
        id: 'web4',
        title: 'GÓI 4: WEB GIỚI THIỆU + ADMIN + RESPONSIVE',
        price: '7.000.000đ',
        description: 'Gói website giới thiệu đầy đủ tính năng',
        features: [
          'Thiết kế web giới thiệu doanh nghiệp',
          'Trang quản trị nội dung',
          'Responsive - tương thích mọi thiết bị',
          'Tích hợp form liên hệ, chat',
          'Tự cập nhật nội dung dễ dàng',
          'Hỗ trợ kỹ thuật trọn đời'
        ],
        suitableFor: 'Doanh nghiệp chuyên nghiệp',
        timeComplete: '7-15 ngày',
        isPopular: false
      },
      {
        id: 'web5',
        title: 'GÓI TƯ VẤN',
        price: 'Liên hệ tư vấn',
        description: 'Gói tư vấn thiết kế web theo yêu cầu đặc biệt',
        features: [
          'Tư vấn lựa chọn gói phù hợp',
          'Phân tích yêu cầu chi tiết',
          'Thiết kế theo yêu cầu đặc biệt',
          'Tích hợp tính năng tùy chỉnh',
          'Hỗ trợ kỹ thuật trọn đời'
        ],
        suitableFor: 'Doanh nghiệp có yêu cầu đặc biệt',
        timeComplete: '7-15 ngày',
        isPopular: false
      }
    ];
    setPackages(savedPackages);

    // Luôn lưu dữ liệu vào localStorage để đảm bảo admin có thể truy cập
    localStorage.setItem('webDesignServices', JSON.stringify(savedPackages));

    // Cập nhật featuredServices để đồng bộ với các dịch vụ nổi bật
    const featuredServices = JSON.parse(localStorage.getItem('featuredServices')) || [];
    if (featuredServices.length === 0) {
      // Nếu chưa có featured services, lấy các dịch vụ phổ biến từ danh sách hiện tại
      const popularServices = savedPackages.filter(service => service.isPopular);
      localStorage.setItem('featuredServices', JSON.stringify(popularServices));
    }
  }, []);

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false);

  const handleOrderClick = (pkg) => {
    setSelectedPackage(pkg);
    setShowOrderForm(true);
  };

  const handleOrderSubmit = (order) => {
    // Additional processing if needed
    setShowOrderForm(false);
  };

  const closeOrderForm = () => {
    setShowOrderForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12" style={{ backgroundColor: '#f8f9fa', padding: '3rem 0', fontFamily: 'Arial, sans-serif' }}>
      <div className="container max-w-6xl mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4" style={{ fontSize: '2.5em', color: '#333', marginBottom: '1rem' }}>
            DỊCH VỤ THIẾT KẾ WEBSITE
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontSize: '1.25em', color: '#666' }}>
            Giải pháp thiết kế website chuyên nghiệp, chuẩn SEO, tăng trưởng doanh nghiệp trực tuyến
          </p>
        </div>

        {/* Service Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16 border border-gray-200" style={{ backgroundColor: '#fff', borderRadius: '0.5rem', padding: '2rem', marginBottom: '4rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4" style={{ fontSize: '2em', color: '#333', marginBottom: '1rem' }}>
                Thiết kế website chuyên nghiệp
              </h2>
              <p className="text-gray-700 mb-6" style={{ color: '#4a5568', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                Với đội ngũ thiết kế giàu kinh nghiệm, chúng tôi cung cấp dịch vụ thiết kế website chuyên nghiệp, 
                chuẩn SEO, tốc độ tải nhanh, tương thích đa nền tảng, giúp doanh nghiệp của bạn hiện diện mạnh mẽ 
                trên môi trường internet.
              </p>
              <ul className="space-y-3 text-gray-700" style={{ color: '#4a5568' }}>
                <li className="flex items-start">
                  <span className="text-primary mr-2" style={{ color: '#007bff' }}>✓</span>
                  <span>Giao diện đẹp, hiện đại, dễ sử dụng</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2" style={{ color: '#007bff' }}>✓</span>
                  <span>Tối ưu hóa công cụ tìm kiếm (SEO)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2" style={{ color: '#007bff' }}>✓</span>
                  <span>Tương thích với mọi thiết bị (mobile, tablet, desktop)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2" style={{ color: '#007bff' }}>✓</span>
                  <span>Hỗ trợ kỹ thuật tận tình, chu đáo</span>
                </li>
              </ul>
            </div>
            <div className="flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=400&fit=crop&q=80"
                alt="Dịch vụ thiết kế web"
                className="rounded-xl shadow-lg object-cover"
                style={{ width: '100%', height: '256px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        {/* Web Design Process */}
        <WebDesignProcess />

        {/* Packages Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12" style={{ fontSize: '2em', color: '#333', marginBottom: '3rem', textAlign: 'center' }}>
            GÓI DỊCH VỤ THIẾT KẾ WEBSITE
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden border ${
                  pkg.isPopular ? 'border-[#D4AF37] relative' : 'border-gray-200'
                }`}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  border: pkg.isPopular ? '2px solid #D4AF37' : '1px solid #e2e8f0',
                  position: pkg.isPopular ? 'relative' : 'static'
                }}
              >
                {pkg.isPopular && (
                  <div
                    className="absolute top-0 right-0 bg-[#D4AF37] text-white text-xs font-bold px-4 py-1 rounded-bl-lg uppercase"
                    style={{
                      backgroundColor: '#D4AF37',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      padding: '0.25rem 1rem',
                      borderRadius: '0 0 0 0.5rem',
                      textTransform: 'uppercase',
                      zIndex: '10'
                    }}
                  >
                    Phổ biến
                  </div>
                )}

                <div className="p-6 bg-white text-gray-800 flex flex-col h-full" style={{ padding: '1.5rem', backgroundColor: 'white', color: '#333' }}>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-center text-gray-800 mb-2" style={{ fontSize: '1.25rem', color: '#333', marginBottom: '0.5rem', textAlign: 'center' }}>
                      {pkg.title}
                    </h3>

                    <div className="text-center mb-4">
                      <span className="text-2xl font-bold text-red-600" style={{ fontSize: '1.5rem', color: '#dc2626', fontWeight: 'bold' }}>
                        {pkg.price}
                      </span>
                    </div>

                    <p className="text-gray-700 text-sm text-center mb-4" style={{ color: '#4a5568', fontSize: '0.875rem', textAlign: 'center', marginBottom: '1rem' }}>
                      {pkg.description}
                    </p>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-2" style={{ fontWeight: '600', color: '#333', marginBottom: '0.5rem' }}>
                        Tính năng bao gồm:
                      </h4>
                      <ul className="space-y-1">
                        {pkg.features.map((feature, idx) => (
                          <li key={`${pkg.id || pkg.title}-${idx}`} className="flex items-start text-sm text-gray-700" style={{ color: '#4a5568', fontSize: '0.875rem' }}>
                            <span className="text-red-600 mr-2" style={{ color: '#dc2626' }}>•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold text-gray-800" style={{ color: '#333' }}>Phù hợp:</span> {pkg.suitableFor}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold text-gray-800" style={{ color: '#333' }}>Thời gian hoàn thành:</span> {pkg.timeComplete}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOrderClick(pkg)}
                    className="w-full bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-900 transition-colors mt-auto"
                    style={{
                      width: '100%',
                      backgroundColor: '#333',
                      color: '#fff',
                      fontWeight: 'bold',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s'
                    }}
                  >
                    ĐẶT DỊCH VỤ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* FAQ Section */}
      <FaqAccordion 
        faqs={dichVuThietKeWebFAQs} 
        title="Câu Hỏi Thường Gặp Về Thiết Kế Website" 
      />

      {/* Order Form Modal */}
      {showOrderForm && selectedPackage && (
        <ServiceOrderForm
          serviceName={selectedPackage.title}
          servicePrice={selectedPackage.price}
          onClose={closeOrderForm}
          onSubmit={handleOrderSubmit}
        />
      )}
    </div>
  );
};

export default DichVuThietKeWeb;