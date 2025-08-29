import React, { createContext, useState, useContext } from 'react';

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null means logged out

  // Function to log the user in
  const login = (userData) => {
    setUser({ email: userData.email }); // In a real app, this would be more complex
  };

  // Function to log the user out
  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    isLoggedIn: !!user, // true if user is not null, false otherwise
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Create a custom hook to easily use the context
export const useAuth = () => {
  return useContext(AuthContext);
};