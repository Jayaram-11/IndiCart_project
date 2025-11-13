import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import styles from './CreateAccount.module.css'; // Reusing existing styles

const BecomeSeller = () => {
  const { user, login } = useAuth(); // We use 'login' to update the user state
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ mobile: '', upiId: '', bio: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      // Call the new profile update endpoint
      const { data } = await axios.put('http://localhost:5000/api/users/profile', formData, config);
      
      // Update the global auth state with the new user data (which now has role: 'Seller')
      login(data); 
      alert('Congratulations! You are now a seller.');
      navigate('/sell');
    } catch (error) {
        alert(error.response?.data?.message || 'Error upgrading profile.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Complete Your Seller Profile</h2>
      <div className={styles.box}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}><label htmlFor="mobile">Mobile No</label><input type="tel" id="mobile" required onChange={handleChange} /></div>
          <div className={styles.formGroup}><label htmlFor="upiId">UPI ID (for payouts)</label><input type="text" id="upiId" required onChange={handleChange} /></div>
          <div className={styles.formGroup}><label htmlFor="bio">Seller Bio</label><textarea id="bio" placeholder="Tell buyers about yourself" required minLength="100" maxLength="500" onChange={handleChange}></textarea></div>
          <button type="submit" className={styles.button}>Become a Seller</button>
        </form>
      </div>
    </div>
  );
};

export default BecomeSeller;