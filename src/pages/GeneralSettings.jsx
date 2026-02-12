import React, { useState, useEffect } from 'react';

const GeneralSettings = () => {
  const [companyInfo, setCompanyInfo] = useState({
    companyName: 'KẾ TOÁN SEN VÀNG',
    companyNameEn: 'Golden Accounting Company',
    logo: '',
    logoPreview: '',
    phone: '093 209 7986',
    email: 'info@ketoansenvang.vn',
    address: '25/91 Nguyễn Bỉnh Khiêm, Phường Sài Gòn, Hồ Chí Minh',
    taxCode: '0317557086',
    bankAccount: '688696896 Mở tại Ngân Hàng MB bank - CN Đông Sài Gòn',
    description: 'Dịch vụ kế toán chuyên nghiệp cho doanh nghiệp',
    metaTitle: 'KẾ TOÁN SEN VÀNG - Dịch vụ kế toán chuyên nghiệp',
    metaDescription: 'Cung cấp dịch vụ kế toán, đăng ký kinh doanh, thuế và thiết kế web chuyên nghiệp cho doanh nghiệp'
  });

  // Load data from localStorage with improved sync
  useEffect(() => {
    const loadSettings = () => {
      // Try multiple storage keys to ensure we get the latest data
      let savedSettings = JSON.parse(localStorage.getItem('generalSettings')) ||
                         JSON.parse(localStorage.getItem('master_website_data_v2')?.settings || '{}') ||
                         {};
                         
      // Nếu không có logo, sử dụng logo mặc định
      if (!savedSettings.logo) {
        savedSettings.logo = '/image/logo.jpg';
        localStorage.setItem('generalSettings', JSON.stringify(savedSettings));
      }
      
      setCompanyInfo(prev => ({
        ...prev,
        ...savedSettings,
        logoPreview: savedSettings.logo || ''
      }));
    };

    loadSettings();

    // Listen for storage changes to update settings when they change in other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'generalSettings' || e.key === 'master_website_data_v2') {
        setTimeout(() => {
          let updatedSettings = JSON.parse(localStorage.getItem('generalSettings')) ||
                               JSON.parse(localStorage.getItem('master_website_data_v2')?.settings || '{}') ||
                               {};
                               
          // Nếu không có logo, sử dụng logo mặc định
          if (!updatedSettings.logo) {
            updatedSettings.logo = '/image/logo.jpg';
            localStorage.setItem('generalSettings', JSON.stringify(updatedSettings));
          }
          
          setCompanyInfo(prev => ({
            ...prev,
            ...updatedSettings,
            logoPreview: updatedSettings.logo || ''
          }));
        }, 100);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleInputChange = (field, value) => {
    setCompanyInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Validate file
        const imageStorageModule = await import('../utils/imageStorage');
        const validation = imageStorageModule.validateImageFile(file);
        if (!validation.valid) {
          alert(validation.error);
          return;
        }

        // Đọc file ảnh
        const reader = new FileReader();
        reader.onload = (event) => {
          const logoData = event.target.result;
          
          // Lưu logo sử dụng cơ chế đơn giản
          import('../utils/simpleStorageSync').then(({ saveLogo }) => {
            const result = saveLogo(logoData);
            
            if (result.success) {
              // Cập nhật state
              setCompanyInfo(prev => ({
                ...prev,
                logo: logoData,
                logoPreview: logoData
              }));
              
              alert('Cập nhật logo thành công!');
            } else {
              alert('Lỗi khi lưu logo: ' + result.message);
            }
          }).catch(err => {
            console.error('Error importing simpleStorageSync:', err);
            alert('Lỗi khi lưu logo');
          });
        };
        
        reader.onerror = () => {
          alert('Lỗi khi đọc file ảnh');
        };
        
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error handling logo change:', error);
        alert('Lỗi khi xử lý file logo: ' + error.message);
      }
    }
  };


  const handleSave = async (e) => {
    e.preventDefault();

    // Save to localStorage as fallback
    const { logoPreview, ...settingsToSave } = companyInfo;
    localStorage.setItem('generalSettings', JSON.stringify(settingsToSave));

    // Also update master data
    try {
      const masterDataStr = localStorage.getItem('master_website_data_v2');
      let masterData = masterDataStr ? JSON.parse(masterDataStr) : {};
      if (!masterData.settings) masterData.settings = {};
      masterData.settings = { ...masterData.settings, ...settingsToSave }; // Merge to preserve other data
      masterData.timestamp = Date.now();
      localStorage.setItem('master_website_data_v2', JSON.stringify(masterData));
    } catch (e) {
      console.warn('Could not update master data:', e);
    }

    // Try to save to backend
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      if (token) {
        // Import the backend config
        const { getApiUrl } = await import('../config/backendConfig');
        
        // First try to update existing setting
        let response = await fetch(getApiUrl('/settings/generalSettings'), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'x-auth-token': token
          },
          body: JSON.stringify({
            value: settingsToSave
          })
        });

        if (!response.ok) {
          // If PUT fails, try POST to create new setting
          response = await fetch(getApiUrl('/settings'), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'x-auth-token': token
            },
            body: JSON.stringify({
              key: 'generalSettings',
              value: settingsToSave
            })
          });
        }

        if (!response.ok) {
          const errorText = await response.text(); // Use text() instead of json() to avoid parsing errors
          console.error('Error saving settings to backend:', errorText);
          throw new Error(`Lỗi khi lưu cài đặt lên server: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('Settings saved to backend successfully:', result);
      } else {
        console.log('No admin token found, skipping backend save');
      }
    } catch (error) {
      console.error('Error saving settings to backend:', error);
      // Use fallback mechanism
      try {
        const { settingsOperationsFallback } = await import('../utils/apiFallback');
        const fallbackResult = settingsOperationsFallback.saveSettings('generalSettings', settingsToSave);
        
        if (fallbackResult.success) {
          // Dispatch event to notify other components
          window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: settingsToSave }));
          
          // Dispatch general sync event
          window.dispatchEvent(new CustomEvent('forceDataSync'));
          
          // Show a warning to the user that changes were saved locally but not to server
          alert('Cập nhật cài đặt thành công (lưu cục bộ). Vui lòng kiểm tra kết nối mạng và thử lại để đồng bộ lên server.');
        } else {
          console.error('Error using fallback for settings:', fallbackResult.error);
          throw fallbackResult.error;
        }
      } catch (fallbackError) {
        console.error('Error using fallback for settings:', fallbackError);
        // Final fallback - just save to localStorage
        localStorage.setItem('generalSettings', JSON.stringify(settingsToSave));
        
        // Also update master data
        try {
          const masterDataStr = localStorage.getItem('master_website_data_v2');
          let masterData = masterDataStr ? JSON.parse(masterDataStr) : {};
          if (!masterData.settings) masterData.settings = {};
          masterData.settings = { ...masterData.settings, ...settingsToSave }; // Merge to preserve other data
          masterData.timestamp = Date.now();
          localStorage.setItem('master_website_data_v2', JSON.stringify(masterData));
        } catch (e) {
          console.warn('Could not update master data:', e);
        }

        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: settingsToSave }));
        
        // Dispatch general sync event
        window.dispatchEvent(new CustomEvent('forceDataSync'));
        
        // Show a warning to the user that changes were saved locally but not to server
        alert('Cập nhật cài đặt thành công (lưu cục bộ). Vui lòng kiểm tra kết nối mạng và thử lại để đồng bộ lên server.');
      }
    }

    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: settingsToSave }));
    
    // Dispatch general sync event
    window.dispatchEvent(new CustomEvent('forceDataSync'));

    alert('Cập nhật cài đặt chung thành công!');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Cài Đặt Chung</h1>

        <form onSubmit={handleSave} className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên công ty (Tiếng Việt)</label>
              <input
                type="text"
                value={companyInfo.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên công ty (Tiếng Anh)</label>
              <input
                type="text"
                value={companyInfo.companyNameEn}
                onChange={(e) => handleInputChange('companyNameEn', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
              <input
                type="text"
                value={companyInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={companyInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
              <input
                type="text"
                value={companyInfo.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mã số thuế</label>
              <input
                type="text"
                value={companyInfo.taxCode}
                onChange={(e) => handleInputChange('taxCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Số tài khoản ngân hàng</label>
              <input
                type="text"
                value={companyInfo.bankAccount}
                onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả ngắn</label>
              <input
                type="text"
                value={companyInfo.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
              <input
                type="text"
                value={companyInfo.metaTitle}
                onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
              <input
                type="text"
                value={companyInfo.metaDescription}
                onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo Công Ty</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {companyInfo.logoPreview && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">Xem trước logo:</p>
                <img
                  src={companyInfo.logoPreview}
                  alt="Logo Preview"
                  className="w-48 h-auto border border-gray-300 rounded max-w-full" /* Increased size from w-32 to w-48 */
                />
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">Chọn ảnh logo mới (đề xuất: 400x160px)</p>
          </div>


          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-[#D4AF37] text-white font-bold rounded-lg hover:bg-[#b8942f] transition-colors"
            >
              Lưu Cài Đặt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GeneralSettings;