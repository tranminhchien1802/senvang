import React from 'react';

const ServiceCard = ({ service, onEdit, onDelete, category }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
          {service.popular && (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">Phổ biến</span>
          )}
        </div>

        <p className="text-gray-900 text-sm mb-4">{service.description}</p>

        <div className="mb-4">
          <p className="text-[#D4AF37] font-bold text-lg">{service.price}</p>
        </div>

        <div className="mb-4">
          <p className="text-gray-900 text-sm mb-2"><span className="font-medium">Phù hợp:</span> {service.suitableFor}</p>
          {service.timeComplete && (
            <p className="text-gray-900 text-sm mb-2"><span className="font-medium">Thời gian hoàn thành:</span> {service.timeComplete}</p>
          )}
          <p className="text-gray-900 text-sm"><span className="font-medium">Trạng thái:</span>
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
              service.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {service.status === 'active' ? 'Hoạt động' : 'Ngừng'}
            </span>
          </p>
        </div>

        <div className="mb-4">
          <p className="font-medium text-gray-900 text-sm mb-1">Tính năng:</p>
          <ul className="text-sm text-gray-900 space-y-1">
            {service.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="text-[#D4AF37] mr-2">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex space-x-2">
          <button 
            onClick={() => onEdit(service)}
            className="flex-1 py-2 px-4 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8942f] transition-colors text-sm font-medium"
          >
            Sửa
          </button>
          <button 
            onClick={() => onDelete(service.id)}
            className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;