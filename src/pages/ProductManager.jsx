// pages/ProductManager.jsx
import React, { useState, useEffect } from 'react';
import { saveProductToBackend, updateProductInBackend, deleteProductFromBackend, getProductsByCategory, syncProductsFromBackend, syncProductsToBackend } from '../utils/productSync';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    name: '',
    title: '',
    description: '',
    price: '',
    features: [],
    suitableFor: '',
    timeComplete: '',
    popular: false,
    status: 'active',
    category: 'businessRegistration'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [featureInput, setFeatureInput] = useState('');
  const [error, setError] = useState('');

  const categories = [
    { value: 'all', label: 'Tất cả danh mục' },
    { value: 'businessRegistration', label: 'Đăng Ký Kinh Doanh' },
    { value: 'accounting', label: 'Kế Toán Doanh Nghiệp' },
    { value: 'tax', label: 'Thuế Hộ Kinh Doanh' },
    { value: 'webDesign', label: 'Thiết Kế Web' }
  ];

  // Load products from localStorage
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        
        // Lấy token admin
        const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
        if (token) {
          // Cố gắng đồng bộ từ backend
          await syncProductsFromBackend(token);
        }
        
        // Lấy dữ liệu từ localStorage
        const businessRegistrationServices = JSON.parse(localStorage.getItem('businessRegistrationServices')) || [];
        const accountingServices = JSON.parse(localStorage.getItem('accountingServices')) || [];
        const taxServices = JSON.parse(localStorage.getItem('taxServices')) || [];
        const webDesignServices = JSON.parse(localStorage.getItem('webDesignServices')) || [];
        
        const allProducts = [
          ...businessRegistrationServices.map(p => ({...p, category: 'businessRegistration'})),
          ...accountingServices.map(p => ({...p, category: 'accounting'})),
          ...taxServices.map(p => ({...p, category: 'tax'})),
          ...webDesignServices.map(p => ({...p, category: 'webDesign'}))
        ];
        
        setProducts(allProducts);
        setFilteredProducts(allProducts);
      } catch (err) {
        setError('Lỗi khi tải dữ liệu sản phẩm');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Filter products when category changes
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === selectedCategory));
    }
  }, [selectedCategory, products]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddFeature = () => {
    if (featureInput.trim() !== '') {
      setCurrentProduct(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index) => {
    setCurrentProduct(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentProduct.name && !currentProduct.title) {
      alert('Vui lòng nhập tên sản phẩm!');
      return;
    }

    if (!currentProduct.description || !currentProduct.price) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc!');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      if (!token) {
        alert('Vui lòng đăng nhập để quản lý sản phẩm');
        return;
      }

      const productData = {
        ...currentProduct,
        name: currentProduct.name || currentProduct.title, // Đảm bảo có trường name
        title: currentProduct.title || currentProduct.name // Đảm bảo có trường title
      };

      if (isEditing) {
        // Update existing product
        const response = await updateProductInBackend(currentProduct.id, productData, token);
        if (response.success) {
          const updatedProducts = products.map(p =>
            p.id === currentProduct.id ? { ...productData, id: currentProduct.id } : p
          );
          setProducts(updatedProducts);
          
          // Cập nhật lại localStorage theo danh mục
          updateLocalStorageByCategory(updatedProducts);
          
          alert('Cập nhật sản phẩm thành công!');
        }
      } else {
        // Create new product
        const response = await saveProductToBackend(productData, token);
        if (response.success) {
          const newProduct = { ...productData, id: response.data._id || Date.now() };
          const updatedProducts = [...products, newProduct];
          setProducts(updatedProducts);
          
          // Cập nhật lại localStorage theo danh mục
          updateLocalStorageByCategory(updatedProducts);
          
          alert('Tạo sản phẩm thành công!');
        }
      }

      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Lỗi khi lưu sản phẩm. Vui lòng thử lại.');
    }
  };

  const updateLocalStorageByCategory = (allProducts) => {
    const businessRegistrationServices = allProducts.filter(p => p.category === 'businessRegistration');
    const accountingServices = allProducts.filter(p => p.category === 'accounting');
    const taxServices = allProducts.filter(p => p.category === 'tax');
    const webDesignServices = allProducts.filter(p => p.category === 'webDesign');
    
    localStorage.setItem('businessRegistrationServices', JSON.stringify(businessRegistrationServices));
    localStorage.setItem('accountingServices', JSON.stringify(accountingServices));
    localStorage.setItem('taxServices', JSON.stringify(taxServices));
    localStorage.setItem('webDesignServices', JSON.stringify(webDesignServices));
    
    // Cập nhật featuredServices
    const featuredServices = allProducts.filter(p => p.popular);
    localStorage.setItem('featuredServices', JSON.stringify(featuredServices));
  };

  const resetForm = () => {
    setCurrentProduct({
      id: null,
      name: '',
      title: '',
      description: '',
      price: '',
      features: [],
      suitableFor: '',
      timeComplete: '',
      popular: false,
      status: 'active',
      category: 'businessRegistration'
    });
    setIsEditing(false);
  };

  const handleEdit = (product) => {
    setCurrentProduct({
      ...product,
      name: product.name || product.title,
      title: product.title || product.name
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
        if (!token) {
          alert('Vui lòng đăng nhập để quản lý sản phẩm');
          return;
        }

        // Xóa từ backend
        await deleteProductFromBackend(id, token);
        
        // Xóa từ state và localStorage
        const updatedProducts = products.filter(p => p.id !== id);
        setProducts(updatedProducts);
        
        // Cập nhật lại localStorage theo danh mục
        updateLocalStorageByCategory(updatedProducts);
        
        alert('Xóa sản phẩm thành công!');
        
        if (isEditing && currentProduct.id === id) {
          resetForm();
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Lỗi khi xóa sản phẩm. Vui lòng thử lại.');
      }
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  const getCategoryLabel = (category) => {
    const categoryObj = categories.find(cat => cat.value === category);
    return categoryObj ? categoryObj.label : category;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản Lý Tất Cả Sản Phẩm/Dịch Vụ</h1>

        {loading && (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
            <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {!loading && (
          <>
            {/* Product Form */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {isEditing ? 'Chỉnh sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên sản phẩm *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={currentProduct.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      placeholder="Nhập tên sản phẩm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Danh mục *
                    </label>
                    <select
                      name="category"
                      value={currentProduct.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    >
                      {categories.filter(cat => cat.value !== 'all').map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá *
                    </label>
                    <input
                      type="text"
                      name="price"
                      value={currentProduct.price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      placeholder="Nhập giá (ví dụ: 1.500.000đ)"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phù hợp cho
                    </label>
                    <input
                      type="text"
                      name="suitableFor"
                      value={currentProduct.suitableFor}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      placeholder="Ví dụ: Doanh nghiệp mới thành lập"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thời gian hoàn thành
                    </label>
                    <input
                      type="text"
                      name="timeComplete"
                      value={currentProduct.timeComplete}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      placeholder="Ví dụ: 3-5 ngày"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <select
                      name="status"
                      value={currentProduct.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Ngừng</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả *
                  </label>
                  <textarea
                    name="description"
                    value={currentProduct.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="Nhập mô tả sản phẩm"
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tính năng
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
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
                    {currentProduct.features.map((feature, index) => (
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
                    checked={currentProduct.popular}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">Là sản phẩm phổ biến</label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8942f] transition-colors"
                  >
                    {isEditing ? 'Cập nhật Sản Phẩm' : 'Lưu Sản Phẩm'}
                  </button>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Hủy
                    </button>
                  )}
                </div>
              </form>
            </div>
          </>
        )}

        {/* Products List */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 space-y-4 md:space-y-0">
            <h2 className="text-xl font-bold text-gray-800">Danh Sách Sản Phẩm</h2>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              
              <p className="text-sm text-gray-600 self-center">{filteredProducts.length} sản phẩm(s)</p>
            </div>
          </div>

          {!loading && filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Không có sản phẩm nào trong danh mục này
            </div>
          ) : !loading && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phù hợp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phổ biến</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name || product.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{product.description.substring(0, 50)}...</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{getCategoryLabel(product.category)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-[#D4AF37]">{product.price}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{product.suitableFor}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.popular ? (
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
                          product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.status === 'active' ? 'Hoạt động' : 'Ngừng'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
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
          )}
          {loading && (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
              <span className="ml-3 text-gray-600">Đang tải danh sách sản phẩm...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManager;