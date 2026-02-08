// File: src/components/FloatingContact.jsx
// Floating Contact Widget cho website Kế Toán Sen Vàng
// Chỉ giữ lại 2 nút: Zalo và Gọi điện (Hotline) - vị trí cố định ở góc dưới phải
// Cả 2 nút đều là nút tròn đơn giản, không có chữ

import React from 'react';

const FloatingContact = () => {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-3 z-50">
      {/* Nút Zalo */}
     

      {/* Nút Gọi điện (Hotline) */}
      <a
        href="tel:0932097986"
        className="bg-red-500 hover:bg-red-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 animate-pulse opacity-90 hover:opacity-100 relative"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px" fill="currentColor" className="text-white">
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
        </svg>
        <span className="absolute h-full w-full rounded-full bg-red-500 opacity-70 animate-ping"></span>
      </a>
    </div>
  );
};

export default FloatingContact;