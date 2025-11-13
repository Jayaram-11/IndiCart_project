// indicart/src/components/Header.jsx (Updated for Deployment)

import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Header.module.css';

// ✅ --- THIS IS THE CHANGE ---
// Reads from environment variable for deployment (Vercel/Netlify etc.)
// Fallbacks to localhost if not defined
const AUCTION_APP_URL = import.meta.env.VITE_AUCTION_APP_URL || 'http://localhost:5174'; 

const Header = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- SSO LINK LOGIC ---
  let auctionUrl = `${AUCTION_APP_URL}/login`; // Default link
  const token = user?.token; 

  if (isLoggedIn && token) {
    auctionUrl = `${AUCTION_APP_URL}/auth/sso?token=${token}`;
  }
  // --- END SSO LINK LOGIC ---

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>IndiCart</Link>
        <div className={styles.navLinks}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/browse">Browse Products</NavLink>

          {/* ✅ Use <a> tag for external redirect */}
          <a 
            href={auctionUrl} 
            style={{ 
              textDecoration: 'none', 
              color: 'inherit', 
              padding: '0.5rem 1rem'
            }}
          >
            Auctions
          </a>

          {isLoggedIn && user?.role === 'Seller' ? (
            <NavLink to="/sell">Sell Products</NavLink>
          ) : isLoggedIn ? (
            <NavLink to="/become-seller">Become a Seller</NavLink>
          ) : (
            <NavLink to="/sell">Sell Products</NavLink>
          )}

          {isLoggedIn ? (
            <div className={styles.accountMenu}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={styles.accountButton}
              >
                My Account
              </button>

              {isMenuOpen && (
                <div className={styles.dropdown}>
                  {user?.role === 'Admin' && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      style={{ color: '#d97706' }}
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <Link to="/account" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>

                  <button onClick={logout}>Log Out</button>
                </div>
              )}
            </div>
          ) : (
            <NavLink to="/login" className={styles.loginButton}>
              Login
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
