import React, { useState } from 'react';
import { API_ENDPOINTS } from '../config/apiConfig';

const ServiceOrderForm = ({ serviceName, servicePrice, onClose, onSubmit }) => {
  const [orderInfo, setOrderInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    serviceName: serviceName || '',
    servicePrice: servicePrice || '',
    note: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderInfo({
      ...orderInfo,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!orderInfo.fullName || !orderInfo.email || !orderInfo.phone) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên, Email, Số điện thoại)');
      return;
    }

    try {
      // Create order object
      const orderData = {
        packageName: orderInfo.serviceName,
        packagePrice: orderInfo.servicePrice,
        fullName: orderInfo.fullName,
        phone: orderInfo.phone,
        email: orderInfo.email
      };

      // Try to call backend API to create order
      let responseOk = false;
      let result = null;
      
      try {
        const response = await fetch(API_ENDPOINTS.ORDERS.CREATE, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData)
        });

        if (response.ok) {
          result = await response.json();
          responseOk = true;
        }
      } catch (fetchError) {
        console.error('Failed to connect to backend:', fetchError);
        // Continue with frontend-only order creation
      }

      // Save order to localStorage for admin panel (fallback mechanism)
      const existingOrders = JSON.parse(localStorage.getItem('adminOrders')) || [];
      const newOrder = {
        _id: result && result.order ? result.order.id : `order_${Date.now()}`,
        transactionId: result && result.order ? result.order.transactionId : `TXN${Date.now()}`,
        customerInfo: {
          fullName: orderInfo.fullName,
          email: orderInfo.email,
          phone: orderInfo.phone
        },
        serviceName: orderInfo.serviceName,
        servicePrice: orderInfo.servicePrice,
        note: orderInfo.note,
        status: 'pending',
        orderDate: new Date().toISOString()
      };
      const updatedOrders = [...existingOrders, newOrder];
      localStorage.setItem('adminOrders', JSON.stringify(updatedOrders));

      // Send order confirmation email using EmailJS
      try {
        // Check if EmailJS is configured
        const emailJSConfigured = import.meta.env.VITE_REACT_APP_EMAILJS_PUBLIC_KEY &&
                                import.meta.env.VITE_REACT_APP_SERVICE_ID &&
                                import.meta.env.VITE_REACT_APP_TEMPLATE_ID;

        if (emailJSConfigured) {
          // Create a simplified message to avoid duplication
          const messageContent = `Xin chào,\n\nCó một yêu cầu mới được gửi từ form liên hệ trên website của bạn:\n\n───────────────────────────────\n\n📌 **Thông tin khách hàng:**\n- Họ và tên: ${orderInfo.fullName}\n- Email: ${orderInfo.email}\n- Số điện thoại: ${orderInfo.phone}\n- Gói dịch vụ quan tâm: ${orderInfo.serviceName}\n- Giá dịch vụ: ${orderInfo.servicePrice}\n- Nội dung yêu cầu: \n  ${orderInfo.note || 'Khách hàng chưa để lại ghi chú.'}\n\n───────────────────────────────\n\nVui lòng kiểm tra và phản hồi sớm nhất để không bỏ lỡ cơ hội hợp tác!`;

          const emailParams = {
            to_name: 'Quản trị viên', // Send to admin
            message: messageContent,
            subject: 'Yêu cầu dịch vụ mới - Kế Toán Sen Vàng'
          };

          // Dynamically import emailjs to avoid bundling when not needed
          const emailjs = await import('@emailjs/browser');
          
          await emailjs.send(
            import.meta.env.VITE_REACT_APP_SERVICE_ID,
            import.meta.env.VITE_REACT_APP_TEMPLATE_ID,
            emailParams,
            import.meta.env.VITE_REACT_APP_EMAILJS_PUBLIC_KEY
          );
        }
      } catch (emailError) {
        console.error('Error sending order confirmation email:', emailError);
        // Don't fail the order submission if email fails
      }

      // Call parent submit handler
      if (onSubmit) {
        onSubmit(newOrder);
      }

      alert('Đặt dịch vụ thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
      onClose();
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Đã xảy ra lỗi khi xử lý đơn hàng. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md" style={{
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        maxWidth: '28rem'
      }}>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2" style={{
            fontSize: '1.5rem',
            color: '#333',
            marginBottom: '0.5rem',
            textAlign: 'center'
          }}>
            ĐẶT DỊCH VỤ
          </h2>
          <div className="text-lg font-semibold text-[#D4AF37] mb-1" style={{
            fontSize: '1.1rem',
            color: '#D4AF37',
            fontWeight: '600'
          }}>
            {serviceName?.toUpperCase()}
          </div>
          <div className="text-md font-bold text-red-600" style={{
            fontSize: '1rem',
            color: '#dc2626',
            fontWeight: '700'
          }}>
            {servicePrice}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium" style={{ color: '#4a5568', marginBottom: '0.5rem', fontWeight: '500' }}>
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={orderInfo.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                backgroundColor: '#f8fafc',
                color: '#1a202c',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
                outline: 'none'
              }}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium" style={{ color: '#4a5568', marginBottom: '0.5rem', fontWeight: '500' }}>
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={orderInfo.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                backgroundColor: '#f8fafc',
                color: '#1a202c',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
                outline: 'none'
              }}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium" style={{ color: '#4a5568', marginBottom: '0.5rem', fontWeight: '500' }}>
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={orderInfo.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                backgroundColor: '#f8fafc',
                color: '#1a202c',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
                outline: 'none'
              }}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium" style={{ color: '#4a5568', marginBottom: '0.5rem', fontWeight: '500' }}>
              Ghi chú
            </label>
            <textarea
              name="note"
              value={orderInfo.note}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2 bg-gray-50 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                backgroundColor: '#f8fafc',
                color: '#1a202c',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0',
                outline: 'none'
              }}
              placeholder="Ghi chú thêm về yêu cầu của bạn..."
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium" style={{ color: '#4a5568', marginBottom: '0.5rem', fontWeight: '500' }}>
              Dịch vụ
            </label>
            <input
              type="text"
              value={orderInfo.serviceName}
              readOnly
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300"
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                backgroundColor: '#edf2f7',
                color: '#4a5568',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0'
              }}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium" style={{ color: '#4a5568', marginBottom: '0.5rem', fontWeight: '500' }}>
              Giá tiền
            </label>
            <input
              type="text"
              value={orderInfo.servicePrice}
              readOnly
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300"
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                backgroundColor: '#edf2f7',
                color: '#4a5568',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0'
              }}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: '#e2e8f0',
                color: '#2d3748',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#D4AF37] text-white font-bold rounded-lg hover:bg-[#b8942f] transition-colors"
              style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: '#D4AF37',
                color: '#fff',
                fontWeight: 'bold',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
            >
              ĐẶT DỊCH VỤ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceOrderForm;