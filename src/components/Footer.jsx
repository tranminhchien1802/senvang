// File: src/components/Footer.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({
    companyName: 'CÔNG TY CỔ PHẦN GIẢI PHÁN DOANH NGHIỆP SEN VÀNG',
    phone: '0932097986',
    email: 'info@ketoansenvang.vn',
    address: '25/91 Nguyễn Bỉnh Khiêm, Phường Sài Gòn, Hồ Chí Minh',
    taxCode: '0317557086',
    bankAccount: '688696896 Mở tại Ngân Hàng MB bank - CN Đông Sài Gòn'
  });
  const navigate = useNavigate();

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    setIsMobile(mobileRegex.test(userAgent));
  }, []);

  // Load company info from localStorage
  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('generalSettings')) || {};
    setCompanyInfo({
      companyName: savedSettings.companyName || 'CÔNG TY CỔ PHẦN GIẢI PHÁP DOANH NGHIỆP SEN VÀNG',
      phone: savedSettings.phone || '0932097986',
      email: savedSettings.email || 'info@ketoansenvang.vn',
      address: savedSettings.address || '25/91 Nguyễn Bỉnh Khiêm, Phường Sài Gòn, Hồ Chí Minh',
      taxCode: savedSettings.taxCode || '0317557086',
      bankAccount: savedSettings.bankAccount || '688696896 Mở tại Ngân Hàng MB bank - CN Đông Sài Gòn'
    });
  }, []);

  const handleCallButtonClick = () => {
    // More accurate device detection based on screen size
    const isMobileDevice = window.innerWidth <= 768 || /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobileDevice) {
      // For mobile, initiate a phone call
      window.location.href = `tel:${companyInfo.phone}`;
    } else {
      // For desktop, navigate to contact form
      // First try React Router navigation
      try {
        navigate("/ContactForm");
      } catch (error) {
        // Fallback: direct navigation if React Router fails
        window.location.href = "/ContactForm";
      }
    }
  };

  return (
    <footer className="bg-white text-gray-700 pt-12 pb-8 border-t border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Cột 1: Về chúng tôi */}
          <div>
            <h3 className="text-lg font-bold text-[#D4AF37] uppercase mb-4 tracking-wider">VỀ CHÚNG TÔI</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="font-bold text-gray-800 mb-2">{companyInfo.companyName}</li>
              <li><i className="fa-solid fa-location-dot mr-2 text-[#D4AF37]"></i> {companyInfo.address}</li>
              <li><i className="fa-solid fa-phone mr-2 text-[#D4AF37]"></i> {companyInfo.phone}</li>
              <li><i className="fa-solid fa-envelope mr-2 text-[#D4AF37]"></i> {companyInfo.email}</li>
              <li><i className="fa-solid fa-certificate mr-2 text-[#D4AF37]"></i> Mã số thuế: {companyInfo.taxCode}</li>
              <li><i className="fa-solid fa-building-columns mr-2 text-[#D4AF37]"></i> {companyInfo.bankAccount}</li>
            </ul>
          </div>

          {/* Cột 2: Thông tin & Hỗ trợ */}
          <div>
            <h3 className="text-lg font-bold text-[#D4AF37] uppercase mb-4 tracking-wider">DỊCH VỤ</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="/" className="hover:text-[#D4AF37] transition duration-300 flex items-center"><span className="mr-2">›</span> Trang Chủ</a></li>
              <li><a href="/dang-ky-kinh-doanh" className="hover:text-[#D4AF37] transition duration-300 flex items-center"><span className="mr-2">›</span> Đăng Ký Kinh Doanh</a></li>
              <li><a href="/ke-toan-doanh-nghiep" className="hover:text-[#D4AF37] transition duration-300 flex items-center"><span className="mr-2">›</span> Kế Toán Doanh Nghiệp</a></li>
              <li><a href="/thue-ho-kinh-doanh" className="hover:text-[#D4AF37] transition duration-300 flex items-center"><span className="mr-2">›</span> Thuế Hộ Kinh Doanh</a></li>
              <li><a href="/thiet-ke-web" className="hover:text-[#D4AF37] transition duration-300 flex items-center"><span className="mr-2">›</span> Thiết Kế Web</a></li>
              <li><a href="/ContactForm" className="hover:text-[#D4AF37] transition duration-300 flex items-center"><span className="mr-2">›</span> Liên Hệ</a></li>
            </ul>
          </div>

          {/* Cột 3: Kết nối mạng xã hội */}
          <div>
            <h3 className="text-lg font-bold text-[#D4AF37] uppercase mb-4 tracking-wider">MẠNG XÃ HỘI</h3>
            <p className="text-sm text-gray-600 mb-4">Theo dõi chúng tôi để cập nhật các thông tư thuế mới nhất.</p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all duration-300">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center hover:bg-[#000] hover:text-white hover:border hover:border-gray-600 transition-all duration-300">
                <i className="fa-brands fa-tiktok"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center hover:bg-[#FF0000] hover:text-white transition-all duration-300">
                <i className="fa-brands fa-youtube"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center hover:bg-[#0A66C2] hover:text-white transition-all duration-300">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
            <p className="mb-2 md:mb-0">&copy; {new Date().getFullYear()} {companyInfo.companyName}. Tất cả quyền được bảo lưu.</p>
            <p>Thiết kế và vận hành bởi Đội ngũ Kỹ thuật Sen Vàng.</p>
          </div>
        </div>
      </div>

      {/* --- PHẦN NÚT NỔI (FLOATING BUTTONS) --- */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50 items-center">
        
        {/* Style cho hiệu ứng rung lắc */}
        <style>{`
          @keyframes quick-shake {
            0%, 100% { transform: rotate(0deg) scale(1); }
            10%, 30%, 50%, 70% { transform: rotate(-10deg) scale(1.1); }
            20%, 40%, 60% { transform: rotate(10deg) scale(1.1); }
            80% { transform: rotate(0deg) scale(1); }
          }
        `}</style>

        {/* 1. Nút Zalo (Đã sửa để tránh lỗi COEP) */}
        <a
          href={`https://zalo.me/+84${companyInfo.phone.replace(/\D/g, '').substring(1)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-14 h-14 rounded-full shadow-lg transition-all overflow-hidden bg-[#04C500] border-2 border-transparent hover:bg-[#03a803] flex items-center justify-center"
          style={{
            animation: 'quick-shake 3s infinite', // Rung mỗi 3 giây
            animationDelay: '0s' // Rung ngay
          }}
        >
          {/* Logo Zalo sử dụng Font Awesome thay thế để tránh lỗi COEP */}
          <i className="fab fa-zalo text-white text-2xl"></i>
        </a>

        {/* 2. Nút Gọi điện (Rung lắc lệch nhịp với Zalo) */}
        <button
          onClick={handleCallButtonClick}
          className="flex w-14 h-14 rounded-full bg-red-600 items-center justify-center text-white shadow-lg hover:bg-red-700 transition-all border-2 border-white"
          style={{
            animation: 'quick-shake 3s infinite', // Rung mỗi 3 giây
            animationDelay: '1.5s' // Rung sau Zalo 1.5s để so le
          }}
        >
          <i className="fa-solid fa-phone text-2xl"></i>
        </button>
      </div>
    </footer>
  );
};

export default Footer;