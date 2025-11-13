// src/pages/AdminUserList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom'; // ✅ Added
import styles from './AdminUserList.module.css';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const { user: userInfo } = useAuth(); // ✅ Auth context

  // ✅ Fetch all users
  const fetchUsers = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.get('http://localhost:5000/api/users', config);
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to load users.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Ban/Delete a user
  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to ban this user?')) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        await axios.delete(`http://localhost:5000/api/users/${id}`, config);
        fetchUsers(); // Refresh list
        alert('User has been banned/deleted.');
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting user');
      }
    }
  };

  return (
    <div className={styles.container}>
      {/* ✅ New Back Link */}
      <Link to="/admin/dashboard" className={styles.backLink}>
        ← Back to Dashboard
      </Link>

      <h1 className={styles.heading}>User Management</h1>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>ROLE</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id.substring(0, 10)}...</td>
              <td>{user.fullName}</td>
              <td>
                <a href={`mailto:${user.email}`}>{user.email}</a>
              </td>
              <td>
                <span
                  className={`${styles.roleBadge} ${
                    styles[user.role.toLowerCase()]
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td>
                {/* Prevent self-deletion */}
                {user._id !== userInfo._id && (
                  <button
                    className={styles.deleteButton}
                    onClick={() => deleteHandler(user._id)}
                  >
                    Ban User
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserList;
