import React, { createContext, useState, useContext, useEffect } from 'react';



const AuthContext = createContext(null);



export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);



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



  const logout = () => {

    setUser(null);

    localStorage.removeItem('userInfo');

  };



  const value = { user, isLoggedIn: !!user, login, logout };



  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

};



export const useAuth = () => {

  return useContext(AuthContext);

};