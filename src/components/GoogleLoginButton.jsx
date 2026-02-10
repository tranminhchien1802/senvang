// File: src/components/GoogleLoginButton.jsx
import React from 'react';
import FixedGoogleLogin from './FixedGoogleLogin';

const GoogleLoginButton = ({ onLoginSuccess, onLoginFailure }) => {
  return (
    <FixedGoogleLogin
      onLoginSuccess={onLoginSuccess}
      onLoginFailure={onLoginFailure}
    />
  );
};

export default GoogleLoginButton;