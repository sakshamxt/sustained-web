// src/components/auth/AdminProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, isLoading: authIsLoading } = useAuthStore();
  const location = useLocation();

  if (authIsLoading || (isAuthenticated && !user)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.isAdmin === false) {
    // This toast won't be visible as we navigate away immediately.
    // Better to show this message on the page redirected to (e.g. homepage via a query param).
    // Or, create a dedicated "Unauthorized" page.
    console.warn("Access denied: User is not an admin.");
    // For now, just redirect. A toast could be shown on the HomePage based on a redirect flag.
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default AdminProtectedRoute;