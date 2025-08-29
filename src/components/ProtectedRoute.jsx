import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    // If user is not logged in, redirect them to the /login page
    return <Navigate to="/login" />;
  }

  // If user is logged in, show the page
  return children;
};

export default ProtectedRoute;