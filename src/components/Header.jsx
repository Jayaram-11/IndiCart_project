import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import styles from './Header.module.css';

const Header = () => {
  const { isLoggedIn, logout } = useAuth(); // Get login state and logout function
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>
          IndiCart
        </Link>

        <div className={styles.navLinks}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/browse">Browse Products</NavLink>
          <NavLink to="/sell">Sell Products</NavLink>
          
          {isLoggedIn ? (
            // If logged in, show "My Account" menu
            <div className={styles.accountMenu}>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={styles.accountButton}>
                My Account
              </button>
              {isMenuOpen && (
                <div className={styles.dropdown}>
                  <Link to="/account" onClick={() => setIsMenuOpen(false)}>View Account</Link>
                  <button onClick={logout}>Log Out</button>
                </div>
              )}
            </div>
          ) : (
            // If logged out, show Login button (THIS WAS THE MISSING PART)
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