import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PublicRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Get the redirect path from state or default to home
  const from = location.state?.from?.pathname || '/';

  if (isAuthenticated) {
    // User is already authenticated, redirect to home or previous page
    return <Navigate to={from} replace />;
  }

  // User is not authenticated, show public pages
  return <Outlet />;
};

export default PublicRoute;
