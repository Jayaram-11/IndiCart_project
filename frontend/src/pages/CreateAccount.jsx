import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './CreateAccount.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const CreateAccount = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/register', formData);
      alert('Account created successfully! Please log in.');
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Join IndiCart</h2>
      <div className={styles.box}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}><label htmlFor="fullName">Full Name</label><input type="text" id="fullName" required onChange={handleChange} /></div>
          <div className={styles.formGroup}><label htmlFor="email">Email ID</label><input type="email" id="email" required onChange={handleChange} /></div>
          <div className={styles.formGroup}><label htmlFor="password">Password</label><div className={styles.passwordWrapper}><input type={showPassword ? 'text' : 'password'} id="password" required minLength="6" className={styles.passwordInput} onChange={handleChange} /><button type="button" className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button></div></div>
          <button type="submit" className={styles.button}>Create Account</button>
        </form>
        <div className={styles.linkContainer}><Link to="/login" className={styles.link}>Already have an account? Log In</Link></div>
      </div>
    </div>
  );
};

export default CreateAccount;