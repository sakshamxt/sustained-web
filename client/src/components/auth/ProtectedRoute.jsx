// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '@/store/authStore';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  // If still checking auth status (e.g., initial load, though our store initializes from localStorage)
  // you might want a loading spinner here. For now, we assume isLoading in store is for API calls.
  // Our current store sets isAuthenticated based on token presence synchronously.

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If `children` prop is provided, render it. Otherwise, render <Outlet /> for nested routes.
  return children ? children : <Outlet />;
};

export default ProtectedRoute;