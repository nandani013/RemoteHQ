import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

export const ProtectedRoute = ({ allowedRoles, defaultRedirect = '/login' }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={defaultRedirect} replace />;
  }

  // If allowedRoles is provided, check if user has required role
  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    if (user?.role === 'Client' || user?.role === 'Employee' || user?.role === 'Manager' || user?.role === 'Admin') {
      return <Navigate to="/crm" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
