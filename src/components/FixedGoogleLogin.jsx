import React, { useEffect, useRef, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { API_ENDPOINTS } from '../config/apiConfig';

const FixedGoogleLogin = ({ onLoginSuccess, onLoginFailure }) => {
  const containerRef = useRef(null);
  const scriptLoadedRef = useRef(false);

  // Initialize Google Identity Services
  const initializeGoogleSignIn = useCallback(() => {
    // Check if script is already loaded
    if (window.google && window.google.accounts) {
      renderGoogleButton();
      return;
    }

    // Load Google Identity Services script if not already loaded
    if (!scriptLoadedRef.current) {
      scriptLoadedRef.current = true;
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        // Wait a bit to ensure the library is fully loaded
        setTimeout(renderGoogleButton, 500);
      };
      script.onerror = () => {
        console.error('Failed to load Google Identity Services script');
        if (onLoginFailure) {
          onLoginFailure(new Error('Không thể tải thư viện xác thực Google'));
        }
      };
      document.head.appendChild(script);
    } else {
      // If script is loading, wait and try again
      setTimeout(initializeGoogleSignIn, 500);
    }
  }, [onLoginSuccess, onLoginFailure]);

  // Render the Google Sign-In button
  const renderGoogleButton = useCallback(() => {
    if (!window.google || !window.google.accounts || !containerRef.current) {
      setTimeout(renderGoogleButton, 500);
      return;
    }

    // Clean up any existing button
    if (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    // Initialize the Google Identity Services client
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false,
    });

    // Render the Google Sign-In button
    window.google.accounts.id.renderButton(
      containerRef.current,
      {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left'
      }
    );

    // Prompt for one-tap sign-up if user is returning
    window.google.accounts.id.prompt();
  }, []);

  // Handle the credential response from Google
  const handleCredentialResponse = async (response) => {
    try {
      // Decode the credential to access Google user info
      const googleUserData = jwtDecode(response.credential);

      // Send the credential to backend for verification
      const apiResponse = await fetch(API_ENDPOINTS.AUTH.VERIFY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: response.credential }),
      });

      const responseText = await apiResponse.text();

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response JSON:', parseError);
        throw new Error(`Failed to parse server response: ${responseText}`);
      }

      if (!apiResponse.ok) {
        throw new Error(result.message || `HTTP error! status: ${apiResponse.status}`);
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

  // Handle error from Google
  const handleGoogleError = (error) => {
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

    // Initialize Google Sign-In
    initializeGoogleSignIn();

    // Cleanup function
    return () => {
      // Remove any Google-related elements when component unmounts
      const googleElements = document.querySelectorAll('[id*="google"], [class*="google"], [jsname*="VbkGxd"]');
      googleElements.forEach(element => {
        element.remove();
      });
    };
  }, [initializeGoogleSignIn]);

  return (
    <div ref={containerRef} style={{ display: 'flex', justifyContent: 'center' }}></div>
  );
};

export default FixedGoogleLogin;