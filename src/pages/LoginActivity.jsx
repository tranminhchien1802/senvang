// File: src/pages/LoginActivity.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      alert('Vui lòng đăng nhập để truy cập trang admin');
      navigate('/admin/login');
      return;
    }

    // Load login activities from localStorage
    const loadLoginActivities = () => {
      try {
        const savedActivities = JSON.parse(localStorage.getItem('loginActivities')) || [];
        setActivities(savedActivities);
      } catch (error) {
        console.error('Error loading login activities:', error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    // Load activities initially
    loadLoginActivities();

    // Set up localStorage change listener
    const handleStorageChange = () => {
      loadLoginActivities();
    };

    // Add event listener for localStorage changes
    window.addEventListener('storage', handleStorageChange);

    // Add event listener for custom userLoggedIn event
    window.addEventListener('userLoggedIn', handleStorageChange);

    // Clean up event listeners
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLoggedIn', handleStorageChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Lịch sử đăng nhập</h2>
        <p className="text-gray-400">Danh sách các lần đăng nhập gần đây</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Người dùng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">IP</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Thiết bị</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Thời gian</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {activities.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                  Chưa có hoạt động đăng nhập nào
                </td>
              </tr>
            ) : (
              activities.map((activity) => (
                <tr key={activity._id} className="hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {activity.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {activity.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {activity.ip || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate" title={activity.userAgent}>
                    {activity.userAgent ? activity.userAgent.substring(0, 50) + '...' : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(activity.loginTime).toLocaleString('vi-VN')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoginActivity;