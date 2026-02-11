import React, { useEffect, useRef } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { API_ENDPOINTS } from '../config/apiConfig';

const FixedGoogleLogin = ({ onLoginSuccess, onLoginFailure }) => {
  const containerRef = useRef(null);

  const handleSuccess = async (credentialResponse) => {
    try {
      // Decode the credential to access Google user info
      const googleUserData = jwtDecode(credentialResponse.credential);

      // Use data directly from Google (client-side only mode)
      const userData = {
        id: googleUserData.sub,
        name: googleUserData.name,
        email: googleUserData.email,
        avatar: googleUserData.picture
      };

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));

      // Generate a temporary token
      const tempToken = 'temp_token_' + Date.now();
      localStorage.setItem('token', tempToken);

      // Store user name for display in header
      if (userData.name) {
        localStorage.setItem('userName', userData.name);
      }
      if (userData.email) {
        localStorage.setItem('userEmail', userData.email);
      }

      // Store login activity in localStorage
      const loginActivity = {
        name: userData.name,
        email: userData.email,
        loginTime: new Date().toISOString(),
        id: Date.now().toString(),
        provider: 'google',
        ip: 'local',
        userAgent: navigator.userAgent
      };

      const existingActivities = JSON.parse(localStorage.getItem('loginActivities')) || [];
      const updatedActivities = [loginActivity, ...existingActivities];
      localStorage.setItem('loginActivities', JSON.stringify(updatedActivities));

      // Check if the user is an admin based on email
      const isAdmin = userData.email === 'chien180203@gmail.com' || userData.email === 'ketoansenvang.net@gmail.com';
      if (isAdmin) {
        localStorage.setItem('adminToken', 'local-admin-token-' + Date.now());
      }

      // Dispatch custom event to notify other parts of the app about login
      window.dispatchEvent(new Event('userLoggedIn'));

      // Store admin status
      localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');

      // Send confirmation email using EmailJS (only if configured)
      try {
        // Check if EmailJS is configured before importing
        const emailJSConfigured = import.meta.env.VITE_REACT_APP_EMAILJS_PUBLIC_KEY &&
                                  import.meta.env.VITE_REACT_APP_SERVICE_ID &&
                                  import.meta.env.VITE_REACT_APP_TEMPLATE_ID;

        if (emailJSConfigured) {
          // Import email utility function only if EmailJS is configured
          const { sendEmailNotification } = await import('../utils/emailUtils');

          const emailParams = {
            to_name: userData.name,
            to_email: userData.email,
            message: `Bạn đã đăng nhập thành công vào tài khoản trên hệ thống Kế Toán Sen Vàng thông qua Google.\n\nChi tiết đăng nhập:\n- Họ tên: ${userData.name}\n- Email: ${userData.email}\n- Thời gian đăng nhập: ${new Date().toLocaleString('vi-VN')}\n\nNếu bạn không thực hiện đăng nhập này, vui lòng liên hệ với quản trị viên.`,
            subject: 'Xác nhận đăng nhập tài khoản - Kế Toán Sen Vàng',
            login_time: new Date().toLocaleString('vi-VN'),
            full_name: userData.name,
            email: userData.email
          };

          await sendEmailNotification(emailParams);
        } else {
          console.log('EmailJS not configured, skipping confirmation email');
        }
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Don't fail the login if email fails
      }

      // Small delay before redirect to ensure all state is properly set
      setTimeout(() => {
        window.location.href = '/';
      }, 100);

      // Call success callback
      if (onLoginSuccess) {
        onLoginSuccess({
          user: userData,
          googleUserData: googleUserData,
          isAdmin
        });
      }
    } catch (error) {
      console.error('Google login error:', error);
      if (onLoginFailure) {
        onLoginFailure(error);
      }
    }
  };

  const handleError = (error) => {
    console.error('Google login error:', error);

    if (error.error === 'origin_mismatch') {
      console.warn('Google OAuth origin mismatch detected.');
      alert('Hiện tại chức năng đăng nhập Google đang gặp sự cố do cấu hình OAuth. Vui lòng thử lại sau.');
    } else if (error.error === 'popup_closed_by_user' || error.error === 'access_denied') {
      console.info('User closed the Google login popup or denied access');
    } else {
      console.error('Unexpected Google login error:', error);
      alert('Đăng nhập Google thất bại. Vui lòng thử lại sau.');
    }

    if (onLoginFailure) {
      onLoginFailure(error);
    }
  };

  // Handle postMessage error by wrapping in try-catch and using setTimeout
  const safeHandleSuccess = (response) => {
    setTimeout(() => {
      try {
        handleSuccess(response);
      } catch (error) {
        console.error('Error in Google login success handler:', error);
        if (onLoginFailure) {
          onLoginFailure(error);
        }
      }
    }, 0);
  };

  const safeHandleError = (error) => {
    setTimeout(() => {
      try {
        handleError(error);
      } catch (error) {
        console.error('Error in Google login error handler:', error);
      }
    }, 0);
  };

  return (
    <div ref={containerRef} style={{ display: 'flex', justifyContent: 'center' }}>
      <GoogleLogin
        onSuccess={safeHandleSuccess}
        onError={safeHandleError}
        shape="rectangular"
        size="large"
        theme="outline"
        text="signin_with"
      />
    </div>
  );
};

export default FixedGoogleLogin;