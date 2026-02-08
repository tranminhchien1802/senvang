// File: src/pages/AdminLogin.jsx
import React, { useState } from 'react';
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
      // Try backend login first
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Store the real JWT token from backend
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('userName', data.user?.name || email);
        localStorage.setItem('userEmail', data.user?.email || email);
        alert('Đăng nhập thành công!');
        navigate('/admin');
      } else {
        throw new Error(data.msg || 'Lỗi đăng nhập backend');
      }
    } catch (error) {
      console.error('Backend login failed:', error);
      
      // Fallback to localStorage admin credentials
      if ((email === 'chien180203@gmail.com' || email === 'ketoansenvang.net@gmail.com') && password === '123') {
        // Admin login successful
        localStorage.setItem('adminToken', 'local-admin-token-' + Date.now());
        localStorage.setItem('userName', 'Admin');
        localStorage.setItem('userEmail', email);
        
        // Store login activity in localStorage
        const loginActivity = {
          name: 'Admin',
          email: email,
          loginTime: new Date().toISOString(),
          id: Date.now().toString(),
          provider: 'admin',
          ip: 'local',
          userAgent: navigator.userAgent
        };

        const existingActivities = JSON.parse(localStorage.getItem('loginActivities')) || [];
        const updatedActivities = [loginActivity, ...existingActivities];
        localStorage.setItem('loginActivities', JSON.stringify(updatedActivities));

        window.dispatchEvent(new Event('userLoggedIn'));
        alert('Đăng nhập thành công!');
        navigate('/admin');
      } else {
        alert('Email hoặc mật khẩu không đúng!');
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