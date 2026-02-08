import React, { useState, useEffect } from 'react';
import ServiceOrderForm from '../components/ServiceOrderForm';
import FaqAccordion from '../components/FaqAccordion';
import { thueHoKinhDoanhFAQs } from '../data/faqData';

const ThueHoKinhDoanh = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    // Load packages from localStorage
    const savedPackages = JSON.parse(localStorage.getItem('taxServices')) || [
      {
        id: 1,
        name: 'KHAI THUẾ TRẮNG (KHÔNG PHÁT SINH)',
        price: '800.000đ',
        description: 'Dịch vụ báo cáo thuế định kỳ cho hộ kinh doanh không có phát sinh',
        features: [
          'Kê khai thuế GTGT hàng quý',
          'Kê khai thuế TNCN cuối năm',
          'Lập báo cáo tài chính',
          'Tư vấn thuế miễn phí'
        ],
        suitableFor: 'Hộ kinh doanh không có phát sinh',
        timeToComplete: 'Theo kỳ',
        popular: true
      },
      {
        id: 2,
        name: 'KHAI THUẾ CÓ PHÁT SINH HÓA ĐƠN',
        price: '1.500.000đ',
        description: 'Dịch vụ báo cáo thuế định kỳ cho hộ kinh doanh có phát sinh hóa đơn',
        features: [
          'Kê khai thuế GTGT hàng quý',
          'Kê khai thuế TNCN cuối năm',
          'Lập báo cáo tài chính',
          'Tư vấn thuế miễn phí'
        ],
        suitableFor: 'Hộ kinh doanh có phát sinh hóa đơn',
        timeToComplete: 'Theo kỳ',
        popular: true
      },
      {
        id: 3,
        name: 'KHAI THUẾ TNCN TỪ LƯƠNG',
        price: '1.500.000đ - 2.500.000đ',
        description: 'Dịch vụ khai thuế thu nhập cá nhân từ tiền lương',
        features: [
          'Kê khai thuế TNCN từ tiền lương',
          'Tư vấn chính sách thuế',
          'Hỗ trợ hoàn thuế nếu có',
          'Lưu trữ hồ sơ 3 năm'
        ],
        suitableFor: 'Cá nhân có thu nhập từ tiền lương',
        timeToComplete: 'Theo năm',
        popular: false
      },
      {
        id: 4,
        name: 'HOÀN THUẾ TNCN TỪ LƯƠNG',
        price: '1.500.000đ - 2.500.000đ',
        description: 'Dịch vụ hoàn thuế thu nhập cá nhân từ tiền lương',
        features: [
          'Tư vấn hoàn thuế TNCN',
          'Làm thủ tục hoàn thuế',
          'Theo dõi tiến độ hoàn thuế',
          'Hỗ trợ giải trình với cơ quan thuế'
        ],
        suitableFor: 'Cá nhân cần hoàn thuế TNCN từ tiền lương',
        timeToComplete: 'Tùy hồ sơ',
        popular: false
      },
      {
        id: 5,
        name: 'THUẾ TNCN TỪ CHUYỂN NHƯỢNG VỐN',
        price: '700.000đ - 750.000đ',
        description: 'Dịch vụ khai thuế thu nhập cá nhân từ chuyển nhượng vốn',
        features: [
          'Tư vấn thuế TNCN từ chuyển nhượng vốn',
          'Làm thủ tục khai thuế',
          'Hỗ trợ hoàn tất nghĩa vụ thuế',
          'Giải thích quy trình cho khách hàng'
        ],
        suitableFor: 'Cá nhân có thu nhập từ chuyển nhượng vốn',
        timeToComplete: 'Theo kỳ',
        popular: false
      },
      {
        id: 6,
        name: 'XỬ LÝ SỰ CỐ - KHÔI PHỤC MST BỊ KHÓA',
        price: 'Liên hệ tư vấn',
        description: 'Dịch vụ xử lý sự cố và khôi phục mã số thuế bị khóa',
        features: [
          'Tư vấn nguyên nhân khóa MST',
          'Hướng dẫn xử lý sự cố',
          'Hỗ trợ khôi phục MST',
          'Tư vấn tránh khóa MST trong tương lai'
        ],
        suitableFor: 'Doanh nghiệp/mã số thuế bị khóa',
        timeToComplete: 'Tùy mức độ sự cố',
        popular: false
      }
    ];
    setPackages(savedPackages);

    // Luôn lưu dữ liệu vào localStorage để đảm bảo admin có thể truy cập
    localStorage.setItem('taxServices', JSON.stringify(savedPackages));

    // Cập nhật featuredServices để đồng bộ với các dịch vụ nổi bật
    const featuredServices = JSON.parse(localStorage.getItem('featuredServices')) || [];
    if (featuredServices.length === 0) {
      // Nếu chưa có featured services, lấy các dịch vụ phổ biến từ danh sách hiện tại
      const popularServices = savedPackages.filter(service => service.popular);
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-20">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">DỊCH VỤ THUẾ HỘ KINH DOANH</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Dịch vụ kế toán thuế chuyên nghiệp cho hộ kinh doanh cá thể. 
            Đảm bảo tuân thủ pháp luật, tối ưu nghĩa vụ thuế, tiết kiệm thời gian và chi phí.
          </p>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">GÓI DỊCH VỤ THUẾ HỘ KINH DOANH</h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {packages.map((pkg) => (
              <div key={pkg.id} className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 ${pkg.popular ? 'border-[#D4AF37] relative' : 'border-gray-200'}`}>
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-[#D4AF37] text-white text-xs font-bold px-4 py-1 rounded-bl-lg uppercase">
                    Phổ biến
                  </div>
                )}
                <div className="p-6 text-gray-800 flex flex-col h-full">
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-center text-gray-800 mb-2">{pkg.name}</h3>
                    <div className="text-center mb-4">
                      <span className="text-3xl font-bold text-red-600">{pkg.price}</span>
                    </div>
                    <p className="text-gray-700 text-sm text-center mb-6">{pkg.description}</p>

                    <div className="mb-6">
                      <h4 className="font-bold text-gray-800 mb-3 text-sm">Tính năng bao gồm:</h4>
                      <ul className="space-y-2">
                        {pkg.features.map((feature, index) => (
                          <li key={`${pkg.id}-${index}`} className="flex items-start">
                            <span className="text-red-600 mr-2">•</span>
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-6">
                      <p className="text-gray-700 text-sm mb-1">
                        <span className="font-medium text-gray-800">Phù hợp:</span> {pkg.suitableFor}
                      </p>
                      <p className="text-gray-700 text-sm">
                        <span className="font-medium text-gray-800">Thời gian:</span> {pkg.timeToComplete}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOrderClick(pkg)}
                    className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium mt-auto">
                    ĐẶT DỊCH VỤ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>




      {/* FAQ Section */}
      <FaqAccordion 
        faqs={thueHoKinhDoanhFAQs} 
        title="Câu Hỏi Thường Gặp Về Thuế Hộ Kinh Doanh" 
      />

      {/* Order Form Modal */}
      {showOrderForm && selectedPackage && (
        <ServiceOrderForm
          serviceName={selectedPackage.name}
          servicePrice={selectedPackage.price}
          onClose={closeOrderForm}
          onSubmit={handleOrderSubmit}
        />
      )}
    </div>
  );
};

export default ThueHoKinhDoanh;