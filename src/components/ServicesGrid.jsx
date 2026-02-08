import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ServiceOrderForm from './ServiceOrderForm';

const ServicesGrid = () => {
  const navigate = useNavigate();
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);

  // Load services from localStorage if available
  useEffect(() => {
    // Load services from various sources
    let loadedServices = [];

    // Try to get featured services first
    const storedServices = localStorage.getItem('featuredServices');
    if (storedServices) {
      try {
        loadedServices = JSON.parse(storedServices);
      } catch (e) {
        console.error('Error parsing featured services from localStorage', e);
      }
    } else {
      // If no featured services, get services from individual categories
      const dangKyKinhDoanhServices = JSON.parse(localStorage.getItem('dangKyKinhDoanhServices')) || [];
      const keToanDoanhNghiepServices = JSON.parse(localStorage.getItem('keToanDoanhNghiepServices')) || [];
      const thueHoKinhDoanhServices = JSON.parse(localStorage.getItem('thueHoKinhDoanhServices')) || [];
      const thietKeWebServices = JSON.parse(localStorage.getItem('thietKeWebServices')) || [];

      // Combine services from all categories, taking popular ones first and limiting to 6
      const allServices = [
        ...dangKyKinhDoanhServices.map(s => ({...s, category: 'Đăng Ký Kinh Doanh', path: '/dang-ky-kinh-doanh'})),
        ...keToanDoanhNghiepServices.map(s => ({...s, category: 'Kế Toán Doanh Nghiệp', path: '/ke-toan-doanh-nghiep'})),
        ...thueHoKinhDoanhServices.map(s => ({...s, category: 'Thuế Hộ Kinh Doanh', path: '/thue-ho-kinh-doanh'})),
        ...thietKeWebServices.map(s => ({...s, category: 'Thiết Kế Web', path: '/thiet-ke-web'}))
      ];

      // Filter out the website package and sort by popularity, then take top 6
      loadedServices = allServices
        .filter(service => !(service.title && service.title.toLowerCase().includes('website') && service.title.toLowerCase().includes('bán hàng')))
        .sort((a, b) => (b.popular || b.isPopular ? 1 : 0) - (a.popular || a.isPopular ? 1 : 0))
        .slice(0, 6);
    }

    setServices(loadedServices);
  }, []);

  const handleBookService = (service) => {
    setSelectedService(service);
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
    <div className="py-15 bg-gray-50" style={{ padding: '60px 0', backgroundColor: '#f8f9fa' }}>
      <div className="container max-w-6xl mx-auto px-4">
        <h2 className="section-title text-3xl font-bold text-center mb-12 text-[#D4AF37] uppercase"
            style={{ fontSize: '2.2em', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '50px', textAlign: 'center' }}>
          DỊCH VỤ TIÊU BIỂU
        </h2>

        <div className="services-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '30px' }}>
          {services.map((service, index) => (
            <div
              key={service.id || index}
              className={`service-card bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 group ${service.popular ? 'border-2 border-[#D4AF37] relative' : ''}`}
              style={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'transform 0.3s, box-shadow 0.3s',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
            >
              {/* Popular badge */}
              {service.popular && (
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

              {/* Shimmer effect overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 -translate-x-full group-hover:translate-x-full pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)',
                  width: '50%',
                  height: '100%',
                  transform: 'skewX(-20deg)',
                  animation: 'shimmer 1.5s infinite',
                  zIndex: '20',
                }}
              ></div>

              <div className="p-6 flex flex-col h-full" style={{ padding: '25px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="flex-grow" style={{ flexGrow: 1 }}>
                  <h3 className="text-xl font-bold text-[#D4AF37] mb-3" style={{ fontSize: '1.4em', color: '#D4AF37', marginBottom: '15px' }}>
                    {service.category}
                  </h3>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2" style={{ color: '#495057', marginBottom: '10px' }}>
                    {service.name}
                  </h4>
                  <p className="text-gray-700 mb-4" style={{ color: '#495057', marginBottom: '15px', lineHeight: '1.6' }}>
                    {service.description}
                  </p>

                  <div className="mb-4">
                    <span className="text-xl font-bold text-red-600" style={{ fontSize: '1.2em', color: '#dc2626', fontWeight: 'bold' }}>
                      {service.price}
                    </span>
                  </div>

                  <ul className="text-sm text-gray-600 mb-4 space-y-1" style={{ color: '#6c757d', fontSize: '0.875em', marginBottom: '15px' }}>
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <li key={`${service.id || service.name}-${idx}`} className="flex items-start" style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <span className="text-[#D4AF37] mr-2" style={{ color: '#D4AF37', marginRight: '8px' }}>•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {service.timeComplete && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600" style={{ color: '#6c757d', fontSize: '0.875em' }}>
                        <span className="font-medium text-gray-900" style={{ color: '#495057' }}>Thời gian hoàn thành:</span> {service.timeComplete}
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-auto">
                  <button
                    onClick={() => handleBookService(service)}
                    className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
                  >
                    ĐẶT DỊCH VỤ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .service-card:hover .shimmer {
            animation: shimmer 1.5s infinite;
          }
        `}
      </style>

      {/* Order Form Modal */}
      {showOrderForm && selectedService && (
        <ServiceOrderForm
          serviceName={selectedService.name}
          servicePrice={selectedService.price}
          onClose={closeOrderForm}
          onSubmit={handleOrderSubmit}
        />
      )}
    </div>
  );
};

export default ServicesGrid;