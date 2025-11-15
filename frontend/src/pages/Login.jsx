import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios'; // ✅ CHANGED
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      // ✅ This now uses your axiosInstance, which will send cookies
      const { data } = await axiosInstance.post('/users/login', { email, password }); // ✅ CHANGED
      
      // ✅ This login() function will now receive the user data *without* the token.
      // The token will be set as a cookie by the backend (once you make my other fix).
      // Your AuthContext will need to be updated to handle this.
      login(data); 
      navigate('/');
    } catch (error) {
      alert(error.response.data.message || 'An error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2 className={styles.title}>Log In</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}><label htmlFor="email">Email</label><input type="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className={styles.formGroup}><label htmlFor="password">Password</label><input type="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <div className={styles.linkContainer}><Link to="/create-account" className={styles.link}>Create Account</Link></div>
      </div>
    </div>
  );
};

export default Login;