import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/login', { email, password });
      login(data); // Pass user data (including token) to the context
      navigate('/');
    } catch (error) {
      alert(error.response.data.message || 'An error occurred.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2 className={styles.title}>Log In</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}><label htmlFor="email">Email</label><input type="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className={styles.formGroup}><label htmlFor="password">Password</label><input type="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <button type="submit" className={styles.button}>Log In</button>
        </form>
        <div className={styles.linkContainer}><Link to="/create-account" className={styles.link}>Create Account</Link></div>
      </div>
    </div>
  );
};

export default Login;