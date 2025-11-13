import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0, adminEarnings: 0
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/users/admin/stats', config);
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, [user.token]);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Admin Dashboard</h1>
      
      {/* NEW: Stats Grid */}
      <div className={styles.grid} style={{marginBottom: '3rem'}}>
          <div className={styles.card} style={{borderLeftColor: '#305CDE'}}>
              <h3 className={styles.cardTitle} style={{fontSize: '1rem', color: '#6b7280'}}>Total Revenue</h3>
              <p style={{fontSize: '2.5rem', fontWeight: 'bold'}}>₹{stats.totalRevenue.toLocaleString()}</p>
          </div>
          <div className={styles.card} style={{borderLeftColor: '#10b981'}}>
              <h3 className={styles.cardTitle} style={{fontSize: '1rem', color: '#6b7280'}}>Total Orders</h3>
              <p style={{fontSize: '2.5rem', fontWeight: 'bold'}}>{stats.totalOrders}</p>
          </div>
          <div className={styles.card} style={{borderLeftColor: '#f59e0b'}}>
              <h3 className={styles.cardTitle} style={{fontSize: '1rem', color: '#6b7280'}}>Total Users</h3>
              <p style={{fontSize: '2.5rem', fontWeight: 'bold'}}>{stats.totalUsers}</p>
          </div>
           <div className={styles.card} style={{borderLeftColor: '#8b5cf6'}}>
              <h3 className={styles.cardTitle} style={{fontSize: '1rem', color: '#6b7280'}}>Total Products</h3>
              <p style={{fontSize: '2.5rem', fontWeight: 'bold'}}>{stats.totalProducts}</p>
          </div>
      </div>

      <h2 className={styles.heading} style={{fontSize: '1.5rem', borderBottom: 'none', marginBottom: '1rem'}}>Management</h2>
      <div className={styles.grid}>
        {/* ... (User Management Card remains same) */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>User Management</h2>
          <p>View all users, promote admins, or ban accounts.</p>
          <Link to="/admin/users" className={styles.cardLink}>Manage Users →</Link>
        </div>

        {/* ... (Product Moderation Card remains same) */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Product Moderation</h2>
          <p>Review new uploads and remove illegal content.</p>
          <Link to="/admin/products" className={styles.cardLink}>Manage Products →</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;