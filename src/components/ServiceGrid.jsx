import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ServiceGrid = ({ category, title }) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Lấy dữ liệu từ localStorage theo danh mục
    let storedServices = [];
    switch(category) {
      case 'business-registration':
        storedServices = JSON.parse(localStorage.getItem('businessRegistrationServices')) || [];
        break;
      case 'tax':
        storedServices = JSON.parse(localStorage.getItem('taxServices')) || [];
        break;
      case 'accounting':
        storedServices = JSON.parse(localStorage.getItem('accountingServices')) || [];
        break;
      case 'web-design':
        storedServices = JSON.parse(localStorage.getItem('webDesignServices')) || [];
        break;
      default:
        storedServices = [];
    }
    
    setServices(storedServices);
  }, [category]);

  if (services.length === 0) {
    return null; // Không hiển thị gì nếu không có dịch vụ
  }

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
          <div className="w-20 h-1 bg-[#D4AF37] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-800">{service.name}</h3>
                  {service.popular && (
                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                      Phổ biến
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
                
                <div className="mb-4">
                  <p className="text-[#D4AF37] font-bold text-xl">{service.price}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-700 text-sm mb-2">
                    <span className="font-medium">Phù hợp:</span> {service.suitableFor}
                  </p>
                  <p className="text-gray-700 text-sm">
                    <span className="font-medium">Trạng thái:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
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
                    {service.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-[#D4AF37] mr-2">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                    {service.features.length > 3 && (
                      <li className="text-[#D4AF37] font-medium">+ {service.features.length - 3} tính năng khác</li>
                    )}
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
            to={`/${category.replace('-', '/')}`}
            className="inline-block px-8 py-3 bg-[#D4AF37] text-white font-bold rounded-lg hover:bg-[#b8942f] transition-colors shadow-lg"
          >
            Xem tất cả dịch vụ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceGrid;