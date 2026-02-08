import React, { useState, useEffect } from 'react';

const NewsTicker = () => {
  const [newsItems] = useState([
    "Lịch nộp tờ khai thuế tháng 02/2026 đã được công bố",
    "Chiêu sinh khóa học kế toán thực hành mới nhất",
    "Cập nhật quy định mới về hóa đơn điện tử",
    "Tư vấn miễn phí về quyết toán thuế cuối năm",
    "Khuyến mãi đặc biệt cho dịch vụ thành lập doanh nghiệp"
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
    }, 5000); // Thay đổi tin mỗi 5 giây

    return () => clearInterval(interval);
  }, [newsItems.length]);

  return (
    <div className="bg-gradient-to-r from-[#D4AF37] to-yellow-600 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <span className="text-white font-bold mr-4 animate-pulse">🔔</span>
          <div className="overflow-hidden flex-1">
            <div 
              className="text-white font-medium whitespace-nowrap transition-transform duration-1000 ease-in-out"
              style={{ transform: `translateX(${currentIndex * -100}%)` }}
            >
              {newsItems.map((item, index) => (
                <span 
                  key={index} 
                  className="inline-block min-w-full px-4"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <span className="text-white text-sm ml-4">MỚI</span>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;