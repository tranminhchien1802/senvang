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

  // Load data from localStorage
  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('generalSettings')) || {};
    setCompanyInfo(prev => ({
      ...prev,
      ...savedSettings,
      logoPreview: savedSettings.logo || ''
    }));
  }, []);

  const handleInputChange = (field, value) => {
    setCompanyInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyInfo(prev => ({
          ...prev,
          logo: reader.result,
          logoPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSave = (e) => {
    e.preventDefault();

    // Save to localStorage
    const { logoPreview, ...settingsToSave } = companyInfo;
    localStorage.setItem('generalSettings', JSON.stringify(settingsToSave));

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