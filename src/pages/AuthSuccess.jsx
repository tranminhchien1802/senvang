// File: src/pages/AuthSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        // Get token from URL parameters
        const token = searchParams.get('token');
        const nameParam = searchParams.get('name');
        const emailParam = searchParams.get('email');

        if (!token) {
          setStatus('error');
          setMessage('Không tìm thấy token xác thực. Vui lòng thử lại.');
          return;
        }

        // Store the token and user information
        localStorage.setItem('token', token);
        if (nameParam) {
          localStorage.setItem('userName', decodeURIComponent(nameParam));
        }
        if (emailParam) {
          localStorage.setItem('userEmail', decodeURIComponent(emailParam));
        }

        // Wait a moment to show success message
        setMessage('Đăng nhập thành công! Đang chuyển hướng...');
        setStatus('success');

        // Redirect to home page after a short delay
        setTimeout(() => {
          navigate('/');
          window.location.reload(); // Refresh to update header state
        }, 2000); // 2 seconds delay
      } catch (error) {
        console.error('Auth success error:', error);
        setStatus('error');
        setMessage('Có lỗi xảy ra trong quá trình xác thực. Vui lòng thử lại.');
      }
    };

    handleAuthSuccess();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] p-4">
      <div className="bg-[#282828] rounded-lg max-w-md w-full p-8 text-center">
        {status === 'loading' && (
          <div className="space-y-4">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFD700] mx-auto"></div>
            <p className="text-gray-300">Đang xác thực tài khoản...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="space-y-4">
            <div className="text-5xl text-green-500 mx-auto">✓</div>
            <h2 className="text-xl font-bold text-[#FFD700]">Xác thực thành công!</h2>
            <p className="text-gray-300">{message}</p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="space-y-4">
            <div className="text-5xl text-red-500 mx-auto">✗</div>
            <h2 className="text-xl font-bold text-red-500">Xác thực thất bại</h2>
            <p className="text-gray-300">{message}</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-[#FFD700] text-[#1A1A1A] font-bold rounded hover:bg-yellow-500 transition-colors"
            >
              Quay về trang chủ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthSuccess;