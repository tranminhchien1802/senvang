// File: src/components/UserAuthModal.jsx
import React, { useState } from 'react';
import { API_ENDPOINTS } from '../config/apiConfig';
import GoogleLoginButton from './GoogleLoginButton';

const UserAuthModal = ({ isOpen, onClose, mode, onSwitchMode }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate passwords match for registration
      if (mode === 'register' && password !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp. Vui lòng thử lại.');
        setLoading(false);
        return;
      }

      // Try backend authentication first
      const url = mode === 'register'
        ? API_ENDPOINTS.USERS.REGISTER
        : API_ENDPOINTS.USERS.LOGIN;

      let response, data;
      let backendSuccess = false;

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            mode === 'register'
              ? { name, email, password, phone }
              : { email, password }
          ),
        });

        data = await response.json();

        if (response.ok) {
          backendSuccess = true;
        }
      } catch (fetchError) {
        console.error('Backend authentication failed:', fetchError);
        // Continue to fallback mechanism
      }

      // If backend is not available or authentication failed, use fallback
      if (!backendSuccess) {
        // Fallback: Use localStorage for user management
        const users = JSON.parse(localStorage.getItem('users')) || [];

        if (mode === 'register') {
          // Check if user already exists in localStorage
          const existingUser = users.find(user => user.email === email);
          if (existingUser) {
            alert('Email đã được đăng ký. Vui lòng sử dụng email khác.');
            setLoading(false);
            return;
          }

          // Create new user in localStorage
          const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password, // In a real app, this should be hashed
            phone,
            createdAt: new Date().toISOString()
          };
          users.push(newUser);
          localStorage.setItem('users', JSON.stringify(users));

          alert('Đăng ký thành công!');
          onSwitchMode('login');
        } else { // Login mode
          // Find user in localStorage
          const user = users.find(user => user.email === email && user.password === password);
          if (!user) {
            alert('Email hoặc mật khẩu không đúng!');
            setLoading(false);
            return;
          }

          // Successful login - store user info in localStorage
          localStorage.setItem('token', 'local-user-token-' + Date.now());
          localStorage.setItem('userName', user.name);
          localStorage.setItem('userEmail', user.email);
          localStorage.setItem('user', JSON.stringify(user));

          // Store login activity in localStorage
          const loginActivity = {
            name: user.name,
            email: user.email,
            loginTime: new Date().toISOString(),
            id: Date.now().toString(),
            provider: 'email',
            ip: 'local',
            userAgent: navigator.userAgent
          };

          // Get existing login activities or initialize empty array
          const existingActivities = JSON.parse(localStorage.getItem('loginActivities')) || [];

          // Add new activity to the beginning of the array
          const updatedActivities = [loginActivity, ...existingActivities];

          // Save to localStorage
          localStorage.setItem('loginActivities', JSON.stringify(updatedActivities));

          // Dispatch custom event to notify other parts of the app about login
          window.dispatchEvent(new Event('userLoggedIn'));

          alert('Đăng nhập thành công!');
          window.location.reload(); // Reload to update UI
        }
      } else {
        // Backend authentication was successful
        if (mode === 'register') {
          alert('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.');
          onSwitchMode('login');
        } else {
          // Store user token
          localStorage.setItem('token', data.token);

          // Store user name and email for display in header
          if (data.user && data.user.name) {
            localStorage.setItem('userName', data.user.name);
          }
          if (data.user && data.user.email) {
            localStorage.setItem('userEmail', data.user.email);
          }

          // Store login activity in localStorage
          const loginActivity = {
            name: data.user?.name || email,
            email: data.user?.email || email,
            loginTime: new Date().toISOString(),
            id: Date.now().toString(),
            provider: 'email',
            ip: 'local', // Since this is client-side, we can't get real IP without backend
            userAgent: navigator.userAgent
          };

          // Get existing login activities or initialize empty array
          const existingActivities = JSON.parse(localStorage.getItem('loginActivities')) || [];

          // Add new activity to the beginning of the array
          const updatedActivities = [loginActivity, ...existingActivities];

          // Save to localStorage
          localStorage.setItem('loginActivities', JSON.stringify(updatedActivities));

          // Dispatch custom event to notify other parts of the app about login
          window.dispatchEvent(new Event('userLoggedIn'));

          alert('Đăng nhập thành công!');
          window.location.reload(); // Reload to update UI
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[#282828] rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-[#282828] z-10">
            <h3 className="text-xl font-bold text-[#FFD700]">
              {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              &times;
            </button>
          </div>

          <div className="space-y-4">
            {/* Google Login Button */}
            <div className="w-full">
              <GoogleLoginButton
                onLoginSuccess={() => {
                  alert('Đăng nhập thành công!');
                  onClose(); // Close the modal after successful login
                  window.location.reload(); // Refresh to update UI
                }}
                onLoginFailure={(error) => {
                  alert('Đăng nhập bằng Google thất bại: ' + (error.message || 'Lỗi không xác định. Vui lòng thử lại.'));
                }}
              />
            </div>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="mx-4 text-gray-400">hoặc</span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>

            {/* Traditional login form - RESTORED WITH CONFIRM PASSWORD */}
            <form onSubmit={handleSubmit}>
              {mode === 'register' && (
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2">Họ và tên</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#333] text-white rounded border border-[#444] focus:outline-none focus:border-[#FFD700]"
                    placeholder="Nhập họ và tên"
                    required
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#333] text-white rounded border border-[#444] focus:outline-none focus:border-[#FFD700]"
                  placeholder="Nhập email"
                  required
                />
              </div>

              {mode === 'register' && (
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
              )}

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Mật khẩu</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-[#333] text-white rounded border border-[#444] focus:outline-none focus:border-[#FFD700]"
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>

              {mode === 'register' && (
                <div className="mb-6">
                  <label className="block text-gray-300 mb-2">Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-[#333] text-white rounded border border-[#444] focus:outline-none focus:border-[#FFD700]"
                    placeholder="Nhập lại mật khẩu"
                    required
                  />
                </div>
              )}


              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#FFD700] text-[#1A1A1A] font-bold rounded hover:bg-yellow-500 transition-colors disabled:opacity-50"
              >
                {loading ? 'Đang xử lý...' : (mode === 'login' ? 'Đăng nhập' : 'Đăng ký')}
              </button>

              <div className="mt-4 text-center">
                <p className="text-gray-400">
                  {mode === 'login'
                    ? "Chưa có tài khoản? "
                    : "Đã có tài khoản? "}
                  <button
                    type="button"
                    onClick={onSwitchMode}
                    className="text-[#FFD700] hover:underline"
                  >
                    {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAuthModal;