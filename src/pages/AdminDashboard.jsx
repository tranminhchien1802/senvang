import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { API_ENDPOINTS } from '../config/apiConfig';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalServices: 0,
    totalArticles: 0,
    confirmedOrders: 0,
    successfulPayments: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loginActivities, setLoginActivities] = useState([]);

  // Load data from localStorage and API
  useEffect(() => {
    const fetchData = async () => {
      // Load login activities
      const storedActivities = JSON.parse(localStorage.getItem('loginActivities')) || [];
      setLoginActivities(storedActivities.slice(0, 4)); // Show last 4 activities

      // Calculate stats from stored data
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const orders = JSON.parse(localStorage.getItem('adminOrders')) || [];
      const dangKyKinhDoanhServices = JSON.parse(localStorage.getItem('dangKyKinhDoanhServices')) || [];
      const keToanDoanhNghiepServices = JSON.parse(localStorage.getItem('keToanDoanhNghiepServices')) || [];
      const thueHoKinhDoanhServices = JSON.parse(localStorage.getItem('thueHoKinhDoanhServices')) || [];
      const thietKeWebServices = JSON.parse(localStorage.getItem('thietKeWebServices')) || [];
      const articles = JSON.parse(localStorage.getItem('knowledgeArticles')) || [];

      // Calculate stats
      setStats({
        totalUsers: users.length,
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + (parseFloat(order.servicePrice?.replace(/[^\d]/g, '')) || 0), 0),
        pendingOrders: orders.filter(order => order.status === 'pending').length,
        totalServices: dangKyKinhDoanhServices.length + keToanDoanhNghiepServices.length + thueHoKinhDoanhServices.length + thietKeWebServices.length,
        totalArticles: articles.length,
        confirmedOrders: orders.filter(order => order.status === 'confirmed').length,
        successfulPayments: orders.filter(order => order.status === 'completed' || order.status === 'paid').length
      });

      // Set recent orders (last 5 orders)
      setRecentOrders(orders.slice(0, 5));
    };

    fetchData();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    const orders = JSON.parse(localStorage.getItem('adminOrders')) || [];
    const updatedOrders = orders.map(order =>
      order._id === orderId ? { ...order, status: newStatus } : order
    );

    localStorage.setItem('adminOrders', JSON.stringify(updatedOrders));
    setRecentOrders(updatedOrders.slice(0, 5));

    // If status is changed to 'completed', send confirmation email to customer
    if (newStatus === 'completed') {
      const order = updatedOrders.find(o => o._id === orderId);
      if (order && order.customerInfo && order.customerInfo.email) {
        try {
          // Get admin token from localStorage (could be stored as adminToken or token)
          const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('token');

          // Call backend API to send confirmation email
          const response = await fetch(API_ENDPOINTS.ADMIN.SEND_ORDER_CONFIRMATION, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': adminToken || ''
            },
            body: JSON.stringify({
              customerEmail: order.customerInfo.email,
              customerName: order.customerInfo.fullName,
              serviceName: order.serviceName || order.packageName,
              servicePrice: order.servicePrice || order.packagePrice,
              transactionId: order.transactionId
            })
          });

          if (response.ok) {
            const result = await response.json();
            console.log('Confirmation email sent:', result);
            alert(`Email xác nhận đã được gửi đến khách hàng: ${order.customerInfo.email}`);
          } else {
            const error = await response.json();
            console.error('Failed to send confirmation email:', error);
            alert(`Gửi email xác nhận thất bại: ${error.msg || 'Lỗi không xác định'}`);
          }
        } catch (error) {
          console.error('Error sending confirmation email:', error);
          alert('Lỗi kết nối khi gửi email xác nhận');
        }
      }
    }
  };

  const sendConfirmationEmail = async (order) => {
    if (!order.customerInfo || !order.customerInfo.email) {
      alert('Không có địa chỉ email để gửi xác nhận');
      return;
    }

    try {
      // Get admin token from localStorage (could be stored as adminToken or token)
      const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('token');

      // Call backend API to send confirmation email
      const response = await fetch(API_ENDPOINTS.ADMIN.SEND_ORDER_CONFIRMATION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': adminToken || ''
        },
        body: JSON.stringify({
          customerEmail: order.customerInfo.email,
          customerName: order.customerInfo.fullName,
          serviceName: order.serviceName || order.packageName,
          servicePrice: order.servicePrice || order.packagePrice,
          transactionId: order.transactionId
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Confirmation email sent:', result);
        alert(`Email xác nhận đã được gửi đến khách hàng: ${order.customerInfo.email}`);
      } else {
        const error = await response.json();
        console.error('Failed to send confirmation email:', error);
        alert(`Gửi email xác nhận thất bại: ${error.msg || 'Lỗi không xác định'}`);
      }
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      alert('Lỗi kết nối khi gửi email xác nhận');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quản Trị Hệ Thống</h1>
        <p className="text-gray-600 mt-2">Bảng điều khiển quản trị Kế Toán Sen Vàng</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Tổng người dùng</h3>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalUsers}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Tổng đơn hàng</h3>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalOrders}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-yellow-500">
          <h3 className="text-sm font-medium text-gray-500">Doanh thu</h3>
          <p className="text-2xl font-bold text-gray-800 mt-1">{(stats.totalRevenue / 1000000).toFixed(1)}M</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-red-500">
          <h3 className="text-sm font-medium text-gray-500">Đơn chờ xử lý</h3>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.pendingOrders}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-purple-500">
          <h3 className="text-sm font-medium text-gray-500">Đơn đã xác nhận</h3>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.confirmedOrders}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-indigo-500">
          <h3 className="text-sm font-medium text-gray-500">TT thành công</h3>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.successfulPayments}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-teal-500">
          <h3 className="text-sm font-medium text-gray-500">Tổng dịch vụ</h3>
          <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalServices}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Trạng Thái Đơn Hàng</h3>
          <div className="h-80" style={{ minHeight: '300px', width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: 'Chờ xử lý', value: stats.pendingOrders },
                  { name: 'Đã xác nhận', value: stats.confirmedOrders },
                  { name: 'Thanh toán thành công', value: stats.successfulPayments }
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [value, 'Số lượng']} />
                <Legend />
                <Bar dataKey="value" name="Số lượng" fill="#D4AF37" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Phân Bổ Trạng Thái Đơn Hàng</h3>
          <div className="h-80 flex items-center justify-center" style={{ minHeight: '300px', width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Chờ xử lý', value: stats.pendingOrders, color: '#EF4444' },
                    { name: 'Đã xác nhận', value: stats.confirmedOrders, color: '#3B82F6' },
                    { name: 'Thanh toán thành công', value: stats.successfulPayments, color: '#10B981' }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {[
                    { name: 'Chờ xử lý', value: stats.pendingOrders, color: '#EF4444' },
                    { name: 'Đã xác nhận', value: stats.confirmedOrders, color: '#3B82F6' },
                    { name: 'Thanh toán thành công', value: stats.successfulPayments, color: '#10B981' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${entry.name}-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Số lượng']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Hoạt động gần đây</h3>
        <div className="space-y-4">
          {loginActivities.length > 0 ? (
            loginActivities.map((activity, index) => (
              <div key={activity.id} className="flex items-center p-3 border-b border-gray-100 last:border-b-0">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                <div className="ml-4">
                  <h4 className="font-medium text-gray-800">{activity.name}</h4>
                  <p className="text-sm text-gray-500">{activity.email}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(activity.loginTime).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Chưa có hoạt động gần đây</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">Đơn hàng mới</h3>
          <a href="/admin/service-orders" className="text-sm text-blue-600 hover:text-blue-800">Xem tất cả</a>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dịch vụ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá tiền</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.customerInfo?.fullName || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{order.customerInfo?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.serviceName || order.packageName || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#D4AF37]">{order.servicePrice || order.packagePrice || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status === 'pending' ? 'Chờ xử lý' :
                         order.status === 'processing' ? 'Đang xử lý' :
                         order.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                      </span>
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
                          className="text-blue-600 hover:text-blue-900 text-xs"
                          title="Gửi lại email xác nhận"
                        >
                          Gửi email
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="text-gray-500">Chưa có đơn hàng nào</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;