import React, { useState, useEffect } from 'react';
import ServiceOrderForm from '../components/ServiceOrderForm';
import FaqAccordion from '../components/FaqAccordion';
import { dangKyKinhDoanhFAQs } from '../data/faqData';

const DangKyKinhDoanh = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    // Load packages from localStorage
    const savedPackages = JSON.parse(localStorage.getItem('businessRegistrationServices')) || [
      {
        id: 1,
        name: 'GÓI STARTED',
        price: '1.570.000đ',
        description: 'Dịch vụ thành lập doanh nghiệp cơ bản cho doanh nghiệp mới',
        features: [
          'Ủy quyền',
          'Hồ sơ đăng ký kinh doanh',
          'Bố cáo thành lập',
          'ĐKKD & MST',
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
          'Bảng hiệu',
          'Dấu tên'
        ],
        suitableFor: 'Doanh nghiệp vừa và nhỏ',
        timeToComplete: 'Trọn gói 5-7 ngày',
        popular: false
      },
      {
        id: 3,
        name: 'GÓI BUSINESS',
        price: '4.699.000đ',
        description: 'Gói dịch vụ hoàn chỉnh cho doanh nghiệp mới thành lập',
        features: [
          'Gói STANDARD',
          'Mở tài khoản ngân hàng',
          '300 số hóa đơn'
        ],
        suitableFor: 'Doanh nghiệp muốn dịch vụ trọn gói',
        timeToComplete: 'Trọn gói 7-10 ngày',
        popular: true
      },
      {
        id: 4,
        name: 'THAY ĐỔI 1 NỘI DUNG',
        price: '1.570.000đ',
        description: 'Dịch vụ thay đổi đăng ký kinh doanh 1 nội dung',
        features: [
          'Thay đổi 1 nội dung ĐKKD',
          'Hoàn tất thủ tục pháp lý',
          'Nhận kết quả sau 3-5 ngày'
        ],
        suitableFor: 'Doanh nghiệp cần thay đổi thông tin',
        timeToComplete: 'Trọn gói 3-5 ngày',
        popular: false
      },
      {
        id: 5,
        name: 'THAY ĐỔI 2-4 NỘI DUNG',
        price: '1.770.000đ - 2.150.000đ',
        description: 'Dịch vụ thay đổi đăng ký kinh doanh từ 2 đến 4 nội dung',
        features: [
          'Thay đổi từ 2-4 nội dung ĐKKD',
          'Hoàn tất thủ tục pháp lý',
          'Nhận kết quả sau 5-7 ngày'
        ],
        suitableFor: 'Doanh nghiệp cần thay đổi nhiều thông tin',
        timeToComplete: 'Trọn gói 5-7 ngày',
        popular: false
      },
      {
        id: 6,
        name: 'NỘI DUNG THAY ĐỔI',
        price: 'Liên hệ tư vấn',
        description: 'Dịch vụ thay đổi các nội dung ĐKKD: Tên công ty, địa chỉ, vốn điều lệ, ngành nghề, người đại diện, thành viên góp vốn, chuyển đổi loại hình DN',
        features: [
          'Tên công ty',
          'Địa chỉ',
          'Vốn điều lệ',
          'Ngành nghề',
          'Người đại diện',
          'Thành viên góp vốn',
          'Chuyển đổi loại hình DN'
        ],
        suitableFor: 'Doanh nghiệp cần thay đổi nhiều thông tin',
        timeToComplete: 'Tùy nội dung thay đổi',
        popular: false
      }
    ];
    setPackages(savedPackages);

    // Luôn lưu dữ liệu vào localStorage để đảm bảo admin có thể truy cập
    localStorage.setItem('businessRegistrationServices', JSON.stringify(savedPackages));

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
          <h1 className="text-4xl md:text-5xl font-bold mb-6">DỊCH VỤ ĐĂNG KÝ KINH DOANH</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Dịch vụ thành lập doanh nghiệp chuyên nghiệp, nhanh chóng, tiết kiệm. 
            Đồng hành cùng bạn từ những bước đầu tiên của hành trình kinh doanh.
          </p>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">GÓI DỊCH VỤ ĐĂNG KÝ KINH DOANH</h2>
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
        faqs={dangKyKinhDoanhFAQs} 
        title="Câu Hỏi Thường Gặp Về Đăng Ký Kinh Doanh" 
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

export default DangKyKinhDoanh;