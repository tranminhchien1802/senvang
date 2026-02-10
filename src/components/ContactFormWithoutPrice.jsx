import React, { useState } from 'react';
import { API_ENDPOINTS } from '../config/apiConfig';

const ContactFormWithoutPrice = ({ onClose }) => {
  const [contactInfo, setContactInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    serviceName: '',
    note: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactInfo({
      ...contactInfo,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!contactInfo.fullName || !contactInfo.email || !contactInfo.phone || !contactInfo.serviceName) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên, Email, Số điện thoại, Dịch vụ quan tâm)');
      return;
    }

    try {
      // Try to call backend API to create order
      let responseOk = false;
      let result = null;
      
      try {
        const response = await fetch(API_ENDPOINTS.ORDERS.CREATE, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            packageName: contactInfo.serviceName,
            packagePrice: 'Liên hệ để biết giá', // Hidden price
            fullName: contactInfo.fullName,
            phone: contactInfo.phone,
            email: contactInfo.email,
            note: contactInfo.note
          })
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
          fullName: contactInfo.fullName,
          email: contactInfo.email,
          phone: contactInfo.phone
        },
        serviceName: contactInfo.serviceName,
        servicePrice: 'Liên hệ để biết giá', // Hidden price
        note: contactInfo.note,
        status: 'pending',
        orderDate: new Date().toISOString()
      };
      const updatedOrders = [...existingOrders, newOrder];
      localStorage.setItem('adminOrders', JSON.stringify(updatedOrders));

      // Send contact request email using EmailJS
      try {
        // Check if EmailJS is configured
        const emailJSConfigured = import.meta.env.VITE_REACT_APP_EMAILJS_PUBLIC_KEY &&
                                import.meta.env.VITE_REACT_APP_SERVICE_ID &&
                                import.meta.env.VITE_REACT_APP_TEMPLATE_ID;

        if (emailJSConfigured) {
          const emailParams = {
            to_name: 'Quản trị viên',
            to_email: 'admin@ketoansenvang.com',
            service_name: contactInfo.serviceName,
            service_price: 'Liên hệ để biết giá', // Hidden price
            customer_name: contactInfo.fullName,
            customer_phone: contactInfo.phone,
            customer_email: contactInfo.email,
            order_note: contactInfo.note,
            order_date: new Date().toLocaleString('vi-VN'),
            message: `Xin chào,\n\nCó một yêu cầu mới được gửi từ form liên hệ trên website của bạn:\n\n───────────────────────────────\n\n📌 **Thông tin khách hàng:**\n- Họ và tên: ${contactInfo.fullName}\n- Email: ${contactInfo.email}\n- Số điện thoại: ${contactInfo.phone}\n- Gói dịch vụ quan tâm: ${contactInfo.serviceName}\n- Nội dung yêu cầu: \n  ${contactInfo.note || 'Khách hàng chưa để lại ghi chú.'}\n\n───────────────────────────────\n\nVui lòng kiểm tra và phản hồi sớm nhất để không bỏ lỡ cơ hội hợp tác!'`,
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
        console.error('Error sending contact request email:', emailError);
        // Don't fail the submission if email fails
      }

      alert('Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất để tư vấn chi tiết.');
      onClose();
    } catch (error) {
      console.error('Error submitting contact request:', error);
      alert('Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại sau.');
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
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6" style={{
          fontSize: '1.5rem',
          color: '#333',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          LIÊN HỆ TƯ VẤN DỊCH VỤ
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium" style={{ color: '#4a5568', marginBottom: '0.5rem', fontWeight: '500' }}>
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={contactInfo.fullName}
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
              value={contactInfo.email}
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
              value={contactInfo.phone}
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
              Dịch vụ quan tâm <span className="text-red-500">*</span>
            </label>
            <select
              name="serviceName"
              value={contactInfo.serviceName}
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
            >
              <option value="">Chọn dịch vụ</option>
              <option value="Đăng ký kinh doanh">Đăng ký kinh doanh</option>
              <option value="Kế toán doanh nghiệp">Kế toán doanh nghiệp</option>
              <option value="Khai báo thuế">Khai báo thuế</option>
              <option value="Thiết kế website">Thiết kế website</option>
              <option value="Tư vấn pháp lý">Tư vấn pháp lý</option>
              <option value="Dịch vụ khác">Dịch vụ khác</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium" style={{ color: '#4a5568', marginBottom: '0.5rem', fontWeight: '500' }}>
              Ghi chú thêm
            </label>
            <textarea
              name="note"
              value={contactInfo.note}
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
              placeholder="Mô tả thêm về nhu cầu của bạn..."
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
              GỬI YÊU CẦU
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactFormWithoutPrice;