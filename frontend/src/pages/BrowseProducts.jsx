import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios'; // ✅ CHANGED
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import styles from './BrowseProducts.module.css';

const BrowseProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ✅ Define fetchProducts outside useEffect for reuse
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
  }, []); // Runs once when the page loads

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>All Products</h1>

      <div className={styles.productGrid}>
        {products.map((product) => (
          <ProductCard 
            key={product._id} 
            product={product} 
            onProductClick={() => setSelectedProduct(product)} 
          />
        ))}
      </div>

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onReviewSuccess={fetchProducts}  
        />
      )}
    </div>
  );
};

export default BrowseProducts;