import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WebDesignManager = () => {
  const navigate = useNavigate();
  
  // Danh sách các dịch vụ thiết kế web
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const storedServices = localStorage.getItem('webDesignServices');
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
        console.error('Error parsing web design services from localStorage', e);
        // Dữ liệu mẫu nếu có lỗi
        setServices([
          {
            id: 'web1',
            title: 'GÓI 1: WEB GIỚI THIỆU',
            description: 'Gói website giới thiệu cơ bản cho doanh nghiệp',
            price: '3.000.000đ',
            features: [
              'Thiết kế web giới thiệu doanh nghiệp',
              'Responsive - tương thích di động',
              'Tối ưu SEO cơ bản',
              'Tích hợp form liên hệ',
              'Hỗ trợ kỹ thuật 3 tháng'
            ],
            suitableFor: 'Doanh nghiệp mới, cá nhân kinh doanh',
            timeComplete: '7-15 ngày',
            status: 'active',
            popular: true,
            isPopular: true
          },
          {
            id: 'web2',
            title: 'GÓI 2: WEB GIỚI THIỆU + QUẢN TRỊ',
            description: 'Gói website giới thiệu có trang quản trị',
            price: '4.000.000đ',
            features: [
              'Thiết kế web giới thiệu doanh nghiệp',
              'Trang quản trị nội dung',
              'Tự cập nhật nội dung dễ dàng',
              'Tối ưu SEO nâng cao',
              'Hỗ trợ kỹ thuật 6 tháng'
            ],
            suitableFor: 'Doanh nghiệp vừa và nhỏ',
            timeComplete: '7-15 ngày',
            status: 'active',
            popular: false,
            isPopular: false
          },
          {
            id: 'web3',
            title: 'GÓI 3: WEB GIỚI THIỆU + RESPONSIVE',
            description: 'Gói website giới thiệu tương thích responsive',
            price: '6.000.000đ',
            features: [
              'Thiết kế web giới thiệu doanh nghiệp',
              'Responsive - tương thích mọi thiết bị',
              'Tối ưu trải nghiệm người dùng',
              'Tích hợp mạng xã hội',
              'Hỗ trợ kỹ thuật 12 tháng'
            ],
            suitableFor: 'Doanh nghiệp muốn hiện diện chuyên nghiệp',
            timeComplete: '7-15 ngày',
            status: 'active',
            popular: true,
            isPopular: true
          },
          {
            id: 'web4',
            title: 'GÓI 4: WEB GIỚI THIỆU + ADMIN + RESPONSIVE',
            description: 'Gói website giới thiệu đầy đủ tính năng',
            price: '7.000.000đ',
            features: [
              'Thiết kế web giới thiệu doanh nghiệp',
              'Trang quản trị nội dung',
              'Responsive - tương thích mọi thiết bị',
              'Tích hợp form liên hệ, chat',
              'Tự cập nhật nội dung dễ dàng',
              'Hỗ trợ kỹ thuật trọn đời'
            ],
            suitableFor: 'Doanh nghiệp chuyên nghiệp',
            timeComplete: '7-15 ngày',
            status: 'active',
            popular: false,
            isPopular: false
          },
          {
            id: 'web5',
            title: 'GÓI TƯ VẤN',
            description: 'Gói tư vấn thiết kế web theo yêu cầu đặc biệt',
            price: 'Liên hệ tư vấn',
            features: [
              'Tư vấn lựa chọn gói phù hợp',
              'Phân tích yêu cầu chi tiết',
              'Thiết kế theo yêu cầu đặc biệt',
              'Tích hợp tính năng tùy chỉnh',
              'Hỗ trợ kỹ thuật trọn đời'
            ],
            suitableFor: 'Doanh nghiệp có yêu cầu đặc biệt',
            timeComplete: '7-15 ngày',
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
          id: 'web1',
          title: 'GÓI 1: WEB GIỚI THIỆU',
          description: 'Gói website giới thiệu cơ bản cho doanh nghiệp',
          price: '3.000.000đ',
          features: [
            'Thiết kế web giới thiệu doanh nghiệp',
            'Responsive - tương thích di động',
            'Tối ưu SEO cơ bản',
            'Tích hợp form liên hệ',
            'Hỗ trợ kỹ thuật 3 tháng'
          ],
          suitableFor: 'Doanh nghiệp mới, cá nhân kinh doanh',
          timeComplete: '7-15 ngày',
          status: 'active',
          popular: true,
          isPopular: true
        },
        {
          id: 'web2',
          title: 'GÓI 2: WEB GIỚI THIỆU + QUẢN TRỊ',
          description: 'Gói website giới thiệu có trang quản trị',
          price: '4.000.000đ',
          features: [
            'Thiết kế web giới thiệu doanh nghiệp',
            'Trang quản trị nội dung',
            'Tự cập nhật nội dung dễ dàng',
            'Tối ưu SEO nâng cao',
            'Hỗ trợ kỹ thuật 6 tháng'
          ],
          suitableFor: 'Doanh nghiệp vừa và nhỏ',
          timeComplete: '7-15 ngày',
          status: 'active',
          popular: false,
          isPopular: false
        },
        {
          id: 'web3',
          title: 'GÓI 3: WEB GIỚI THIỆU + RESPONSIVE',
          description: 'Gói website giới thiệu tương thích responsive',
          price: '6.000.000đ',
          features: [
            'Thiết kế web giới thiệu doanh nghiệp',
            'Responsive - tương thích mọi thiết bị',
            'Tối ưu trải nghiệm người dùng',
            'Tích hợp mạng xã hội',
            'Hỗ trợ kỹ thuật 12 tháng'
          ],
          suitableFor: 'Doanh nghiệp muốn hiện diện chuyên nghiệp',
          timeComplete: '7-15 ngày',
          status: 'active',
          popular: true,
          isPopular: true
        },
        {
          id: 'web4',
          title: 'GÓI 4: WEB GIỚI THIỆU + ADMIN + RESPONSIVE',
          description: 'Gói website giới thiệu đầy đủ tính năng',
          price: '7.000.000đ',
          features: [
            'Thiết kế web giới thiệu doanh nghiệp',
            'Trang quản trị nội dung',
            'Responsive - tương thích mọi thiết bị',
            'Tích hợp form liên hệ, chat',
            'Tự cập nhật nội dung dễ dàng',
            'Hỗ trợ kỹ thuật trọn đời'
          ],
          suitableFor: 'Doanh nghiệp chuyên nghiệp',
          timeComplete: '7-15 ngày',
          status: 'active',
          popular: false,
          isPopular: false
        },
        {
          id: 'web5',
          title: 'GÓI TƯ VẤN',
          description: 'Gói tư vấn thiết kế web theo yêu cầu đặc biệt',
          price: 'Liên hệ tư vấn',
          features: [
            'Tư vấn lựa chọn gói phù hợp',
            'Phân tích yêu cầu chi tiết',
            'Thiết kế theo yêu cầu đặc biệt',
            'Tích hợp tính năng tùy chỉnh',
            'Hỗ trợ kỹ thuật trọn đời'
          ],
          suitableFor: 'Doanh nghiệp có yêu cầu đặc biệt',
          timeComplete: '7-15 ngày',
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
      localStorage.setItem('webDesignServices', JSON.stringify(updatedServices));
    }
  };

  const handleSubmit = (serviceData) => {
    if (editingService) {
      // Cập nhật dịch vụ
      const updatedServices = services.map(s => s.id === editingService.id ? {...serviceData, id: editingService.id} : s);
      setServices(updatedServices);
      // Lưu vào localStorage
      localStorage.setItem('webDesignServices', JSON.stringify(updatedServices));
    } else {
      // Thêm mới dịch vụ
      const newService = {
        ...serviceData,
        id: Date.now()
      };
      const updatedServices = [...services, newService];
      setServices(updatedServices);
      // Lưu vào localStorage
      localStorage.setItem('webDesignServices', JSON.stringify(updatedServices));
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
        category="Thiết Kế Web"
      />
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Quản Lý Dịch Vụ Thiết Kế Web</h1>
          <button
            onClick={handleAddService}
            className="px-4 py-2 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8942f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37]"
          >
            Thêm dịch vụ
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên dịch vụ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phù hợp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phổ biến</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{service.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{service.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#D4AF37]">{service.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{service.suitableFor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {service.popular ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Phổ biến
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Thường
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {service.status === 'active' ? 'Hoạt động' : 'Ngừng'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(service)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            placeholder="Ví dụ: Cá nhân, hộ kinh doanh nhỏ"
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

export default WebDesignManager;