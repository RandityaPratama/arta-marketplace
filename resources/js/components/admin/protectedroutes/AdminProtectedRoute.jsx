import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../admincontext/AdminAuthContext';
import React from 'react';
const AdminProtectedRoute = ({ requireAuth = true, redirectTo = '/admin' }) => {
  const { isAdminAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (requireAuth && !isAdminAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!requireAuth && isAdminAuthenticated) {

    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;