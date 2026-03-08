// File: src/pages/AdminLogin.jsx
import React, { useState } from 'react';
import { API_ENDPOINTS } from '../config/apiConfig';
import { useNavigate, Link } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState(''); // Change back to email for login
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Backend login ONLY - no fallback
      const response = await fetch(API_ENDPOINTS.ADMIN.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Response is not JSON. Content-Type:', contentType);
        const text = await response.text();
        console.error('Response text:', text);
        throw new Error(`Server trả về phản hồi không hợp lệ (HTTP ${response.status})`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || data.error || 'Đăng nhập thất bại');
      }

      if (!data.token) {
        throw new Error('Không nhận được token từ server');
      }

      // Store the real JWT token from backend
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('token', data.token); // Also store as 'token' for compatibility
      localStorage.setItem('userName', data.admin?.username || email);
      localStorage.setItem('userEmail', data.admin?.email || email);
      localStorage.setItem('adminId', data.admin?.id || '');

      // Store login activity in localStorage
      const loginActivity = {
        name: data.admin?.username || 'Admin',
        email: data.admin?.email || email,
        loginTime: new Date().toISOString(),
        id: Date.now().toString(),
        provider: 'backend',
        ip: 'local',
        userAgent: navigator.userAgent
      };

      const existingActivities = JSON.parse(localStorage.getItem('loginActivities')) || [];
      const updatedActivities = [loginActivity, ...existingActivities];
      localStorage.setItem('loginActivities', JSON.stringify(updatedActivities));

      window.dispatchEvent(new Event('userLoggedIn'));
      alert('Đăng nhập thành công!');
      navigate('/admin');

    } catch (error) {
      console.error('Login error:', error);
      if (error.name === 'SyntaxError' && error.message.includes('json')) {
        alert('Lỗi: Server trả về phản hồi không hợp lệ. Vui lòng kiểm tra backend.');
      } else if (error.message.includes('MONGODB_URI') || error.message.includes('cấu hình MongoDB')) {
        alert('Lỗi cấu hình server: Thiếu MONGODB_URI\n\nVui lòng liên hệ quản trị viên để thiết lập environment variables trên Vercel.');
      } else {
        alert('Lỗi đăng nhập: ' + error.message + '\n\nVui lòng kiểm tra lại email và mật khẩu.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] p-4">
      <div className="bg-[#202020] p-8 rounded-lg shadow-xl w-full max-w-md border border-[#333]">
        <h2 className="text-2xl font-bold text-center text-[#FFD700] mb-8">Đăng nhập Admin</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-[#333] text-white rounded border border-[#444] focus:outline-none focus:border-[#FFD700]"
              placeholder="Nhập email admin"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#333] text-white rounded border border-[#444] focus:outline-none focus:border-[#FFD700]"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#FFD700] text-[#1A1A1A] font-bold rounded hover:bg-yellow-500 transition-colors disabled:opacity-50"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-400">
            <Link to="/login" className="text-[#FFD700] hover:underline">Quay lại đăng nhập người dùng</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;