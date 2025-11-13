import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import axiosInstance from '../api/axios'; // 2. Import your axios instance

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // 3. Initialize navigate

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  // ✅ Handles both login and profile updates
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('userInfo', JSON.stringify(userData));
  };

  // ✅ 4. UPDATE THE LOGOUT FUNCTION
  const logout = useCallback(async () => {
    try {
      // Call the backend endpoint to clear the secure cookie
      await axiosInstance.post('/users/logout');
    } catch (error) {
      // Log the error but don't stop the logout process
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear the frontend state and redirect
      setUser(null);
      localStorage.removeItem('userInfo');
      navigate('/login'); // Redirect to login page *after* logging out
    }
  }, [navigate]); // Add navigate as a dependency

  const value = { user, isLoggedIn: !!user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};