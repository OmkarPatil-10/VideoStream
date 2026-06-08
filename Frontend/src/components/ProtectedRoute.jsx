import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/store';

const ProtectedRoute = ({ children }) => {
  const { accessToken, user } = useAuthStore();
  
  if (!accessToken || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
