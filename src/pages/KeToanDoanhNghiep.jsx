import React, { useState, useEffect } from 'react';
import ServiceOrderForm from '../components/ServiceOrderForm';
import FaqAccordion from '../components/FaqAccordion';
import { keToanDoanhNghiepFAQs } from '../data/faqData';

const KeToanDoanhNghiep = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    // Load packages from localStorage
    const savedPackages = JSON.parse(localStorage.getItem('accountingServices')) || [
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
      },
      {
        id: 'ktdn3',
        title: 'KẾ TOÁN GIA CÔNG SẢN XUẤT',
        price: '3.000.000đ',
        description: 'Dịch vụ kế toán cho doanh nghiệp gia công sản xuất',
        features: [
          'Kê khai thuế GTGT hàng tháng/quý',
          'Kê khai thuế TNCN cuối năm',
          'Lập báo cáo tài chính',
          'Quyết toán thuế cuối năm',
          'Tư vấn kế toán miễn phí'
        ],
        suitableFor: 'Doanh nghiệp gia công sản xuất',
        timeComplete: 'Trọn gói 1 năm',
        popular: true,
        isPopular: true
      },
      {
        id: 'ktdn4',
        title: 'LÀM LẠI SỔ SÁCH KẾ TOÁN',
        price: '1.200.000đ',
        description: 'Dịch vụ làm lại sổ sách kế toán cho doanh nghiệp',
        features: [
          'Kiểm tra sổ sách hiện tại',
          'Lập lại chứng từ kế toán',
          'Cập nhật sổ sách theo quy định',
          'Tư vấn xử lý sai sót'
        ],
        suitableFor: 'Doanh nghiệp cần làm lại sổ sách',
        timeComplete: 'Tùy theo tình trạng sổ sách',
        popular: false,
        isPopular: false
      },
      {
        id: 'ktdn5',
        title: 'BÁO CÁO TÀI CHÍNH NĂM',
        price: '3.500.000đ',
        description: 'Dịch vụ lập báo cáo tài chính năm cho doanh nghiệp',
        features: [
          'Lập báo cáo tài chính năm',
          'Kiểm toán nội bộ',
          'Tư vấn tài chính',
          'Hỗ trợ giải trình với cơ quan thuế'
        ],
        suitableFor: 'Doanh nghiệp cần báo cáo tài chính năm',
        timeComplete: 'Theo quy định',
        popular: false,
        isPopular: false
      },
      {
        id: 'ktdn6',
        title: 'BỔ NHIỆM KẾ TOÁN TRƯỞNG',
        price: '4.000.000đ',
        description: 'Dịch vụ bổ nhiệm kế toán trưởng',
        features: [
          'Tư vấn pháp lý kế toán',
          'Đại diện làm việc với cơ quan thuế',
          'Hỗ trợ chuyên môn kế toán',
          'Quản lý hồ sơ kế toán'
        ],
        suitableFor: 'Doanh nghiệp cần bổ nhiệm kế toán trưởng',
        timeComplete: 'Trọn gói 1 năm',
        popular: false,
        isPopular: false
      },
      {
        id: 'ktdn7',
        title: 'ĐĂNG KÝ BHXH',
        price: '1.050.000đ - 1.550.000đ',
        description: 'Dịch vụ đăng ký bảo hiểm xã hội cho doanh nghiệp',
        features: [
          'Tư vấn chính sách BHXH',
          'Làm thủ tục đăng ký BHXH',
          'Theo dõi quá trình xử lý',
          'Hỗ trợ giải đáp thắc mắc'
        ],
        suitableFor: 'Doanh nghiệp cần đăng ký BHXH',
        timeComplete: 'Tùy số lượng nhân sự',
        popular: false,
        isPopular: false
      }
    ];
    setPackages(savedPackages);

    // Luôn lưu dữ liệu vào localStorage để đảm bảo admin có thể truy cập
    localStorage.setItem('accountingServices', JSON.stringify(savedPackages));

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
            KẾ TOÁN DOANH NGHIỆP
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontSize: '1.25em', color: '#666' }}>
            Dịch vụ kế toán trọn gói, chuyên nghiệp, tiết kiệm chi phí
          </p>
        </div>

        {/* Service Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16 border border-gray-200" style={{ backgroundColor: '#fff', borderRadius: '0.5rem', padding: '2rem', marginBottom: '4rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4" style={{ fontSize: '2em', color: '#333', marginBottom: '1rem' }}>
                Dịch vụ kế toán chuyên nghiệp
              </h2>
              <p className="text-gray-700 mb-6" style={{ color: '#4a5568', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                Với đội ngũ kế toán viên chuyên nghiệp, chúng tôi cung cấp dịch vụ kế toán 
                trọn gói giúp doanh nghiệp tuân thủ đúng quy định pháp luật, tiết kiệm chi phí 
                và tập trung vào hoạt động kinh doanh.
              </p>
              <ul className="space-y-3 text-gray-700" style={{ color: '#4a5568' }}>
                <li className="flex items-start">
                  <span className="text-primary mr-2" style={{ color: '#007bff' }}>✓</span>
                  <span>Kê khai thuế đúng hạn, chính xác</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2" style={{ color: '#007bff' }}>✓</span>
                  <span>Lưu trữ chứng từ an toàn</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2" style={{ color: '#007bff' }}>✓</span>
                  <span>Tư vấn kế toán, thuế miễn phí</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2" style={{ color: '#007bff' }}>✓</span>
                  <span>Hỗ trợ quyết toán thuế khi kiểm tra</span>
                </li>
              </ul>
            </div>
            <div className="flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop&q=80"
                alt="Dịch vụ kế toán doanh nghiệp"
                className="rounded-xl shadow-lg object-cover"
                style={{ width: '100%', height: '256px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        {/* Packages Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12" style={{ fontSize: '2em', color: '#333', marginBottom: '3rem', textAlign: 'center' }}>
            GÓI DỊCH VỤ KẾ TOÁN DOANH NGHIỆP
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
        faqs={keToanDoanhNghiepFAQs} 
        title="Câu Hỏi Thường Gặp Về Kế Toán Doanh Nghiệp" 
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

export default KeToanDoanhNghiep;