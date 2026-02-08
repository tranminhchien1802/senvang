// utils/productSync.js
import axios from 'axios';

const API_BASE_URL = (typeof process !== 'undefined' && process.env.REACT_APP_API_URL) ? process.env.REACT_APP_API_URL : 'http://localhost:5000/api';

/**
 * Đồng bộ sản phẩm từ backend về localStorage
 */
export const syncProductsFromBackend = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.success) {
      // Cập nhật tất cả các loại dịch vụ vào localStorage
      const products = response.data.data;
      
      // Phân loại sản phẩm theo danh mục và lưu vào localStorage
      const businessRegistrationServices = products.filter(p => p.category === 'businessRegistration');
      const accountingServices = products.filter(p => p.category === 'accounting');
      const taxServices = products.filter(p => p.category === 'tax');
      const webDesignServices = products.filter(p => p.category === 'webDesign');
      
      localStorage.setItem('businessRegistrationServices', JSON.stringify(businessRegistrationServices));
      localStorage.setItem('accountingServices', JSON.stringify(accountingServices));
      localStorage.setItem('taxServices', JSON.stringify(taxServices));
      localStorage.setItem('webDesignServices', JSON.stringify(webDesignServices));
      
      // Cập nhật featuredServices với các sản phẩm nổi bật
      const featuredServices = products.filter(p => p.popular);
      localStorage.setItem('featuredServices', JSON.stringify(featuredServices));
      
      return products;
    }
  } catch (error) {
    console.error('Error syncing products from backend:', error);
    // Fallback: giữ nguyên dữ liệu hiện tại trong localStorage
    return [
      ...(JSON.parse(localStorage.getItem('businessRegistrationServices')) || []),
      ...(JSON.parse(localStorage.getItem('accountingServices')) || []),
      ...(JSON.parse(localStorage.getItem('taxServices')) || []),
      ...(JSON.parse(localStorage.getItem('webDesignServices')) || [])
    ];
  }
};

/**
 * Đồng bộ sản phẩm từ localStorage lên backend
 */
export const syncProductsToBackend = async (token) => {
  try {
    // Lấy tất cả sản phẩm từ localStorage
    const businessRegistrationServices = JSON.parse(localStorage.getItem('businessRegistrationServices')) || [];
    const accountingServices = JSON.parse(localStorage.getItem('accountingServices')) || [];
    const taxServices = JSON.parse(localStorage.getItem('taxServices')) || [];
    const webDesignServices = JSON.parse(localStorage.getItem('webDesignServices')) || [];
    
    // Kết hợp tất cả sản phẩm
    const allLocalProducts = [
      ...businessRegistrationServices.map(p => ({...p, category: 'businessRegistration'})),
      ...accountingServices.map(p => ({...p, category: 'accounting'})),
      ...taxServices.map(p => ({...p, category: 'tax'})),
      ...webDesignServices.map(p => ({...p, category: 'webDesign'}))
    ];
    
    // Lấy sản phẩm hiện tại từ backend
    const response = await axios.get(`${API_BASE_URL}/products`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.success) {
      const backendProducts = response.data.data;
      
      // Đồng bộ từng sản phẩm
      for (const localProduct of allLocalProducts) {
        const existingProduct = backendProducts.find(p => 
          p._id === localProduct._id || p.id === localProduct.id
        );
        
        if (existingProduct) {
          // Cập nhật sản phẩm hiện tại
          await axios.put(`${API_BASE_URL}/products/${existingProduct._id || existingProduct.id}`, localProduct, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        } else {
          // Tạo mới sản phẩm
          await axios.post(`${API_BASE_URL}/products`, localProduct, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        }
      }
    }
  } catch (error) {
    console.error('Error syncing products to backend:', error);
  }
};

/**
 * Tải lên hình ảnh sản phẩm
 */
export const uploadProductImage = async (file, token) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post(`${API_BASE_URL}/products/upload`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.url;
  } catch (error) {
    console.error('Error uploading product image:', error);
    throw error;
  }
};

/**
 * Lưu sản phẩm mới lên backend
 */
export const saveProductToBackend = async (productData, token) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/products`, productData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error saving product to backend:', error);
    throw error;
  }
};

/**
 * Cập nhật sản phẩm trên backend
 */
export const updateProductInBackend = async (productId, productData, token) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/products/${productId}`, productData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error updating product in backend:', error);
    throw error;
  }
};

/**
 * Xóa sản phẩm khỏi backend
 */
export const deleteProductFromBackend = async (productId, token) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/products/${productId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting product from backend:', error);
    throw error;
  }
};

/**
 * Lấy sản phẩm theo danh mục
 */
export const getProductsByCategory = async (category, token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/category/${category}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.data || [];
  } catch (error) {
    console.error(`Error getting products by category ${category}:`, error);
    // Fallback: lấy từ localStorage
    const categoryMap = {
      'businessRegistration': 'businessRegistrationServices',
      'accounting': 'accountingServices',
      'tax': 'taxServices',
      'webDesign': 'webDesignServices'
    };
    return JSON.parse(localStorage.getItem(categoryMap[category])) || [];
  }
};