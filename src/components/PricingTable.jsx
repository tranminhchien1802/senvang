import React from 'react';

const PricingTable = () => {
  const packages = [
    {
      id: 'startup',
      name: 'Gói Khởi Nghiệp',
      price: '1.500.000đ',
      description: 'Dành cho doanh nghiệp mới thành lập',
      features: [
        'Thành lập doanh nghiệp TNHH 1 thành viên',
        'Đăng ký mẫu dấu và khắc dấu tròn',
        'Thông báo mẫu dấu với cơ quan thuế',
        'Hướng dẫn khai báo thuế ban đầu',
        'Tư vấn miễn phí 3 tháng'
      ],
      suitableFor: 'Doanh nghiệp mới thành lập',
      timeComplete: '3-5 ngày',
      popular: false
    },
    {
      id: 'basic',
      name: 'Gói Cơ Bản',
      price: '2.500.000đ',
      description: 'Dành cho doanh nghiệp vừa và nhỏ',
      features: [
        'Tất cả dịch vụ gói Khởi Nghiệp',
        'Đăng ký chữ ký số',
        'Đăng ký tài khoản ngân hàng',
        'Hướng dẫn sử dụng phần mềm kế toán',
        'Hỗ trợ khai thuế qua phần mềm HTKK',
        'Tư vấn miễn phí 6 tháng'
      ],
      suitableFor: 'Doanh nghiệp vừa và nhỏ',
      timeComplete: '5-7 ngày',
      popular: true
    },
    {
      id: 'standard',
      name: 'Gói Tiêu Chuẩn',
      price: '4.500.000đ',
      description: 'Dành cho doanh nghiệp có quy mô trung bình',
      features: [
        'Tất cả dịch vụ gói Cơ Bản',
        'Kê khai thuế GTGT hàng tháng/quý',
        'Kê khai thuế TNCN cuối năm',
        'Lập báo cáo tài chính',
        'Quyết toán thuế cuối năm',
        'Tư vấn kế toán định kỳ',
        'Hỗ trợ sau khi hoàn tất dịch vụ'
      ],
      suitableFor: 'Doanh nghiệp có quy mô trung bình',
      timeComplete: '7-10 ngày',
      popular: false
    },
    {
      id: 'advanced',
      name: 'Gói Nâng Cao',
      price: '6.000.000đ',
      description: 'Dành cho doanh nghiệp lớn, có nhu cầu đặc biệt',
      features: [
        'Tất cả dịch vụ gói Tiêu Chuẩn',
        'Tư vấn kế hoạch tài chính',
        'Phân tích báo cáo tài chính',
        'Tối ưu nghĩa vụ thuế',
        'Dịch vụ kế toán trưởng',
        'Hỗ trợ 24/7 qua hotline',
        'Tư vấn pháp lý doanh nghiệp'
      ],
      suitableFor: 'Doanh nghiệp lớn, có nhu cầu đặc biệt',
      timeComplete: '10-15 ngày',
      popular: false
    }
  ];

  return (
    <div className="py-15 bg-gray-50" style={{ padding: '60px 0', backgroundColor: '#f8f9fa' }}>
      <div className="container max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 uppercase" style={{ fontSize: '2.2em', color: '#333', marginBottom: '60px', textAlign: 'center', textTransform: 'uppercase' }}>
          BẢNG GIÁ DỊCH VỤ
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {packages.map((pkg) => (
            <div 
              key={pkg.id}
              className={`relative bg-white rounded-xl shadow-lg p-6 border transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                pkg.popular ? 'border-2 border-blue-500 ring-2 ring-blue-200' : 'border border-gray-200'
              }`}
              style={{ 
                backgroundColor: '#fff', 
                borderRadius: '0.5rem', 
                padding: '1.5rem', 
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
                border: pkg.popular ? '2px solid #007bff' : '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              {pkg.popular && (
                <div 
                  className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-4 py-1 transform rotate-45 origin-center"
                  style={{ 
                    backgroundColor: '#007bff', 
                    color: '#fff', 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold', 
                    padding: '0.25rem 1rem', 
                    transform: 'rotate(45deg)',
                    top: '15px',
                    right: '-10px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  PHỔ BIẾN
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontSize: '1.25rem', color: '#333', marginBottom: '0.5rem' }}>
                  {pkg.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4" style={{ color: '#718096', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  {pkg.description}
                </p>
                <div className="text-3xl font-bold text-red-600 mb-4" style={{ fontSize: '1.875rem', color: '#dc2626', fontWeight: 'bold', marginBottom: '1rem' }}>
                  {pkg.price}
                </div>
              </div>

              <ul className="space-y-3 mb-8" style={{ marginBottom: '2rem', listStyle: 'none', padding: 0 }}>
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start" style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <span className="text-blue-500 mr-2 mt-1" style={{ color: '#007bff', marginRight: '0.5rem', marginTop: '0.25rem' }}>•</span>
                    <span className="text-gray-700 text-sm" style={{ color: '#4a5568', fontSize: '0.875rem' }}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mb-6 text-sm text-gray-600" style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: '#718096' }}>
                <p><span className="font-semibold">Phù hợp:</span> {pkg.suitableFor}</p>
                <p><span className="font-semibold">Thời gian:</span> {pkg.timeComplete}</p>
              </div>

              <button
                className={`w-full py-3 rounded-lg font-bold transition-colors ${
                  pkg.popular 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  borderRadius: '0.5rem', 
                  fontWeight: 'bold', 
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
              >
                ĐẶT DỊCH VỤ
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingTable;