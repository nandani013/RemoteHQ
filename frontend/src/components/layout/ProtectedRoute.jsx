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
    // Redirect to their default module if they don't have access to this one
    if (user?.role === 'Client') {
      return <Navigate to="/crm" replace />;
    } else if (user?.role === 'Employee' || user?.role === 'Manager' || user?.role === 'Admin') {
      return <Navigate to="/erp" replace />;
    }
    return <Navigate to={defaultRedirect} replace />;
  }

  return <Outlet />;
};
