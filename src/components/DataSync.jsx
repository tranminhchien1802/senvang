// components/DataSync.jsx
import { useEffect } from 'react';

const DataSync = () => {
  useEffect(() => {
    // Hàm đồng bộ dữ liệu khi component mount
    const syncData = () => {
      try {
        // Lấy dữ liệu từ các nguồn khác nhau và đồng bộ
        const businessRegistrationServices = JSON.parse(localStorage.getItem('businessRegistrationServices')) || [];
        const accountingServices = JSON.parse(localStorage.getItem('accountingServices')) || [];
        const taxServices = JSON.parse(localStorage.getItem('taxServices')) || [];
        const webDesignServices = JSON.parse(localStorage.getItem('webDesignServices')) || [];
        
        // Cập nhật dữ liệu vào các khóa tương thích ngược
        localStorage.setItem('dang-ky-kinh-doanhServices', JSON.stringify(businessRegistrationServices));
        localStorage.setItem('ke-toan-doanh-nghiepServices', JSON.stringify(accountingServices));
        localStorage.setItem('thue-ho-kinh-doanhServices', JSON.stringify(taxServices));
        localStorage.setItem('thiet-ke-webServices', JSON.stringify(webDesignServices));
        
        // Cập nhật featuredServices
        const featuredServices = [
          ...businessRegistrationServices.filter(service => service.popular),
          ...accountingServices.filter(service => service.isPopular),
          ...taxServices.filter(service => service.popular),
          ...webDesignServices.filter(service => service.isPopular)
        ];
        localStorage.setItem('featuredServices', JSON.stringify(featuredServices));
        
        console.log('Dữ liệu đã được đồng bộ hóa thành công!');
      } catch (error) {
        console.error('Lỗi khi đồng bộ dữ liệu:', error);
      }
    };

    // Thực hiện đồng bộ dữ liệu
    syncData();

    // Thiết lập interval để đồng bộ định kỳ (mỗi 30 phút)
    const syncInterval = setInterval(syncData, 30 * 60 * 1000);

    // Cleanup interval khi component unmount
    return () => clearInterval(syncInterval);
  }, []);

  return null; // Component này không render gì cả
};

export default DataSync;