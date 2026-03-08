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
  
  // Change password modal state
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [changePasswordForm, setChangePasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState('');
  const [changePasswordSuccess, setChangePasswordSuccess] = useState('');

  // Load data from localStorage and API
  useEffect(() => {
    const fetchData = async () => {
      const storedActivities = JSON.parse(localStorage.getItem('loginActivities')) || [];
      setLoginActivities(storedActivities.slice(0, 4));

      const users = JSON.parse(localStorage.getItem('users')) || [];
      const orders = JSON.parse(localStorage.getItem('adminOrders')) || [];
      const dangKyKinhDoanhServices = JSON.parse(localStorage.getItem('dangKyKinhDoanhServices')) || [];
      const keToanDoanhNghiepServices = JSON.parse(localStorage.getItem('keToanDoanhNghiepServices')) || [];
      const thueHoKinhDoanhServices = JSON.parse(localStorage.getItem('thueHoKinhDoanhServices')) || [];
      const thietKeWebServices = JSON.parse(localStorage.getItem('thietKeWebServices')) || [];
      const articles = JSON.parse(localStorage.getItem('knowledgeArticles')) || [];

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

    if (newStatus === 'completed') {
      const order = updatedOrders.find(o => o._id === orderId);
      if (order && order.customerInfo && order.customerInfo.email) {
        try {
          const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('token');
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
            alert(`Email xác nhận đã được gửi đến khách hàng: ${order.customerInfo.email}`);
          } else {
            const error = await response.json();
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
      const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('token');
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
        alert(`Email xác nhận đã được gửi đến khách hàng: ${order.customerInfo.email}`);
      } else {
        const error = await response.json();
        alert(`Gửi email xác nhận thất bại: ${error.msg || 'Lỗi không xác định'}`);
      }
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      alert('Lỗi kết nối khi gửi email xác nhận');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const currentPassword = changePasswordForm.currentPassword.trim();
    const newPassword = changePasswordForm.newPassword.trim();
    const confirmPassword = changePasswordForm.confirmPassword.trim();

    if (newPassword !== confirmPassword) {
      setChangePasswordError('Mật khẩu xác nhận không khớp với mật khẩu mới');
      return;
    }

    if (newPassword.length < 6) {
      setChangePasswordError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    setChangePasswordError('');
    setChangePasswordSuccess('');
    setChangePasswordLoading(true);

    try {
      const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('token');
      
      console.log('=== DEBUG CHANGE PASSWORD ===');
      console.log('Token:', adminToken);
      console.log('Passwords:', { currentPassword, newPassword, confirmPassword });

      const response = await fetch(API_ENDPOINTS.ADMIN.CHANGE_PASSWORD, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': adminToken || ''
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        setChangePasswordSuccess('Đổi mật khẩu thành công!');
        setChangePasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => {
          setShowChangePasswordModal(false);
          setChangePasswordSuccess('');
        }, 2000);
      } else {
        setChangePasswordError(data.msg || 'Đổi mật khẩu thất bại');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setChangePasswordError('Lỗi kết nối. Vui lòng thử lại sau.');
    } finally {
      setChangePasswordLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản Trị Hệ Thống</h1>
          <p className="text-gray-600 mt-2">Bảng điều khiển quản trị Kế Toán Sen Vàng</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
              console.log('=== TOKEN DEBUG ===');
              console.log('Token:', token);
              console.log('Starts with eyJ:', token?.startsWith('eyJ'));
              if (token && token.startsWith('eyJ')) {
                try {
                  const parts = token.split('.');
                  const payload = JSON.parse(atob(parts[1]));
                  console.log('Payload:', payload);
                  console.log('Admin ID:', payload.adminId);
                } catch (e) {
                  console.log('Cannot decode token');
                }
              }
              alert(token ? 'Token đã log trong Console!' : 'Không có token!');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            🐛 Debug Token
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('adminToken');
              localStorage.removeItem('token');
              localStorage.removeItem('userName');
              localStorage.removeItem('userEmail');
              localStorage.removeItem('adminId');
              alert('✅ Đã xóa token! Đăng nhập lại.');
              window.location.href = '/admin-login';
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
          >
            🚪 Đăng xuất
          </button>
          <button
            onClick={() => setShowChangePasswordModal(true)}
            className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-yellow-600 transition-colors shadow-md"
          >
            🔒 Đổi mật khẩu
          </button>
        </div>
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
          <div className="h-80">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'Chờ xử lý', value: stats.pendingOrders },
                { name: 'Đã xác nhận', value: stats.confirmedOrders },
                { name: 'Thanh toán thành công', value: stats.successfulPayments }
              ]}>
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
          <div className="h-80">
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

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">🔒 Đổi mật khẩu</h2>
              <button
                onClick={() => {
                  setShowChangePasswordModal(false);
                  setChangePasswordError('');
                  setChangePasswordSuccess('');
                  setChangePasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleChangePassword}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu hiện tại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={changePasswordForm.currentPassword}
                    onChange={(e) => setChangePasswordForm({ ...changePasswordForm, currentPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="Nhập mật khẩu hiện tại"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu mới <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={changePasswordForm.newPassword}
                    onChange={(e) => setChangePasswordForm({ ...changePasswordForm, newPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Xác nhận mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={changePasswordForm.confirmPassword}
                    onChange={(e) => setChangePasswordForm({ ...changePasswordForm, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="Nhập lại mật khẩu mới"
                    required
                    minLength={6}
                  />
                  {changePasswordForm.confirmPassword && 
                   changePasswordForm.newPassword.length >= 6 && 
                   changePasswordForm.confirmPassword.length >= 6 &&
                   changePasswordForm.newPassword.trim() !== changePasswordForm.confirmPassword.trim() && (
                    <p className="text-red-500 text-xs mt-1">⚠️ Mật khẩu xác nhận không khớp</p>
                  )}
                </div>

                {changePasswordError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
                    ⚠️ {changePasswordError}
                  </div>
                )}

                {changePasswordSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-600 px-3 py-2 rounded-lg text-sm">
                    ✅ {changePasswordSuccess}
                  </div>
                )}
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePasswordModal(false);
                    setChangePasswordError('');
                    setChangePasswordSuccess('');
                    setChangePasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={changePasswordLoading}
                  className="flex-1 px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {changePasswordLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
