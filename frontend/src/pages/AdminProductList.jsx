import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios'; // ✅ CHANGED
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import styles from './AdminProductList.module.css';

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const { user: userInfo } = useAuth();

  const fetchProducts = async () => {
    try {
      const { data } = await axiosInstance.get('/products'); // ✅ CHANGED
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axiosInstance.delete(`/products/${id}`, config); // ✅ CHANGED
        alert('Product deleted successfully');
        fetchProducts(); // Refresh list
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting product');
      }
    }
  };

  return (
    <div className={styles.container}>
      <Link to="/admin/dashboard" className={styles.backLink}>← Back to Dashboard</Link>
      <h1 className={styles.heading}>Product Moderation</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>IMAGE</th>
            <th>NAME</th>
            <th>PRICE</th>
            <th>CATEGORY</th>
            <th>SELLER</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>
                  <img src={product.coverImageUrl} alt={product.name} className={styles.productImage} />
              </td>
              <td>{product.name}</td>
              <td>₹{product.price}</td>
              <td>{product.category}</td>
              <td>{product.seller?.fullName || 'Unknown'}</td>
              <td>
                <button className={styles.deleteButton} onClick={() => deleteHandler(product._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProductList;