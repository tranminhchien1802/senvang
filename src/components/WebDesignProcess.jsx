import React from 'react';

const WebDesignProcess = () => {
  const steps = [
    {
      number: "01",
      title: "TRAO ĐỔI THÔNG TIN YÊU CẦU KHÁCH HÀNG",
      description: "Tiếp nhận yêu cầu, phân tích nhu cầu và mong muốn của khách hàng về website."
    },
    {
      number: "02", 
      title: "THIẾT KẾ BẢN DEMO",
      description: "Thiết kế giao diện demo, bố cục và trải nghiệm người dùng ban đầu."
    },
    {
      number: "03",
      title: "CHO KHÁCH XEM DEMO",
      description: "Trình bày bản demo cho khách hàng và nhận phản hồi để điều chỉnh."
    },
    {
      number: "04",
      title: "TEST CÁC CHỨC NĂNG",
      description: "Kiểm thử các chức năng, đảm bảo website hoạt động ổn định, tương thích đa nền tảng."
    },
    {
      number: "05",
      title: "BÀN GIAO",
      description: "Hoàn thiện website, bàn giao cho khách hàng và hướng dẫn sử dụng."
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">QUY TRÌNH THIẾT KẾ WEBSITE</h2>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              {/* Step Number */}
              <div className="w-16 h-16 rounded-full bg-[#D4AF37] flex items-center justify-center text-white text-xl font-bold mb-4 shadow-lg">
                {step.number}
              </div>
              
              {/* Step Title */}
              <h3 className="text-lg font-bold text-gray-800 mb-2 leading-tight">
                {step.title}
              </h3>
              
              {/* Step Description */}
              <p className="text-gray-600 text-sm">
                {step.description}
              </p>
              
              {/* Connecting Line - except for the last step */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/5 w-1/5 h-1 bg-gray-300 transform translate-x-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebDesignProcess;