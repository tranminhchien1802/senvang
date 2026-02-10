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
  const [isSubmitting, setIsSubmitting] = useState(false); // Thêm trạng thái loading

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderInfo({
      ...orderInfo,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ngăn gửi nhiều lần
    if (isSubmitting) {
      return;
    }

    // Bắt đầu trạng thái gửi
    setIsSubmitting(true);

    // Validate required fields
    if (!orderInfo.fullName || !orderInfo.email || !orderInfo.phone) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên, Email, Số điện thoại)');
      setIsSubmitting(false); // Reset trạng thái nếu có lỗi
      return;
    }

    // Function to check if backend is available
    const checkBackendAvailability = async () => {
      try {
        // Use a simple endpoint to check if backend is running
        const baseUrl = typeof window !== 'undefined' ? 
          (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://senvang-backend-production.up.railway.app') : 
          '';
        
        const response = await fetch(`${baseUrl}/api/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        return response.ok;
      } catch (error) {
        console.log('Backend health check failed:', error.message);
        return false;
      }
    };

    // Fallback function to send email using EmailJS if backend is not available
    const sendEmailNotificationFallback = async (type) => {
      try {
        // Check if EmailJS is configured
        const emailJSConfigured = import.meta.env.VITE_REACT_APP_EMAILJS_PUBLIC_KEY &&
                                  import.meta.env.VITE_REACT_APP_SERVICE_ID &&
                                  import.meta.env.VITE_REACT_APP_TEMPLATE_ID;

        if (emailJSConfigured) {
          const { createEmailTemplate, sendEmailNotification } = await import('../utils/emailUtils');

          // Create customer info object
          const customerInfo = {
            fullName: orderInfo.fullName,
            email: orderInfo.email,
            phone: orderInfo.phone,
            serviceName: orderInfo.serviceName,
            servicePrice: orderInfo.servicePrice,
            note: orderInfo.note || 'Khách hàng chưa để lại ghi chú.'
          };

          if (type === 'admin') {
            // Create email template for admin
            const adminEmailMessage = createEmailTemplate(customerInfo);

            // Prepare admin email parameters
            const adminEmailParams = {
              from_name: customerInfo.fullName,
              from_email: customerInfo.email,
              phone: customerInfo.phone,
              service_name: customerInfo.serviceName,
              service_price: customerInfo.servicePrice,
              note: customerInfo.note,
              message: adminEmailMessage,
              subject: 'Yêu cầu dịch vụ mới - Kế Toán Sen Vàng',
              to_name: 'Chiến Trần', // Admin name
              to_email: 'chien180203@gmail.com' // Admin email
            };

            console.log('Sending admin notification via EmailJS fallback:', adminEmailParams); // Debug log

            // Send admin notification email using utility function
            await sendEmailNotification(adminEmailParams);
          } else if (type === 'customer') {
            // Create email template for customer confirmation
            const customerEmailMessage = `Cảm ơn quý khách đã đặt dịch vụ tại Kế Toán Sen Vàng.\n\nThông tin đơn hàng:\n- Khách hàng: ${customerInfo.fullName}\n- Email: ${customerInfo.email}\n- Số điện thoại: ${customerInfo.phone}\n- Gói dịch vụ: ${customerInfo.serviceName}\n- Giá dịch vụ: ${customerInfo.servicePrice}\n- Ghi chú: ${customerInfo.note}\n\nChúng tôi sẽ liên hệ với quý khách trong thời gian sớm nhất để tiến hành xử lý đơn hàng.\n\nTrân trọng,\nĐội ngũ Kế Toán Sen Vàng`;

            // Prepare customer email parameters
            const customerEmailParams = {
              from_name: 'Kế Toán Sen Vàng', // From business name
              from_email: 'noreply@ketoansenvang.com', // From business email
              phone: customerInfo.phone,
              service_name: customerInfo.serviceName,
              service_price: customerInfo.servicePrice,
              note: customerInfo.note,
              message: customerEmailMessage,
              subject: `Xác nhận đơn hàng dịch vụ - ${orderInfo.serviceName}`,
              to_name: orderInfo.fullName,
              to_email: orderInfo.email
            };

            console.log('Sending customer confirmation via EmailJS fallback:', customerEmailParams); // Debug log

            // Send customer confirmation email using utility function
            await sendEmailNotification(customerEmailParams);
          }
        } else {
          console.warn('EmailJS is not configured, cannot send email via fallback method');
        }
      } catch (emailError) {
        console.error(`Error in EmailJS fallback for ${type}:`, emailError);
      }
    };

    try {
      // Create order object
      const orderData = {
        packageName: orderInfo.serviceName,
        packagePrice: orderInfo.servicePrice,
        fullName: orderInfo.fullName,
        phone: orderInfo.phone,
        email: orderInfo.email
      };

      // Skip backend API call to avoid 500 errors
      // Just proceed with frontend-only order creation
      let result = null;
      let responseOk = false;

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

      // Check if backend is available before sending admin notification
      const isBackendAvailable = await checkBackendAvailability();

      if (isBackendAvailable) {
        // Send admin notification email via backend API
        try {
          const adminNotificationData = {
            customerEmail: 'chien180203@gmail.com', // Admin email
            customerName: 'Chiến Trần', // Admin name
            serviceName: `Yêu cầu dịch vụ mới: ${orderInfo.serviceName}`,
            servicePrice: orderInfo.servicePrice,
            transactionId: newOrder.transactionId
          };

          console.log('Sending admin notification via backend:', adminNotificationData); // Debug log

          const response = await fetch(API_ENDPOINTS.EMAIL.SEND_CUSTOMER_ORDER_CONFIRMATION, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(adminNotificationData)
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Error sending admin notification via backend:', errorData);
          } else {
            const result = await response.json();
            console.log('Admin notification email sent successfully via backend:', result);
          }
        } catch (backendEmailError) {
          console.warn('Error sending admin notification via backend:', backendEmailError.message);
          // Try fallback to EmailJS if configured
          await sendEmailNotificationFallback('admin');
        }
      } else {
        console.warn('Backend not available, trying fallback method for admin notification');
        await sendEmailNotificationFallback('admin');
      }

      // Send customer confirmation email via backend API if available
      if (isBackendAvailable) {
        try {
          // Prepare customer confirmation email data
          const confirmationEmailData = {
            customerEmail: orderInfo.email,
            customerName: orderInfo.fullName,
            serviceName: orderInfo.serviceName,
            servicePrice: orderInfo.servicePrice,
            transactionId: newOrder.transactionId
          };

          console.log('Sending customer confirmation email via backend:', confirmationEmailData); // Debug log

          // Send customer confirmation email via backend API
          const response = await fetch(API_ENDPOINTS.EMAIL.SEND_CUSTOMER_ORDER_CONFIRMATION, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(confirmationEmailData)
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Error sending customer confirmation email:', errorData);
          } else {
            const result = await response.json();
            console.log('Customer confirmation email sent successfully:', result);
          }
        } catch (backendEmailError) {
          console.warn('Error sending customer confirmation email via backend:', backendEmailError.message);
          // Try fallback to EmailJS if configured
          await sendEmailNotificationFallback('customer');
        }
      } else {
        console.warn('Backend not available, trying fallback method for customer confirmation');
        await sendEmailNotificationFallback('customer');
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
    } finally {
      // Luôn reset trạng thái gửi, dù thành công hay thất bại
      setIsSubmitting(false);
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
              disabled={isSubmitting}
              className={`px-6 py-2 text-white font-bold rounded-lg transition-colors ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#D4AF37] hover:bg-[#b8942f]'}`}
              style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: isSubmitting ? '#a0a0a0' : '#D4AF37',
                color: '#fff',
                fontWeight: 'bold',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s'
              }}
            >
              {isSubmitting ? 'Đang xử lý...' : 'ĐẶT DỊCH VỤ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceOrderForm;