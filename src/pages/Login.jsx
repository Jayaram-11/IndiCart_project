import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from context

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you would normally get email/password from the form state
    const fakeUserData = { email: 'user@example.com' };
    login(fakeUserData); // Call the global login function
    navigate('/sell'); // Redirect to /sell
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2 className={styles.title}>Log In</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* ... form inputs ... */}
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" required />
          </div>
          <button type="submit" className={styles.button}>
            Log In
          </button>
        </form>
        <div className={styles.linkContainer}>
          <Link to="/create-account" className={styles.link}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;