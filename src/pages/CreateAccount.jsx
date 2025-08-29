import React, { useState } from 'react'; // Import useState
import { useNavigate } from 'react-router-dom';
import styles from './CreateAccount.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons

const CreateAccount = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const handleSubmit = (event) => {
    event.preventDefault();
    alert('Account created successfully! Redirecting to login...');
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        Create Seller Account to sell products
      </h2>

      <div className={styles.box}>
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* ... other form groups for name, email, mobile ... */}
          <div className={styles.formGroup}>
            <label htmlFor="fullName">Full Name</label>
            <input type="text" id="fullName" required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email ID</label>
            <input type="email" id="email" required />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="mobile">Mobile No</label>
            <input type="tel" id="mobile" required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Create Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'} // Toggle type based on state
                id="password"
                required
                minLength="6"
                pattern="^(?=.*\d)(?=.*[a-zA-Z]).{6,}$"
                title="Password must be at least 6 characters long and contain at least one letter and one digit."
                className={styles.passwordInput} // Add new class
              />
              <button
                type="button" // Important: type="button" to prevent form submission
                className={styles.eyeIcon}
                onClick={() => setShowPassword(!showPassword)} // Toggle state on click
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="upiId">UPI ID</label>
            <input type="text" id="upiId" required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              placeholder="Tell about yourself"
              required
              minLength="100"
              maxLength="500"
            ></textarea>
          </div>

          <button type="submit" className={styles.button}>
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;