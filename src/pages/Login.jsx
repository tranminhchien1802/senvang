import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import GoogleLoginButton from '../components/GoogleLoginButton';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isRegister, setIsRegister] = useState(searchParams.get('mode') === 'register');
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate passwords match for registration
      if (isRegister && password !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp. Vui lòng thử lại.');
        setLoading(false);
        return;
      }

      if (isRegister) {
        // Use localStorage for registration (client-side only mode)
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const existingUser = users.find(user => user.email === email);

        if (existingUser) {
          alert('Email đã được đăng ký. Vui lòng sử dụng email khác.');
          setLoading(false);
          return;
        }

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
        setIsRegister(false); // Switch to login form
      } else {
        // Use localStorage for login (client-side only mode)
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
          alert('Email hoặc mật khẩu không đúng!');
          setLoading(false);
          return;
        }

        // Store user data in localStorage
        localStorage.setItem('token', 'local_token_' + Date.now());
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userEmail', user.email);

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

        const existingActivities = JSON.parse(localStorage.getItem('loginActivities')) || [];
        const updatedActivities = [loginActivity, ...existingActivities];
        localStorage.setItem('loginActivities', JSON.stringify(updatedActivities));

        window.dispatchEvent(new Event('userLoggedIn'));
        alert('Đăng nhập thành công!');
        navigate(redirect);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-[#D4AF37] mb-6">
          {isRegister ? 'Đăng ký tài khoản' : 'Đăng nhập'}
        </h2>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Họ và tên</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:border-[#D4AF37]"
                placeholder="Nhập họ và tên"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:border-[#D4AF37]"
              placeholder="Nhập email"
              required
            />
          </div>

          {isRegister && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Số điện thoại</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:border-[#D4AF37]"
                placeholder="Nhập số điện thoại"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:border-[#D4AF37]"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          {isRegister && (
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Xác nhận mật khẩu</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 bg-white text-gray-900 rounded border border-gray-300 focus:outline-none focus:border-[#D4AF37]"
                placeholder="Nhập lại mật khẩu"
                required
              />
            </div>
          )}

          {/* Google Login Button */}
          <div className="mb-4">
            <GoogleLoginButton
              onLoginSuccess={({ isAdmin }) => {
                alert('Đăng nhập thành công!');
                // Dispatch login event to update app state
                window.dispatchEvent(new Event('userLoggedIn'));
                if (isAdmin) {
                  navigate('/admin'); // Redirect admin users to admin dashboard
                } else if (redirect && redirect !== '/') {
                  navigate(redirect);
                } else {
                  navigate('/'); // Default redirect to home
                }
              }}
              onLoginFailure={(error) => {
                console.error('Google login error:', error);
                alert('Đăng nhập bằng Google thất bại: ' + (error.message || 'Lỗi không xác định. Vui lòng thử lại.'));
              }}
            />
          </div>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="mx-4 text-gray-400">hoặc</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#D4AF37] text-white font-bold rounded hover:bg-[#b8942f] transition-colors disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : (isRegister ? 'Đăng ký' : 'Đăng nhập')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isRegister ? 'Đã có tài khoản? ' : 'Chưa có tài khoản? '}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-[#D4AF37] hover:underline"
            >
              {isRegister ? 'Đăng nhập ngay' : 'Đăng ký tài khoản'}
            </button>
          </p>
          {!isRegister && (
            <p className="text-gray-600 mt-2">
              <Link to="/admin/login" className="text-[#D4AF37] hover:underline">Đăng nhập admin</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;