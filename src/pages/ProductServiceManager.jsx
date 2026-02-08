import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductServiceManager = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dang-ky-kinh-doanh');
  const [products, setProducts] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    features: [],
    suitableFor: '',
    status: 'active',
    popular: false
  });

  // Danh sách danh mục
  const categories = {
    'dang-ky-kinh-doanh': 'Đăng Ký Kinh Doanh',
    'ke-toan-doanh-nghiep': 'Kế Toán Doanh Nghiệp',
    'thue-ho-kinh-doanh': 'Thuế Hộ Kinh Doanh',
    'thiet-ke-web': 'Thiết Kế Web'
  };

  // Lấy dữ liệu từ localStorage
  useEffect(() => {
    const loadProducts = () => {
      const loadedProducts = {};
      Object.keys(categories).forEach(key => {
        const stored = localStorage.getItem(`${key}Services`);
        if (stored) {
          try {
            loadedProducts[key] = JSON.parse(stored);
          } catch (e) {
            console.error(`Error parsing ${key} services`, e);
            loadedProducts[key] = [];
          }
        } else {
          // Nếu không có dữ liệu trong localStorage, tạo mảng rỗng
          loadedProducts[key] = [];
        }
      });

      // Lấy dữ liệu từ các trang dịch vụ hiện tại nếu chưa có trong danh mục cụ thể
      Object.keys(categories).forEach(key => {
        if (loadedProducts[key].length === 0) {
          // Dữ liệu từ các trang dịch vụ hiện tại
          if (key === 'dang-ky-kinh-doanh') {
            const serviceData = JSON.parse(localStorage.getItem('businessRegistrationServices')) || [];
            loadedProducts[key] = serviceData;
          } else if (key === 'ke-toan-doanh-nghiep') {
            const serviceData = JSON.parse(localStorage.getItem('accountingServices')) || [];
            loadedProducts[key] = serviceData;
          } else if (key === 'thue-ho-kinh-doanh') {
            const serviceData = JSON.parse(localStorage.getItem('taxServices')) || [];
            loadedProducts[key] = serviceData;
          } else if (key === 'thiet-ke-web') {
            const serviceData = JSON.parse(localStorage.getItem('webDesignServices')) || [];
            loadedProducts[key] = serviceData;
          }
        }
      });

      setProducts(loadedProducts);
    };

    loadProducts();
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      features: [],
      suitableFor: '',
      status: 'active',
      popular: false
    });
    setShowForm(true);
  };

  const handleEditProduct = (product, categoryKey) => {
    setEditingProduct({ ...product, categoryKey });
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      features: product.features || [],
      suitableFor: product.suitableFor,
      status: product.status,
      popular: product.popular || false
    });
    setShowForm(true);
  };

  const handleDeleteProduct = (productId, categoryKey) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      const updatedCategoryProducts = products[categoryKey].filter(p => p.id !== productId);
      const updatedProducts = {
        ...products,
        [categoryKey]: updatedCategoryProducts
      };
      setProducts(updatedProducts);

      // Cập nhật dữ liệu vào các khóa đúng để đồng bộ với các trang web
      if (categoryKey === 'dang-ky-kinh-doanh') {
        localStorage.setItem('businessRegistrationServices', JSON.stringify(updatedCategoryProducts));
      } else if (categoryKey === 'ke-toan-doanh-nghiep') {
        localStorage.setItem('accountingServices', JSON.stringify(updatedCategoryProducts));
      } else if (categoryKey === 'thue-ho-kinh-doanh') {
        localStorage.setItem('taxServices', JSON.stringify(updatedCategoryProducts));
      } else if (categoryKey === 'thiet-ke-web') {
        localStorage.setItem('webDesignServices', JSON.stringify(updatedCategoryProducts));
      }

      // Cập nhật dữ liệu vào các khóa tương thích ngược
      localStorage.setItem(`${categoryKey}Services`, JSON.stringify(updatedCategoryProducts));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const categoryKey = editingProduct ? editingProduct.categoryKey : activeTab;
    const newProduct = {
      ...formData,
      id: editingProduct ? editingProduct.id : Date.now(),
      category: categories[categoryKey]
    };

    let updatedCategoryProducts;
    if (editingProduct) {
      updatedCategoryProducts = products[categoryKey].map(p =>
        p.id === editingProduct.id ? newProduct : p
      );
    } else {
      updatedCategoryProducts = [...products[categoryKey], newProduct];
    }

    const updatedProducts = {
      ...products,
      [categoryKey]: updatedCategoryProducts
    };

    setProducts(updatedProducts);

    // Cập nhật dữ liệu vào các khóa đúng để đồng bộ với các trang web
    if (categoryKey === 'dang-ky-kinh-doanh') {
      localStorage.setItem('businessRegistrationServices', JSON.stringify(updatedCategoryProducts));
    } else if (categoryKey === 'ke-toan-doanh-nghiep') {
      localStorage.setItem('accountingServices', JSON.stringify(updatedCategoryProducts));
    } else if (categoryKey === 'thue-ho-kinh-doanh') {
      localStorage.setItem('taxServices', JSON.stringify(updatedCategoryProducts));
    } else if (categoryKey === 'thiet-ke-web') {
      localStorage.setItem('webDesignServices', JSON.stringify(updatedCategoryProducts));
    }

    // Cập nhật dữ liệu vào các khóa tương thích ngược
    localStorage.setItem(`${categoryKey}Services`, JSON.stringify(updatedCategoryProducts));

    setShowForm(false);
    setEditingProduct(null);
  };

  const addFeature = () => {
    const feature = prompt('Nhập tính năng mới:');
    if (feature && !formData.features.includes(feature)) {
      setFormData({
        ...formData,
        features: [...formData.features, feature]
      });
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const currentProducts = products[activeTab] || [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Quản Lý Sản Phẩm Dịch Vụ</h1>

        {/* Tabs điều hướng */}
        <div className="mb-8 bg-white rounded-xl shadow p-4">
          <div className="flex flex-wrap gap-2">
            {Object.entries(categories).map(([key, name]) => (
              <button
                key={key}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === key
                    ? 'bg-[#D4AF37] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setActiveTab(key)}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Thống kê */}
        <div className="mb-8 bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              {categories[activeTab]} - {currentProducts.length} sản phẩm
            </h2>
            <button
              onClick={handleAddProduct}
              className="px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#b8942f] font-medium"
            >
              Thêm Sản Phẩm
            </button>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                  {product.popular && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">Phổ biến</span>
                  )}
                </div>

                <p className="text-gray-700 text-sm mb-4 line-clamp-2">{product.description}</p>

                <div className="mb-4">
                  <p className="text-[#D4AF37] font-bold text-lg">{product.price}</p>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 text-sm mb-2">
                    <span className="font-medium">Phù hợp:</span> {product.suitableFor}
                  </p>
                  <p className="text-gray-700 text-sm">
                    <span className="font-medium">Trạng thái:</span>
                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                      product.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.status === 'active' ? 'Hoạt động' : 'Ngừng'}
                    </span>
                  </p>
                </div>

                <div className="mb-6">
                  <p className="font-medium text-gray-800 text-sm mb-2">Tính năng:</p>
                  <ul className="text-sm text-gray-700 space-y-1 max-h-24 overflow-y-auto">
                    {product.features && product.features.slice(0, 4).map((feature, index) => (
                      <li key={`${product.id}-${index}`} className="flex items-start">
                        <span className="text-[#D4AF37] mr-2">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEditProduct(product, activeTab)}
                    className="flex-1 py-2 px-4 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8942f] transition-colors text-sm font-medium"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id, activeTab)}
                    className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {currentProducts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <p className="text-gray-500 text-lg">Chưa có sản phẩm nào trong danh mục này</p>
            <button
              onClick={handleAddProduct}
              className="mt-4 px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#b8942f] font-medium"
            >
              Thêm Sản Phẩm Đầu Tiên
            </button>
          </div>
        )}
      </div>

      {/* Form thêm/sửa sản phẩm */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                {editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
              </h3>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên sản phẩm</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giá</label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phù hợp cho</label>
                  <input
                    type="text"
                    value={formData.suitableFor}
                    onChange={(e) => setFormData({...formData, suitableFor: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tính năng</label>
                  <div className="flex gap-2 mb-2">
                    <button type="button" onClick={addFeature} className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#b8942f]">
                      Thêm tính năng
                    </button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {formData.features.map((feature, index) => (
                      <div key={`feature-${index}`} className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded">
                        <span>{feature}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Xóa
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Ngừng</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="popular"
                      checked={formData.popular}
                      onChange={(e) => setFormData({...formData, popular: e.target.checked})}
                      className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-300 rounded"
                    />
                    <label htmlFor="popular" className="ml-2 block text-sm text-gray-700">
                      Sản phẩm phổ biến
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#b8942f] font-medium"
                  >
                    {editingProduct ? 'Cập Nhật' : 'Thêm Mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductServiceManager;