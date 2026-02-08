import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AccountingManager = () => {
  const navigate = useNavigate();
  
  // Danh sách các dịch vụ kế toán doanh nghiệp
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const storedServices = localStorage.getItem('accountingServices');
    if (storedServices) {
      try {
        const parsedServices = JSON.parse(storedServices);

        // Lọc các dịch vụ hợp lệ (có đầy đủ thông tin cần thiết)
        const validServices = parsedServices.filter(service =>
          (service.title || service.name) &&
          service.description &&
          service.price &&
          Array.isArray(service.features) &&
          service.suitableFor &&
          service.status
        );

        setServices(validServices);
      } catch (e) {
        console.error('Error parsing accounting services from localStorage', e);
        // Dữ liệu mẫu nếu có lỗi
        setServices([
          {
            id: 'ktdn1',
            title: 'KẾ TOÁN TM DỊCH VỤ',
            description: 'Dịch vụ kế toán cho doanh nghiệp thương mại dịch vụ',
            price: '1.500.000đ',
            features: [
              'Kê khai thuế GTGT hàng tháng/quý',
              'Kê khai thuế TNCN cuối năm',
              'Lập báo cáo tài chính',
              'Quyết toán thuế cuối năm',
              'Tư vấn kế toán miễn phí'
            ],
            suitableFor: 'Doanh nghiệp thương mại dịch vụ',
            timeComplete: 'Trọn gói 1 năm',
            status: 'active',
            popular: true,
            isPopular: true
          },
          {
            id: 'ktdn2',
            title: 'KẾ TOÁN THI CÔNG XÂY DỰNG',
            description: 'Dịch vụ kế toán cho doanh nghiệp thi công xây dựng',
            price: '2.500.000đ',
            features: [
              'Kê khai thuế GTGT hàng tháng/quý',
              'Kê khai thuế TNCN cuối năm',
              'Lập báo cáo tài chính',
              'Quyết toán thuế cuối năm',
              'Tư vấn kế toán miễn phí'
            ],
            suitableFor: 'Doanh nghiệp thi công xây dựng',
            timeComplete: 'Trọn gói 1 năm',
            status: 'active',
            popular: false,
            isPopular: false
          },
          {
            id: 'ktdn3',
            title: 'KẾ TOÁN GIA CÔNG SẢN XUẤT',
            description: 'Dịch vụ kế toán cho doanh nghiệp gia công sản xuất',
            price: '3.000.000đ',
            features: [
              'Kê khai thuế GTGT hàng tháng/quý',
              'Kê khai thuế TNCN cuối năm',
              'Lập báo cáo tài chính',
              'Quyết toán thuế cuối năm',
              'Tư vấn kế toán miễn phí'
            ],
            suitableFor: 'Doanh nghiệp gia công sản xuất',
            timeComplete: 'Trọn gói 1 năm',
            status: 'active',
            popular: true,
            isPopular: true
          },
          {
            id: 'ktdn4',
            title: 'LÀM LẠI SỔ SÁCH KẾ TOÁN',
            description: 'Dịch vụ làm lại sổ sách kế toán cho doanh nghiệp',
            price: '1.200.000đ',
            features: [
              'Kiểm tra sổ sách hiện tại',
              'Lập lại chứng từ kế toán',
              'Cập nhật sổ sách theo quy định',
              'Tư vấn xử lý sai sót'
            ],
            suitableFor: 'Doanh nghiệp cần làm lại sổ sách',
            timeComplete: 'Tùy theo tình trạng sổ sách',
            status: 'active',
            popular: false,
            isPopular: false
          },
          {
            id: 'ktdn5',
            title: 'BÁO CÁO TÀI CHÍNH NĂM',
            description: 'Dịch vụ lập báo cáo tài chính năm cho doanh nghiệp',
            price: '3.500.000đ',
            features: [
              'Lập báo cáo tài chính năm',
              'Kiểm toán nội bộ',
              'Tư vấn tài chính',
              'Hỗ trợ giải trình với cơ quan thuế'
            ],
            suitableFor: 'Doanh nghiệp cần báo cáo tài chính năm',
            timeComplete: 'Theo quy định',
            status: 'active',
            popular: false,
            isPopular: false
          },
          {
            id: 'ktdn6',
            title: 'BỔ NHIỆM KẾ TOÁN TRƯỞNG',
            description: 'Dịch vụ bổ nhiệm kế toán trưởng',
            price: '4.000.000đ',
            features: [
              'Tư vấn pháp lý kế toán',
              'Đại diện làm việc với cơ quan thuế',
              'Hỗ trợ chuyên môn kế toán',
              'Quản lý hồ sơ kế toán'
            ],
            suitableFor: 'Doanh nghiệp cần bổ nhiệm kế toán trưởng',
            timeComplete: 'Trọn gói 1 năm',
            status: 'active',
            popular: false,
            isPopular: false
          },
          {
            id: 'ktdn7',
            title: 'ĐĂNG KÝ BHXH',
            description: 'Dịch vụ đăng ký bảo hiểm xã hội cho doanh nghiệp',
            price: '1.050.000đ - 1.550.000đ',
            features: [
              'Tư vấn chính sách BHXH',
              'Làm thủ tục đăng ký BHXH',
              'Theo dõi quá trình xử lý',
              'Hỗ trợ giải đáp thắc mắc'
            ],
            suitableFor: 'Doanh nghiệp cần đăng ký BHXH',
            timeComplete: 'Tùy số lượng nhân sự',
            status: 'active',
            popular: false,
            isPopular: false
          }
        ]);
      }
    } else {
      // Dữ liệu mẫu nếu không có trong localStorage
      setServices([
        {
          id: 'ktdn1',
          title: 'KẾ TOÁN TM DỊCH VỤ',
          description: 'Dịch vụ kế toán cho doanh nghiệp thương mại dịch vụ',
          price: '1.500.000đ',
          features: [
            'Kê khai thuế GTGT hàng tháng/quý',
            'Kê khai thuế TNCN cuối năm',
            'Lập báo cáo tài chính',
            'Quyết toán thuế cuối năm',
            'Tư vấn kế toán miễn phí'
          ],
          suitableFor: 'Doanh nghiệp thương mại dịch vụ',
          timeComplete: 'Trọn gói 1 năm',
          status: 'active',
          popular: true,
          isPopular: true
        },
        {
          id: 'ktdn2',
          title: 'KẾ TOÁN THI CÔNG XÂY DỰNG',
          description: 'Dịch vụ kế toán cho doanh nghiệp thi công xây dựng',
          price: '2.500.000đ',
          features: [
            'Kê khai thuế GTGT hàng tháng/quý',
            'Kê khai thuế TNCN cuối năm',
            'Lập báo cáo tài chính',
            'Quyết toán thuế cuối năm',
            'Tư vấn kế toán miễn phí'
          ],
          suitableFor: 'Doanh nghiệp thi công xây dựng',
          timeComplete: 'Trọn gói 1 năm',
          status: 'active',
          popular: false,
          isPopular: false
        },
        {
          id: 'ktdn3',
          title: 'KẾ TOÁN GIA CÔNG SẢN XUẤT',
          description: 'Dịch vụ kế toán cho doanh nghiệp gia công sản xuất',
          price: '3.000.000đ',
          features: [
            'Kê khai thuế GTGT hàng tháng/quý',
            'Kê khai thuế TNCN cuối năm',
            'Lập báo cáo tài chính',
            'Quyết toán thuế cuối năm',
            'Tư vấn kế toán miễn phí'
          ],
          suitableFor: 'Doanh nghiệp gia công sản xuất',
          timeComplete: 'Trọn gói 1 năm',
          status: 'active',
          popular: true,
          isPopular: true
        },
        {
          id: 'ktdn4',
          title: 'LÀM LẠI SỔ SÁCH KẾ TOÁN',
          description: 'Dịch vụ làm lại sổ sách kế toán cho doanh nghiệp',
          price: '1.200.000đ',
          features: [
            'Kiểm tra sổ sách hiện tại',
            'Lập lại chứng từ kế toán',
            'Cập nhật sổ sách theo quy định',
            'Tư vấn xử lý sai sót'
          ],
          suitableFor: 'Doanh nghiệp cần làm lại sổ sách',
          timeComplete: 'Tùy theo tình trạng sổ sách',
          status: 'active',
          popular: false,
          isPopular: false
        },
        {
          id: 'ktdn5',
          title: 'BÁO CÁO TÀI CHÍNH NĂM',
          description: 'Dịch vụ lập báo cáo tài chính năm cho doanh nghiệp',
          price: '3.500.000đ',
          features: [
            'Lập báo cáo tài chính năm',
            'Kiểm toán nội bộ',
            'Tư vấn tài chính',
            'Hỗ trợ giải trình với cơ quan thuế'
          ],
          suitableFor: 'Doanh nghiệp cần báo cáo tài chính năm',
          timeComplete: 'Theo quy định',
          status: 'active',
          popular: false,
          isPopular: false
        },
        {
          id: 'ktdn6',
          title: 'BỔ NHIỆM KẾ TOÁN TRƯỞNG',
          description: 'Dịch vụ bổ nhiệm kế toán trưởng',
          price: '4.000.000đ',
          features: [
            'Tư vấn pháp lý kế toán',
            'Đại diện làm việc với cơ quan thuế',
            'Hỗ trợ chuyên môn kế toán',
            'Quản lý hồ sơ kế toán'
          ],
          suitableFor: 'Doanh nghiệp cần bổ nhiệm kế toán trưởng',
          timeComplete: 'Trọn gói 1 năm',
          status: 'active',
          popular: false,
          isPopular: false
        },
        {
          id: 'ktdn7',
          title: 'ĐĂNG KÝ BHXH',
          description: 'Dịch vụ đăng ký bảo hiểm xã hội cho doanh nghiệp',
          price: '1.050.000đ - 1.550.000đ',
          features: [
            'Tư vấn chính sách BHXH',
            'Làm thủ tục đăng ký BHXH',
            'Theo dõi quá trình xử lý',
            'Hỗ trợ giải đáp thắc mắc'
          ],
          suitableFor: 'Doanh nghiệp cần đăng ký BHXH',
          timeComplete: 'Tùy số lượng nhân sự',
          status: 'active',
          popular: false,
          isPopular: false
        }
      ]);
    }
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const handleAddService = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      const updatedServices = services.filter(service => service.id !== id);
      setServices(updatedServices);
      // Cập nhật localStorage
      localStorage.setItem('accountingServices', JSON.stringify(updatedServices));
    }
  };

  const handleSubmit = (serviceData) => {
    if (editingService) {
      // Cập nhật dịch vụ
      const updatedServices = services.map(s => s.id === editingService.id ? {...serviceData, id: editingService.id} : s);
      setServices(updatedServices);
      // Lưu vào localStorage
      localStorage.setItem('accountingServices', JSON.stringify(updatedServices));
    } else {
      // Thêm mới dịch vụ
      const newService = {
        ...serviceData,
        id: Date.now()
      };
      const updatedServices = [...services, newService];
      setServices(updatedServices);
      // Lưu vào localStorage
      localStorage.setItem('accountingServices', JSON.stringify(updatedServices));
    }
    setShowForm(false);
    setEditingService(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingService(null);
  };

  if (showForm) {
    return (
      <ServiceForm 
        onSubmit={handleSubmit} 
        onCancel={handleCancel} 
        initialData={editingService} 
        category="Kế Toán Doanh Nghiệp"
      />
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Quản Lý Dịch Vụ Kế Toán Doanh Nghiệp</h1>
          <button
            onClick={handleAddService}
            className="px-4 py-2 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8942f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37]"
          >
            Thêm dịch vụ
          </button>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-gray-800">{service.name}</h3>
                  {service.popular && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">Phổ biến</span>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                
                <div className="mb-4">
                  <p className="text-[#D4AF37] font-bold text-lg">{service.price}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-700 text-sm mb-2"><span className="font-medium">Phù hợp:</span> {service.suitableFor}</p>
                  <p className="text-gray-700 text-sm"><span className="font-medium">Trạng thái:</span> 
                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                      service.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {service.status === 'active' ? 'Hoạt động' : 'Ngừng'}
                    </span>
                  </p>
                </div>
                
                <div className="mb-4">
                  <p className="font-medium text-gray-700 text-sm mb-1">Tính năng:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {service.features.map((feature, index) => (
                      <li key={`${service.id}-${index}`} className="flex items-start">
                        <span className="text-[#D4AF37] mr-2">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="flex-1 py-2 px-4 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8942f] transition-colors text-sm font-medium"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Component form để thêm/sửa dịch vụ
const ServiceForm = ({ onSubmit, onCancel, initialData = null, category }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    features: initialData?.features || [],
    suitableFor: initialData?.suitableFor || '',
    status: initialData?.status || 'active',
    popular: initialData?.popular || false
  });

  const [featureInput, setFeatureInput] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddFeature = () => {
    if (featureInput.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      category: category
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        {initialData ? 'Chỉnh sửa dịch vụ' : 'Tạo dịch vụ mới'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên dịch vụ</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-[#333] bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-[#333] bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Giá</label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-[#333] bg-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phù hợp với</label>
          <input
            type="text"
            name="suitableFor"
            value={formData.suitableFor}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-[#333] bg-white"
            placeholder="Ví dụ: Doanh nghiệp mới thành lập"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tính năng</label>
          <div className="flex">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-[#333] bg-white"
              placeholder="Nhập tính năng..."
            />
            <button
              type="button"
              onClick={handleAddFeature}
              className="px-4 py-2 bg-[#D4AF37] text-white rounded-r-md hover:bg-[#b8942f]"
            >
              Thêm
            </button>
          </div>
          <div className="mt-2">
            {formData.features.map((feature, index) => (
              <div key={`feature-${index}`} className="flex justify-between items-center bg-gray-100 px-3 py-1 rounded mt-1">
                <span className="text-gray-900">{feature}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="popular"
            checked={formData.popular}
            onChange={handleChange}
            className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">Là dịch vụ phổ biến</label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-[#333] bg-white"
          >
            <option value="active">Hoạt động</option>
            <option value="inactive">Ngừng</option>
          </select>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8942f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37]"
          >
            {initialData ? 'Cập nhật dịch vụ' : 'Tạo dịch vụ'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountingManager;