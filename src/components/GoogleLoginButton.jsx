// File: src/components/GoogleLoginButton.jsx
import React from 'react';
import FixedGoogleLogin from './FixedGoogleLogin';

const GoogleLoginButton = ({ onLoginSuccess, onLoginFailure }) => {
  return (
    <div className="google-login-wrapper">
      <FixedGoogleLogin
        onLoginSuccess={onLoginSuccess}
        onLoginFailure={onLoginFailure}
      />
    </div>
  );
};

export default GoogleLoginButton;