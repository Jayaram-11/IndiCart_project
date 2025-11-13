// indicart/src/pages/SsoLogoutPage.jsx

import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const SsoLogoutPage = () => {
  const { logout } = useAuth(); // Get your main app's logout function

  useEffect(() => {
    // Call the main site's logout function.
    // The logout function itself now handles the redirect.
    logout(); 
  }, [logout]); // Only depend on logout

  // Show a simple message while it logs out
  return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <h2>Logging you out...</h2>
    </div>
  );
};

export default SsoLogoutPage;