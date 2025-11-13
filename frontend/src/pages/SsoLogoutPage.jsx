// indicart/src/pages/SsoLogoutPage.jsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Get your main app's AuthContext

const SsoLogoutPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Get your main app's logout function

  useEffect(() => {
    // Call the main site's logout function
    logout(); 
    
    // Just in case the logout function doesn't redirect,
    // we'll force it to the login page.
    navigate('/login');
  }, [logout, navigate]);

  // Show a simple message while it logs out
  return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <h2>Logging you out...</h2>
    </div>
  );
};

export default SsoLogoutPage;