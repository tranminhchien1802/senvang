import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  
  // Check if admin token exists
  if (!adminToken) {
    // Redirect to admin login if no token
    return <Navigate to="/admin/login" replace />;
  }

  // If token exists, render the protected component
  return children;
};

export default AdminProtectedRoute;