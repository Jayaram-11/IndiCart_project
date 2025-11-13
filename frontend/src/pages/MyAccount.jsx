import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios'; // ✅ CHANGED
import { useAuth } from '../context/AuthContext';
import styles from './MyAccount.module.css';

const MyAccount = () => {
  const { user, login } = useAuth();
  const [myOrders, setMyOrders] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [adminCommissions, setAdminCommissions] = useState([]); // New state for admin

  // 1. Fetch Profile (Wallet)
  const fetchProfile = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axiosInstance.get('/users/profile', config); // ✅ CHANGED
        login({ ...data, token: user.token }); // Assuming login updates context
      } catch (error) { console.error(error); }
  };
  useEffect(() => { fetchProfile(); }, []);

  // 2. Fetch Orders (Buyers)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axiosInstance.get('/orders/myorders', config); // ✅ CHANGED
        setMyOrders(data);
      } catch (error) { console.error(error); }
    };
    fetchOrders();
  }, [user.token]);

  // 3. Fetch Products (Sellers)
  useEffect(() => {
    if (user.role === 'Seller') {
      const fetchMyProducts = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const { data } = await axiosInstance.get('/products/myproducts', config); // ✅ CHANGED
          setMyProducts(data);
        } catch (error) { console.error(error); }
      };
      fetchMyProducts();
    }
  }, [user.role, user.token]);

  // 4. NEW: Fetch Commissions (Admin)
  useEffect(() => {
    if (user.role === 'Admin') {
        const fetchCommissions = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axiosInstance.get('/users/admin/commissions', config); // ✅ CHANGED
                setAdminCommissions(data);
            } catch (error) { console.error(error); }
        };
        fetchCommissions();
    }
  }, [user.role, user.token]);

  // NEW: Handle Withdrawal
  const handleWithdraw = async () => {
      if (!window.confirm('Are you sure you want to withdraw your entire balance?')) return;
      try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const { data } = await axiosInstance.post('/users/withdraw', {}, config); // ✅ CHANGED
          alert(data.message);
          fetchProfile(); // Refresh wallet balance
      } catch (error) {
          alert(error.response?.data?.message || 'Withdrawal failed');
      }
  };

  const handleDownload = (fileUrl) => {
     window.open(fileUrl.replace('/upload/', '/upload/fl_attachment/'), '_self');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Welcome, {user.fullName.split(' ')[0]}</h1>

      {/* --- WALLET SECTION (Seller & Admin) --- */}
      {(user.role === 'Seller' || user.role === 'Admin') && (
        <div className={styles.section}>
            <div className={styles.walletCard}>
              <p className={styles.walletLabel}>
                 {user.role === 'Admin' ? 'Total Commission Earnings' : 'My Wallet Balance'}
              </p>
              <p className={styles.walletAmount}>₹{user.walletBalance?.toFixed(2) || 0}</p>
              <button 
                onClick={handleWithdraw} 
                style={{marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 'bold', border:'none', borderRadius:'0.25rem', backgroundColor: 'white', color: '#305CDE'}}
              >
                 Withdraw Funds
              </button>
            </div>
        </div>
      )}

      {/* --- ADMIN COMMISSION TABLE --- */}
      {user.role === 'Admin' && (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Commission History</h2>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead><tr><th>Date</th><th>Product</th><th>Seller</th><th>Sale Price</th><th>Commission (5%)</th></tr></thead>
                    <tbody>
                        {adminCommissions.map(order => (
                            <tr key={order._id}>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>{order.product?.name || 'N/A'}</td>
                                <td>{order.seller?.fullName || 'N/A'}</td>
                                <td>₹{order.amount}</td>
                                <td style={{color: '#10b981', fontWeight: 'bold'}}>+ ₹{order.commission?.toFixed(2) || 0}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {/* --- SELLER PRODUCT TABLE --- */}
      {user.role === 'Seller' && (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>My Listed Products</h2>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead><tr><th>Product Name</th><th>Price</th><th>Category</th><th>Sales</th></tr></thead>
                  <tbody>
                    {myProducts.map(product => (
                      <tr key={product._id}>
                        <td>{product.name}</td><td>₹{product.price}</td><td>{product.category}</td>
                        <td style={{fontWeight: 'bold', color: '#10b981'}}>{product.salesCount} sold</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </div>
      )}

      {/* --- BUYER ORDER TABLE --- */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>My Orders</h2>
        {myOrders.length === 0 ? <p>No orders yet.</p> : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead><tr><th>Product</th><th>Date</th><th>Amount</th><th>Action</th></tr></thead>
              <tbody>
                {myOrders.map(order => (
                  <tr key={order._id}>
                    <td>{order.product?.name || 'N/A'}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>₹{order.amount}</td>
                    <td>{order.product && <button className={styles.downloadBtn} onClick={() => handleDownload(order.product.productFileUrl)}>Download Again</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAccount;