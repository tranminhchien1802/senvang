// File: src/components/PurchaseModal.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';

const PurchaseModal = ({ isOpen, onClose, packageInfo, onPurchase }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [generatedCaptcha, setGeneratedCaptcha] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Generate a new captcha when modal opens
  useEffect(() => {
    if (isOpen) {
      generateNewCaptcha();
    }
  }, [isOpen]);

  const generateNewCaptcha = () => {
    const newCaptcha = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCaptcha(newCaptcha);
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate inputs
    if (!fullName || !phone || !email) {
      alert('Vui lòng điền đầy đủ thông tin');
      setLoading(false);
      return;
    }

    if (captcha !== generatedCaptcha) {
      alert('Mã captcha không đúng. Vui lòng thử lại');
      generateNewCaptcha();
      setCaptcha('');
      setLoading(false);
      return;
    }

    try {
      // Generate a unique transaction ID
      const transactionId = 'TX' + Date.now().toString().slice(-8);

      // Create order object
      const newOrder = {
        _id: transactionId,
        transactionId: transactionId,
        customerInfo: {
          fullName,
          email,
          phone
        },
        packageName: packageInfo.title,
        packagePrice: packageInfo.price,
        status: 'pending',
        orderDate: new Date().toISOString()
      };

      // Save order to localStorage
      const existingOrders = JSON.parse(localStorage.getItem('adminOrders')) || [];
      const updatedOrders = [...existingOrders, newOrder];
      localStorage.setItem('adminOrders', JSON.stringify(updatedOrders));

      // Set order info for payment display
      setOrderInfo(newOrder);

      // Dispatch event to notify admin dashboard of the new order
      window.dispatchEvent(new Event('storage'));

      // --- PHẦN GỬI EMAIL (ĐÃ CẬP NHẬT - CHỈ GỬI CHO ADMIN) ---
      let emailSuccess = true;
      
      // Lấy biến môi trường (Đảm bảo file .env của bạn có các biến này)
      const serviceID = import.meta.env.VITE_REACT_APP_SERVICE_ID;
      const publicKey = import.meta.env.VITE_REACT_APP_EMAILJS_PUBLIC_KEY;
      
      // SỬ DỤNG MÃ TEMPLATE THẬT CỦA BẠN TỪ ẢNH
      const templateID = "template_lfciovw"; 

      if (typeof emailjs !== 'undefined' && serviceID && publicKey) {
        try {
          // Import email utility function
          const { createEmailTemplate, sendEmailNotification } = await import('../utils/emailUtils');

          // Create customer info object
          const customerInfo = {
            fullName: fullName,
            email: email,
            phone: phone,
            serviceName: packageInfo.title || '',
            servicePrice: packageInfo.price || '',
            note: 'Đặt mua gói dịch vụ'
          };

          // Create email template
          const emailMessage = createEmailTemplate(customerInfo);

          // 1. Gửi email thông báo cho ADMIN
          const adminTemplateParams = {
            from_name: fullName || '',           // Ensure value is passed
            from_email: email || '',             // Ensure value is passed
            phone: phone || '',                 // Ensure value is passed
            package_name: packageInfo.title || '', // Ensure value is passed
            package_price: packageInfo.price || '', // Ensure value is passed
            transaction_id: transactionId || '',
            order_date: new Date().toLocaleString('vi-VN'),
            note: 'Đặt mua gói dịch vụ',
            message: emailMessage,
            subject: 'Yêu cầu dịch vụ mới - Kế Toán Sen Vàng'
          };

          await sendEmailNotification(adminTemplateParams, templateID);

          console.log('Email notification sent to admin successfully');
        } catch (emailError) {
          console.error('Error sending email to admin:', emailError);
        }
      } else {
        console.warn('EmailJS is not configured in .env. Order will still be created.');
        emailSuccess = false;
      }

      // Show payment screen and inform user about their order
      setShowPayment(true);

      // Add a brief delay to allow the UI to update before showing the success message
      setTimeout(() => {
        if (emailSuccess) {
          alert(`Đơn hàng đã được tạo thành công! Mã giao dịch: ${transactionId}\nVui lòng kiểm tra email để nhận thông tin xác nhận.\nVui lòng quét mã QR để thanh toán.`);
        } else {
          alert(`Đơn hàng đã được tạo thành công! Mã giao dịch: ${transactionId}\nAdmin sẽ liên hệ với bạn trong thời gian sớm nhất.\nVui lòng quét mã QR để thanh toán.`);
        }
      }, 100);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Có lỗi xảy ra khi tạo đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = () => {
    // Update order status to 'paid' in localStorage
    if (orderInfo) {
      const existingOrders = JSON.parse(localStorage.getItem('adminOrders')) || [];
      const updatedOrders = existingOrders.map(order =>
        order._id === orderInfo._id ? { ...order, status: 'paid' } : order
      );
      localStorage.setItem('adminOrders', JSON.stringify(updatedOrders));

      // Dispatch event to notify admin dashboard of the update
      window.dispatchEvent(new Event('orderStatusUpdated'));
    }

    alert('Đơn hàng đã được tạo thành công! Vui lòng quét mã QR để thanh toán.');
    onPurchase && onPurchase(orderInfo);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#282828] rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {!showPayment ? (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#FFD700]">Mua Gói: {packageInfo.title}</h3>
              <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>
            
            <div className="mb-4 p-4 bg-[#333] rounded">
              <p className="text-yellow-400 font-bold">Giá: {packageInfo.price}</p>
            </div>
            
            <form onSubmit={handlePurchase}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Họ và tên</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#333] text-white rounded border border-[#444] focus:outline-none focus:border-[#FFD700]"
                  placeholder="Nhập họ và tên"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#333] text-white rounded border border-[#444] focus:outline-none focus:border-[#FFD700]"
                  placeholder="Nhập số điện thoại"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#333] text-white rounded border border-[#444] focus:outline-none focus:border-[#FFD700]"
                  placeholder="Nhập email"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Mã xác nhận</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={captcha}
                    onChange={(e) => setCaptcha(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#333] text-white rounded border border-[#444] focus:outline-none focus:border-[#FFD700]"
                    placeholder="Nhập mã captcha"
                  />
                  <div 
                    className="px-4 py-2 bg-[#333] text-white border border-[#444] rounded cursor-pointer select-none"
                    onClick={generateNewCaptcha}
                  >
                    {generatedCaptcha}
                  </div>
                </div>
                <p className="text-gray-500 text-sm mt-1">Nhấp vào mã để đổi mã mới</p>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 px-4 bg-[#FFD700] text-[#1A1A1A] font-bold rounded hover:bg-yellow-500 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Đang xử lý...' : 'Xác nhận mua'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#FFD700]">Thanh toán</h3>
              <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>
            
            <div className="text-center mb-6">
              <h4 className="text-lg font-bold text-white mb-2">Mã QR thanh toán</h4>
              <div className="bg-white p-4 inline-block rounded-lg mx-auto">
                <img
                  src="/image/qr.jpg"
                  alt="QR Code"
                  className="w-48 h-48"
                />
              </div>
              <p className="text-gray-300 mt-4">Quét mã QR để thanh toán cho đơn hàng</p>
              <p className="text-yellow-400 font-bold mt-2">Mã giao dịch: {orderInfo?.transactionId}</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowPayment(false)}
                className="flex-1 py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Quay lại
              </button>
              <button
                onClick={handleConfirmPayment}
                className="flex-1 py-2 px-4 bg-[#FFD700] text-[#1A1A1A] font-bold rounded hover:bg-yellow-500 transition-colors"
              >
                Đã thanh toán
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseModal;