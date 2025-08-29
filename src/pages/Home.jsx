import React from 'react';
import styles from './Home.module.css'; // Import the new styles

const Home = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>
        Discover & Sell Digital Products Instantly
      </h1>
      <p className={styles.subheading}>
        Explore premium templates, planners, and resources created by talented individuals across India.
      </p>
    </div>
  );
};

export default Home;