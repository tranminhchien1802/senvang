import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BusinessRegistrationSection = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const storedServices = localStorage.getItem('businessRegistrationServices');
    if (storedServices) {
      try {
        setServices(JSON.parse(storedServices));
      } catch (e) {
        console.error('Error parsing business registration services from localStorage', e);
        // Dữ liệu mẫu nếu có lỗi
        setServices([
          {
            id: 1,
            name: 'Gói Khởi Nghiệp',
            description: 'Thành lập doanh nghiệp cơ bản',
            price: '1.500.000đ',
            features: ['Thành lập doanh nghiệp', 'Công bố mẫu dấu', 'Đăng ký MST'],
            suitableFor: 'Doanh nghiệp mới thành lập',
            status: 'active',
            popular: true
          },
          {
            id: 2,
            name: 'Gói Cơ Bản',
            description: 'Thành lập doanh nghiệp cơ bản với các tiện ích mở rộng',
            price: '2.500.000đ',
            features: ['Thành lập doanh nghiệp', 'Công bố mẫu dấu', 'Đăng ký MST', 'Tư vấn pháp lý'],
            suitableFor: 'Doanh nghiệp vừa và nhỏ',
            status: 'active',
            popular: true
          },
          {
            id: 3,
            name: 'Gói Tiêu Chuẩn',
            description: 'Gói dịch vụ hoàn chỉnh cho doanh nghiệp mới thành lập',
            price: '4.500.000đ',
            features: ['Thành lập doanh nghiệp', 'Công bố mẫu dấu', 'Đăng ký MST', 'Tư vấn pháp lý', 'Hỗ trợ khai báo thuế 3 tháng đầu'],
            suitableFor: 'Doanh nghiệp muốn dịch vụ trọn gói',
            status: 'active',
            popular: false
          },
          {
            id: 4,
            name: 'Gói Nâng Cao',
            description: 'Gói dịch vụ chuyên sâu với nhiều tiện ích hỗ trợ',
            price: '6.000.000đ',
            features: ['Thành lập doanh nghiệp', 'Công bố mẫu dấu', 'Đăng ký MST', 'Tư vấn pháp lý', 'Hỗ trợ khai báo thuế 6 tháng đầu', 'Tư vấn kế toán miễn phí'],
            suitableFor: 'Doanh nghiệp lớn hoặc có nhu cầu đặc biệt',
            status: 'active',
            popular: false
          }
        ]);
      }
    } else {
      // Dữ liệu mẫu nếu không có trong localStorage
      setServices([
        {
          id: 1,
          name: 'Gói Khởi Nghiệp',
          description: 'Thành lập doanh nghiệp cơ bản',
          price: '1.500.000đ',
          features: ['Thành lập doanh nghiệp', 'Công bố mẫu dấu', 'Đăng ký MST'],
          suitableFor: 'Doanh nghiệp mới thành lập',
          status: 'active',
          popular: true
        },
        {
          id: 2,
          name: 'Gói Cơ Bản',
          description: 'Thành lập doanh nghiệp cơ bản với các tiện ích mở rộng',
          price: '2.500.000đ',
          features: ['Thành lập doanh nghiệp', 'Công bố mẫu dấu', 'Đăng ký MST', 'Tư vấn pháp lý'],
          suitableFor: 'Doanh nghiệp vừa và nhỏ',
          status: 'active',
          popular: true
        },
        {
          id: 3,
          name: 'Gói Tiêu Chuẩn',
          description: 'Gói dịch vụ hoàn chỉnh cho doanh nghiệp mới thành lập',
          price: '4.500.000đ',
          features: ['Thành lập doanh nghiệp', 'Công bố mẫu dấu', 'Đăng ký MST', 'Tư vấn pháp lý', 'Hỗ trợ khai báo thuế 3 tháng đầu'],
          suitableFor: 'Doanh nghiệp muốn dịch vụ trọn gói',
          status: 'active',
          popular: false
        },
        {
          id: 4,
          name: 'Gói Nâng Cao',
          description: 'Gói dịch vụ chuyên sâu với nhiều tiện ích hỗ trợ',
          price: '6.000.000đ',
          features: ['Thành lập doanh nghiệp', 'Công bố mẫu dấu', 'Đăng ký MST', 'Tư vấn pháp lý', 'Hỗ trợ khai báo thuế 6 tháng đầu', 'Tư vấn kế toán miễn phí'],
          suitableFor: 'Doanh nghiệp lớn hoặc có nhu cầu đặc biệt',
          status: 'active',
          popular: false
        }
      ]);
    }
  }, []);

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">DỊCH VỤ ĐĂNG KÝ KINH DOANH</h2>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-800">{service.name}</h3>
                  {service.popular && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                      Phổ biến
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                
                <div className="mb-4">
                  <p className="text-[#D4AF37] font-bold text-lg">{service.price}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-700 text-sm mb-2">
                    <span className="font-medium">Phù hợp:</span> {service.suitableFor}
                  </p>
                  <p className="text-gray-700 text-sm">
                    <span className="font-medium">Trạng thái:</span>
                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                      service.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {service.status === 'active' ? 'Hoạt động' : 'Ngừng'}
                    </span>
                  </p>
                </div>
                
                <div className="mb-6">
                  <p className="font-medium text-gray-700 text-sm mb-2">Tính năng:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-[#D4AF37] mr-2">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button className="w-full py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#b8942f] transition-colors font-medium">
                  Chi tiết dịch vụ
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link 
            to="/dang-ky-kinh-doanh" 
            className="inline-block px-8 py-3 bg-[#D4AF37] text-white font-bold rounded-lg hover:bg-[#b8942f] transition-colors shadow-lg"
          >
            Xem tất cả dịch vụ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BusinessRegistrationSection;