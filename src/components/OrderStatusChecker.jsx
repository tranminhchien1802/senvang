// File: src/components/OrderStatusChecker.jsx
import React, { useState, useEffect } from 'react';

const OrderStatusChecker = () => {
  const [transactionId, setTransactionId] = useState('');
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to check order status
  const checkOrderStatus = async () => {
    if (!transactionId.trim()) {
      setError('Vui lòng nhập mã giao dịch');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Retrieve all orders from localStorage
      const allOrders = JSON.parse(localStorage.getItem('adminOrders')) || [];
      
      // Find order by transaction ID
      const order = allOrders.find(order => 
        order.transactionId === transactionId || order._id === transactionId
      );

      if (order) {
        setOrderInfo(order);
      } else {
        setError('Không tìm thấy đơn hàng với mã giao dịch này');
        setOrderInfo(null);
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi kiểm tra trạng thái đơn hàng');
      setOrderInfo(null);
      console.error('Error checking order status:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    checkOrderStatus();
  };

  // Function to get status display text
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'pending':
        return { text: 'Chờ xử lý', color: 'text-yellow-500', bg: 'bg-yellow-500/20' };
      case 'paid':
        return { text: 'Đã thanh toán', color: 'text-green-500', bg: 'bg-green-500/20' };
      case 'cancelled':
        return { text: 'Đã hủy', color: 'text-red-500', bg: 'bg-red-500/20' };
      default:
        return { text: 'Không xác định', color: 'text-gray-500', bg: 'bg-gray-500/20' };
    }
  };

  return (
    <div className="bg-[#282828] rounded-lg p-6">
      <h3 className="text-xl font-bold text-[#FFD700] mb-4">Kiểm tra trạng thái đơn hàng</h3>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Nhập mã giao dịch (VD: TX12345678)"
            className="flex-1 px-4 py-3 bg-[#333] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#FFD700] text-[#1A1A1A] font-bold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50"
          >
            {loading ? 'Đang kiểm tra...' : 'Kiểm tra'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {orderInfo && (
        <div className="bg-[#333] rounded-lg p-4 border border-[#444]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400">Mã giao dịch:</p>
              <p className="text-white font-bold">{orderInfo.transactionId}</p>
            </div>
            <div>
              <p className="text-gray-400">Trạng thái:</p>
              <div className="flex items-center">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusDisplay(orderInfo.status).bg} ${getStatusDisplay(orderInfo.status).color}`}>
                  {getStatusDisplay(orderInfo.status).text}
                </span>
              </div>
            </div>
            <div>
              <p className="text-gray-400">Tên gói:</p>
              <p className="text-white">{orderInfo.packageName}</p>
            </div>
            <div>
              <p className="text-gray-400">Giá:</p>
              <p className="text-[#FFD700] font-bold">{orderInfo.packagePrice}</p>
            </div>
            <div>
              <p className="text-gray-400">Khách hàng:</p>
              <p className="text-white">{orderInfo.customerInfo.fullName}</p>
            </div>
            <div>
              <p className="text-gray-400">Email:</p>
              <p className="text-white">{orderInfo.customerInfo.email}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-400">Ngày tạo:</p>
              <p className="text-white">{new Date(orderInfo.orderDate).toLocaleString('vi-VN')}</p>
            </div>
          </div>
          
          {orderInfo.status === 'paid' ? (
            <div className="mt-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-300">
              🎉 Đơn hàng của bạn đã được thanh toán thành công! Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
            </div>
          ) : orderInfo.status === 'cancelled' ? (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
              ❌ Đơn hàng của bạn đã bị hủy. Nếu có thắc mắc, vui lòng liên hệ với chúng tôi.
            </div>
          ) : (
            <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500 rounded-lg text-yellow-300">
              ⏳ Đơn hàng của bạn đang chờ xử lý. Admin sẽ liên hệ với bạn trong thời gian sớm nhất.
            </div>
          )}
        </div>
      )}

      <div className="mt-6 text-sm text-gray-400">
        <p><strong>Lưu ý:</strong></p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Mã giao dịch thường có dạng TX + 8 chữ số (VD: TX12345678)</li>
          <li>Trạng thái đơn hàng được cập nhật trong thời gian thực</li>
          <li>Nếu bạn không nhận được email xác nhận, vui lòng kiểm tra thư mục spam</li>
        </ul>
      </div>
    </div>
  );
};

export default OrderStatusChecker;