import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TaxServiceSection = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const storedServices = localStorage.getItem('taxServices');
    if (storedServices) {
      try {
        setServices(JSON.parse(storedServices));
      } catch (e) {
        console.error('Error parsing tax services from localStorage', e);
        // Dữ liệu mẫu nếu có lỗi
        setServices([
          {
            id: 1,
            name: 'Gói Cơ Bản',
            description: 'Dịch vụ kê khai thuế cho hộ kinh doanh cá thể',
            price: '500.000đ',
            features: ['Kê khai thuế GTGT', 'Kê khai thuế TNCN', 'Tư vấn thuế'],
            suitableFor: 'Hộ kinh doanh nhỏ',
            status: 'active',
            popular: true
          },
          {
            id: 2,
            name: 'Gói Tiêu Chuẩn',
            description: 'Dịch vụ kế toán thuế cho hộ kinh doanh quy mô vừa',
            price: '1.000.000đ',
            features: ['Kê khai thuế GTGT', 'Kê khai thuế TNCN', 'Tư vấn thuế', 'Lưu trữ hồ sơ'],
            suitableFor: 'Hộ kinh doanh quy mô vừa',
            status: 'active',
            popular: true
          },
          {
            id: 3,
            name: 'Gói Nâng Cao',
            description: 'Dịch vụ kế toán thuế trọn gói cho hộ kinh doanh',
            price: '1.500.000đ',
            features: ['Kê khai thuế đầy đủ', 'Tư vấn thuế', 'Lưu trữ hồ sơ', 'Hỗ trợ quyết toán'],
            suitableFor: 'Hộ kinh doanh có quy mô lớn',
            status: 'active',
            popular: false
          },
          {
            id: 4,
            name: 'Gói VIP',
            description: 'Dịch vụ kế toán thuế chuyên nghiệp cho hộ kinh doanh',
            price: '2.000.000đ',
            features: ['Kê khai thuế đầy đủ', 'Tư vấn thuế', 'Lưu trữ hồ sơ', 'Hỗ trợ quyết toán', 'Tư vấn tài chính'],
            suitableFor: 'Hộ kinh doanh có nhu cầu đặc biệt',
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
          name: 'Gói Cơ Bản',
          description: 'Dịch vụ kê khai thuế cho hộ kinh doanh cá thể',
          price: '500.000đ',
          features: ['Kê khai thuế GTGT', 'Kê khai thuế TNCN', 'Tư vấn thuế'],
          suitableFor: 'Hộ kinh doanh nhỏ',
          status: 'active',
          popular: true
        },
        {
          id: 2,
          name: 'Gói Tiêu Chuẩn',
          description: 'Dịch vụ kế toán thuế cho hộ kinh doanh quy mô vừa',
          price: '1.000.000đ',
          features: ['Kê khai thuế GTGT', 'Kê khai thuế TNCN', 'Tư vấn thuế', 'Lưu trữ hồ sơ'],
          suitableFor: 'Hộ kinh doanh quy mô vừa',
          status: 'active',
          popular: true
        },
        {
          id: 3,
          name: 'Gói Nâng Cao',
          description: 'Dịch vụ kế toán thuế trọn gói cho hộ kinh doanh',
          price: '1.500.000đ',
          features: ['Kê khai thuế đầy đủ', 'Tư vấn thuế', 'Lưu trữ hồ sơ', 'Hỗ trợ quyết toán'],
          suitableFor: 'Hộ kinh doanh có quy mô lớn',
          status: 'active',
          popular: false
        },
        {
          id: 4,
          name: 'Gói VIP',
          description: 'Dịch vụ kế toán thuế chuyên nghiệp cho hộ kinh doanh',
          price: '2.000.000đ',
          features: ['Kê khai thuế đầy đủ', 'Tư vấn thuế', 'Lưu trữ hồ sơ', 'Hỗ trợ quyết toán', 'Tư vấn tài chính'],
          suitableFor: 'Hộ kinh doanh có nhu cầu đặc biệt',
          status: 'active',
          popular: false
        }
      ]);
    }
  }, []);

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">DỊCH VỤ THUẾ HỘ KINH DOANH</h2>
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
            to="/thue-ho-kinh-doanh" 
            className="inline-block px-8 py-3 bg-[#D4AF37] text-white font-bold rounded-lg hover:bg-[#b8942f] transition-colors shadow-lg"
          >
            Xem tất cả dịch vụ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TaxServiceSection;