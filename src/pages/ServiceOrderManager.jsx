import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/apiConfig';

const ServiceOrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load orders from localStorage
  useEffect(() => {
    const loadOrders = async () => {
      try {
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const storedOrders = JSON.parse(localStorage.getItem('adminOrders')) || [];
        setOrders(storedOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    const updatedOrders = orders.map(order =>
      order._id === orderId ? { ...order, status: newStatus } : order
    );

    setOrders(updatedOrders);
    localStorage.setItem('adminOrders', JSON.stringify(updatedOrders));

    // If status is changed to 'completed', send confirmation email to customer
    if (newStatus === 'completed') {
      const order = updatedOrders.find(o => o._id === orderId);
      if (order && order.customerInfo && order.customerInfo.email) {
        try {
          // Get admin token from localStorage (check all possible storage locations)
          const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('token') || sessionStorage.getItem('adminToken') || sessionStorage.getItem('token');

          if (!adminToken) {
            console.error('No admin token found');
            alert('Bạn chưa đăng nhập với tư cách admin!');
            return;
          }

          console.log("=== DEBUG TOKEN ===");
          console.log("1. Token lấy từ localStorage:", adminToken);
          console.log("2. Token length:", adminToken ? adminToken.length : 0);
          console.log("3. Token starts with:", adminToken ? adminToken.substring(0, 10) : 'NO TOKEN');

          // Check if it's a fake token (common pattern for fake tokens)
          if (adminToken.startsWith('local-admin-token-')) {
            console.error('❌ Detected fake token. Please log out and log in again with real credentials.');
            alert('Lỗi xác thực: Phát hiện token giả. Vui lòng đăng xuất và đăng nhập lại bằng tài khoản thật.');
            return;
          }

          // Call backend API to send confirmation email
          const response = await fetch('http://localhost:5000/api/admin/send-order-confirmation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': adminToken
            },
            body: JSON.stringify({
              customerEmail: order.customerInfo.email,
              customerName: order.customerInfo.fullName,
              serviceName: order.serviceName,
              servicePrice: order.servicePrice,
              transactionId: order.transactionId
            })
          });

          if (response.ok) {
            const result = await response.json();
            console.log('Confirmation email sent:', result);
            alert(`Email xác nhận đã được gửi đến khách hàng: ${order.customerInfo.email}`);
          } else {
            const errorData = await response.json();
            console.error('Failed to send confirmation email:', errorData);
            alert(`Gửi email xác nhận thất bại: ${errorData.msg || 'Lỗi không xác định'}`);

            // Log more details for debugging
            console.log("=== RESPONSE DETAILS ===");
            console.log("Status:", response.status);
            console.log("Status Text:", response.statusText);
            console.log("Response Body:", errorData);
          }
        } catch (error) {
          console.error('Error sending confirmation email:', error);
          alert('Lỗi kết nối khi gửi email xác nhận');

          // Log more details for debugging
          console.log("=== ERROR DETAILS ===");
          console.log("Error Message:", error.message);
          console.log("Error Stack:", error.stack);
        }
      }
    }
  };

  const deleteOrder = (orderId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      const updatedOrders = orders.filter(order => order._id !== orderId);
      setOrders(updatedOrders);
      localStorage.setItem('adminOrders', JSON.stringify(updatedOrders));
    }
  };

  const sendConfirmationEmail = async (order) => {
    if (!order.customerInfo || !order.customerInfo.email) {
      alert('Không có địa chỉ email để gửi xác nhận');
      return;
    }

    try {
      // Get admin token from localStorage (check all possible storage locations)
      const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('token') || sessionStorage.getItem('adminToken') || sessionStorage.getItem('token');

      if (!adminToken) {
        console.error('No admin token found');
        alert('Bạn chưa đăng nhập với tư cách admin!');
        return;
      }

      console.log("=== DEBUG TOKEN ===");
      console.log("1. Token lấy từ localStorage:", adminToken);
      console.log("2. Token length:", adminToken ? adminToken.length : 0);
      console.log("3. Token starts with:", adminToken ? adminToken.substring(0, 10) : 'NO TOKEN');

      // Check if it's a fake token (common pattern for fake tokens)
      if (adminToken.startsWith('local-admin-token-')) {
        console.error('❌ Detected fake token. Please log out and log in again with real credentials.');
        alert('Lỗi xác thực: Phát hiện token giả. Vui lòng đăng xuất và đăng nhập lại bằng tài khoản thật.');
        return;
      }

      // Validate order data before sending
      if (!order.customerInfo || !order.customerInfo.email) {
        alert('Không có email khách hàng để gửi xác nhận');
        return;
      }

      if (!order.customerInfo.fullName) {
        alert('Không có tên khách hàng để gửi xác nhận');
        return;
      }

      if (!order.serviceName) {
        alert('Không có tên dịch vụ để gửi xác nhận');
        return;
      }

      if (!order.servicePrice) {
        alert('Không có giá dịch vụ để gửi xác nhận');
        return;
      }

      if (!order.transactionId) {
        alert('Không có mã giao dịch để gửi xác nhận');
        return;
      }

      // Clean up email by removing any spaces
      const cleanEmail = order.customerInfo.email.replace(/\s+/g, '');

      console.log("=== ORDER DATA FOR EMAIL ===");
      console.log("Customer Email:", cleanEmail);
      console.log("Customer Name:", order.customerInfo.fullName);
      console.log("Service Name:", order.serviceName);
      console.log("Service Price:", order.servicePrice);
      console.log("Transaction ID:", order.transactionId);

      // Call backend API to send confirmation email
      const response = await fetch('http://localhost:5000/api/admin/send-order-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': adminToken
        },
        body: JSON.stringify({
          customerEmail: cleanEmail,
          customerName: order.customerInfo.fullName,
          serviceName: order.serviceName,
          servicePrice: order.servicePrice,
          transactionId: order.transactionId
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Confirmation email sent:', result);
        alert(`Email xác nhận đã được gửi đến khách hàng: ${order.customerInfo.email}`);
      } else {
        const errorData = await response.json();
        console.error('Failed to send confirmation email:', errorData);
        alert(`Gửi email xác nhận thất bại: ${errorData.msg || 'Lỗi không xác định'}`);

        // Log more details for debugging
        console.log("=== RESPONSE DETAILS ===");
        console.log("Status:", response.status);
        console.log("Status Text:", response.statusText);
        console.log("Response Body:", errorData);
      }
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      alert('Lỗi kết nối khi gửi email xác nhận');

      // Log more details for debugging
      console.log("=== ERROR DETAILS ===");
      console.log("Error Message:", error.message);
      console.log("Error Stack:", error.stack);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Quản Lý Đơn Hàng Dịch Vụ</h1>
          <div className="text-sm text-gray-600">
            Tổng số đơn hàng: <span className="font-bold">{orders.length}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Đơn hàng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase-wider">Số điện thoại</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dịch vụ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá tiền</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.transactionId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.customerInfo.fullName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{order.customerInfo.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{order.customerInfo.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{order.serviceName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-[#D4AF37]">{order.servicePrice}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status === 'pending' ? 'Chờ xử lý' : 
                           order.status === 'processing' ? 'Đang xử lý' : 
                           order.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                          >
                            <option value="pending">Chờ xử lý</option>
                            <option value="processing">Đang xử lý</option>
                            <option value="completed">Hoàn thành</option>
                            <option value="cancelled">Đã hủy</option>
                          </select>
                          <button
                            onClick={() => sendConfirmationEmail(order)}
                            className="text-blue-600 hover:text-blue-900 text-sm"
                            title="Gửi lại email xác nhận"
                          >
                            Gửi lại email
                          </button>
                          <button
                            onClick={() => deleteOrder(order._id)}
                            className="text-red-600 hover:text-red-900 text-sm"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-12 text-center">
                      <div className="text-gray-500">Chưa có đơn hàng nào</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceOrderManager;