// File: src/components/GoogleLoginButton.jsx
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { API_ENDPOINTS } from '../config/apiConfig';

const GoogleLoginButton = ({ onLoginSuccess, onLoginFailure }) => {
  const handleSuccess = async (credentialResponse) => {
    try {
      // First, decode the credential to access Google user info in frontend if needed
      const googleUserData = jwtDecode(credentialResponse.credential);

      // Log Google user data for debugging (optional)
      console.log('Google user data:', googleUserData);

      // Send the credential to backend for verification
      console.log('Sending credential to backend for verification...');
      const response = await fetch(API_ENDPOINTS.AUTH.VERIFY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response JSON:', parseError);
        throw new Error(`Failed to parse server response: ${responseText}`);
      }

      // Check if result has success property (for newer API responses)
      if (result.msg && !result.token) {
        // Handle older API response format
        if (result.msg.includes('failed') || result.msg.includes('error')) {
          throw new Error(result.msg || 'Authentication failed');
        }
      }

      // Store user data locally for frontend use
      const userData = {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        picture: result.user.picture
      };

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', result.token); // Store the backend-generated token

      // Store user name for display in header
      if (userData.name) {
        localStorage.setItem('userName', userData.name);
      }
      if (userData.email) {
        localStorage.setItem('userEmail', userData.email);
      }

      // Store login activity in localStorage
      const loginActivity = {
        name: result.user.name,
        email: result.user.email,
        loginTime: new Date().toISOString(),
        id: Date.now().toString(),
        provider: 'google',
        ip: 'local', // Since this is client-side, we can't get real IP without backend
        userAgent: navigator.userAgent
      };

      // Get existing login activities or initialize empty array
      const existingActivities = JSON.parse(localStorage.getItem('loginActivities')) || [];

      // Add new activity to the beginning of the array
      const updatedActivities = [loginActivity, ...existingActivities];

      // Save to localStorage
      localStorage.setItem('loginActivities', JSON.stringify(updatedActivities));

      // Check if the user is an admin
      const isAdmin = result.user.email === 'chien180203@gmail.com' || result.user.email === 'ketoansenvang.net@gmail.com';
      if (isAdmin) {
        localStorage.setItem('adminToken', 'local-admin-token-' + Date.now());
      }

      // Also store Google user data temporarily if you need to access it immediately
      localStorage.setItem('googleUserData', JSON.stringify(googleUserData));

      // Dispatch custom event to notify other parts of the app about login
      window.dispatchEvent(new Event('userLoggedIn'));

      // Store admin status
      localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
      
      // Redirect to homepage after successful login
      window.location.href = '/';

      // Call success callback
      if (onLoginSuccess) {
        onLoginSuccess({
          user: userData,
          googleUserData: googleUserData, // Include Google user data if needed
          isAdmin // Include admin status
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
    // Hiển thị thông báo lỗi thân thiện hơn cho người dùng
    if (error.error === 'origin_mismatch') {
      console.warn('Google OAuth origin mismatch detected. This error typically occurs when the domain is not registered in Google Cloud Console.');
      alert('Hiện tại chức năng đăng nhập Google đang gặp sự cố do cấu hình OAuth. Vui lòng thử lại sau hoặc sử dụng phương thức đăng nhập khác.');
    } else if (error.error === 'popup_closed_by_user' || error.error === 'access_denied') {
      console.info('User closed the Google login popup or denied access');
      // Don't show an error for user-initiated cancellations
    } else {
      console.error('Unexpected Google login error:', error);
      alert('Đăng nhập Google thất bại. Vui lòng thử lại sau.');
    }
    if (onLoginFailure) {
      onLoginFailure(error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      shape="rectangular"
      size="large"
      theme="outline"
      text="signin_with"
    />
  );
};

export default GoogleLoginButton;