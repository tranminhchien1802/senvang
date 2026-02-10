import React, { useEffect, useRef } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { API_ENDPOINTS } from '../config/apiConfig';

const FixedGoogleLogin = ({ onLoginSuccess, onLoginFailure }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Clean up any existing Google API scripts to prevent conflicts
    const existingScripts = document.querySelectorAll('script[src*="accounts.google.com"]');
    existingScripts.forEach(script => {
      script.remove();
    });

    // Clean up any existing iframes
    const existingIframes = document.querySelectorAll('iframe[src*="accounts.google.com"]');
    existingIframes.forEach(iframe => {
      iframe.remove();
    });
    
    // Clean up any existing Google sign-in containers
    const existingContainers = document.querySelectorAll('#g_id_onload, div[role="button"][jsaction*="google"], div[jsname="VbkGxd"]');
    existingContainers.forEach(container => {
      container.remove();
    });
  }, []);

  // Wrapper function to handle potential postMessage errors
  const safeHandleSuccess = (credentialResponse) => {
    // Use setTimeout to run the actual handler asynchronously to avoid postMessage issues
    setTimeout(() => {
      handleSuccess(credentialResponse);
    }, 0);
  };

  const safeHandleError = (error) => {
    // Use setTimeout to run the actual handler asynchronously to avoid postMessage issues
    setTimeout(() => {
      handleError(error);
    }, 0);
  };

  const handleSuccess = async (credentialResponse) => {
    try {
      // Decode the credential to access Google user info
      const googleUserData = jwtDecode(credentialResponse.credential);

      // Send the credential to backend for verification
      const response = await fetch(API_ENDPOINTS.AUTH.VERIFY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const responseText = await response.text();
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response JSON:', parseError);
        throw new Error(`Failed to parse server response: ${responseText}`);
      }

      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

      // Store user data locally for frontend use
      const userData = {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
      };

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', result.token);

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
        ip: 'local',
        userAgent: navigator.userAgent
      };

      const existingActivities = JSON.parse(localStorage.getItem('loginActivities')) || [];
      const updatedActivities = [loginActivity, ...existingActivities];
      localStorage.setItem('loginActivities', JSON.stringify(updatedActivities));

      // Check if the user is an admin
      const isAdmin = result.user.email === 'chien180203@gmail.com' || result.user.email === 'ketoansenvang.net@gmail.com';
      if (isAdmin) {
        localStorage.setItem('adminToken', 'local-admin-token-' + Date.now());
      }

      // Dispatch custom event to notify other parts of the app about login
      window.dispatchEvent(new Event('userLoggedIn'));

      // Store admin status
      localStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');

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

  return (
    <div ref={containerRef}>
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