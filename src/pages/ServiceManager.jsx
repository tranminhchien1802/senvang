import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ServiceManager = () => {
  const navigate = useNavigate();

  // Lấy dữ liệu từ tất cả các danh mục dịch vụ
  const [allServices, setAllServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  useEffect(() => {
    // Lấy dữ liệu từ localStorage cho tất cả các danh mục
    const getValidServices = (dataStr, category) => {
      try {
        const services = JSON.parse(dataStr);
        return services.filter(service =>
          service.name &&
          service.description &&
          service.price &&
          Array.isArray(service.features) &&
          service.suitableFor &&
          service.status
        ).map(s => ({...s, category}));
      } catch (e) {
        console.error(`Error parsing ${category} services from localStorage`, e);
        return [];
      }
    };

    const businessRegServices = localStorage.getItem('businessRegistrationServices')
      ? getValidServices(localStorage.getItem('businessRegistrationServices'), 'Đăng Ký Kinh Doanh')
      : [];
    const accountingServices = localStorage.getItem('accountingServices')
      ? getValidServices(localStorage.getItem('accountingServices'), 'Kế Toán Doanh Nghiệp')
      : [];
    const taxServices = localStorage.getItem('taxServices')
      ? getValidServices(localStorage.getItem('taxServices'), 'Thuế Hộ Kinh Doanh')
      : [];
    const webDesignServices = localStorage.getItem('webDesignServices')
      ? getValidServices(localStorage.getItem('webDesignServices'), 'Thiết Kế Web')
      : [];

    // Thêm category vào mỗi dịch vụ
    const servicesWithCategory = [
      ...businessRegServices,
      ...accountingServices,
      ...taxServices,
      ...webDesignServices
    ];

    setAllServices(servicesWithCategory);
  }, []);

  // Lấy danh sách danh mục duy nhất
  const categories = ['Tất cả', ...new Set(allServices.map(s => s.category))];

  // Lọc dịch vụ theo danh mục đã chọn
  const filteredServices = selectedCategory === 'Tất cả'
    ? allServices
    : allServices.filter(s => s.category === selectedCategory);

  // Lọc dịch vụ theo danh mục riêng biệt để hiển thị trong từng phần
  const businessRegServices = allServices.filter(s => s.category === 'Đăng Ký Kinh Doanh');
  const accountingServices = allServices.filter(s => s.category === 'Kế Toán Doanh Nghiệp');
  const taxServices = allServices.filter(s => s.category === 'Thuế Hộ Kinh Doanh');
  const webDesignServices = allServices.filter(s => s.category === 'Thiết Kế Web');

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản Lý Tất Cả Dịch Vụ</h1>
          <p className="text-gray-600">Quản lý và theo dõi tất cả các dịch vụ của hệ thống</p>
        </div>

        {/* Bộ lọc danh mục */}
        <div className="mb-8 bg-white rounded-xl shadow p-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#D4AF37] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Đăng Ký Kinh Doanh</h3>
            <p className="text-3xl font-bold text-[#D4AF37]">{businessRegServices.length}</p>
            <p className="text-gray-500 text-sm">Dịch vụ</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Kế Toán Doanh Nghiệp</h3>
            <p className="text-3xl font-bold text-[#D4AF37]">{accountingServices.length}</p>
            <p className="text-gray-500 text-sm">Dịch vụ</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Thuế Hộ Kinh Doanh</h3>
            <p className="text-3xl font-bold text-[#D4AF37]">{taxServices.length}</p>
            <p className="text-gray-500 text-sm">Dịch vụ</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Thiết Kế Web</h3>
            <p className="text-3xl font-bold text-[#D4AF37]">{webDesignServices.length}</p>
            <p className="text-gray-500 text-sm">Dịch vụ</p>
          </div>
        </div>

        {/* Danh sách dịch vụ theo bộ lọc */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {selectedCategory === 'Tất cả' ? 'Tất Cả Dịch Vụ' : selectedCategory}
            </h2>
            <span className="text-gray-600">{filteredServices.length} dịch vụ</span>
          </div>

          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredServices.map((service) => (
                <div key={service.id} className="bg-gray-50 rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-900 truncate">{service.name}</h3>
                      {service.popular && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full ml-2 whitespace-nowrap">Phổ biến</span>
                      )}
                    </div>

                    <p className="text-gray-700 text-sm mb-3 line-clamp-2">{service.description}</p>

                    <div className="mb-3">
                      <p className="text-[#D4AF37] font-bold text-lg">{service.price}</p>
                    </div>

                    <div className="mb-3">
                      <p className="text-gray-700 text-xs mb-1">
                        <span className="font-medium">Phù hợp:</span> {service.suitableFor}
                      </p>
                      <p className="text-gray-700 text-xs">
                        <span className="font-medium">Danh mục:</span> {service.category}
                      </p>
                      <p className="text-gray-700 text-xs">
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

                    <div className="mb-4 max-h-24 overflow-y-auto">
                      <p className="font-medium text-gray-800 text-xs mb-1">Tính năng:</p>
                      <ul className="text-xs text-gray-700 space-y-1">
                        {service.features.slice(0, 4).map((feature, index) => (
                          <li key={`${service.id}-${index}`} className="flex items-start">
                            <span className="text-[#D4AF37] mr-1 text-xs">•</span>
                            <span className="truncate">{feature}</span>
                          </li>
                        ))}
                        {service.features.length > 4 && (
                          <li className="text-gray-500 text-xs">+ {service.features.length - 4} tính năng khác</li>
                        )}
                      </ul>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          // Điều hướng đến trang quản lý phù hợp dựa trên danh mục
                          switch(service.category) {
                            case 'Đăng Ký Kinh Doanh':
                              navigate('/admin/business-registration');
                              break;
                            case 'Kế Toán Doanh Nghiệp':
                              navigate('/admin/accounting');
                              break;
                            case 'Thuế Hộ Kinh Doanh':
                              navigate('/admin/tax');
                              break;
                            case 'Thiết Kế Web':
                              navigate('/admin/web-design');
                              break;
                            default:
                              navigate('/admin/services');
                          }
                        }}
                        className="flex-1 py-2 px-3 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8942f] transition-colors text-xs font-medium"
                      >
                        Sửa
                      </button>
                      <button className="flex-1 py-2 px-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xs font-medium">
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">Không có dịch vụ nào trong danh mục này</div>
              <button
                onClick={() => setSelectedCategory('Tất cả')}
                className="px-4 py-2 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8942f]"
              >
                Hiển thị tất cả
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceManager;