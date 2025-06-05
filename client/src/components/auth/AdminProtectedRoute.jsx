// src/components/auth/AdminProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, isLoading: authIsLoading } = useAuthStore();
  const location = useLocation();

  // Wait for authentication status and user data to be resolved
  if (authIsLoading || (isAuthenticated && !user)) { 
    // If isAuthenticated is true but user object is not yet populated (e.g. during initial load/fetch)
    return <LoadingSpinner size="lg" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user?.isAdmin) {
    // User is authenticated but not an admin
    // Redirect to a "Not Authorized" page or homepage
    // For now, let's redirect to home and show a toast (toast needs to be triggered from a component that can use the hook)
    // Ideally, you'd have a dedicated "Unauthorized" page.
    console.warn("Access denied: User is not an admin.");
    return <Navigate to="/" replace />; 
    // Consider adding a toast message here if you have a global way, or on the redirected page.
  }

  // If authenticated and is an admin, render children or Outlet
  return children ? children : <Outlet />;
};

export default AdminProtectedRoute;