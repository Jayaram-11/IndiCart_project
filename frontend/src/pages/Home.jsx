import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios'; // ✅ CHANGED
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import styles from './Home.module.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ✅ Define fetchProducts outside useEffect so it can be reused
  const fetchProducts = async () => {
    try {
      const { data } = await axiosInstance.get('/products'); // ✅ CHANGED
      // Get the 4 most recent products
      setProducts(data.slice(0, 4));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <div className={styles.container}>
        <h1 className={styles.heading}>
          Discover & Sell Digital Products Instantly
        </h1>
        <p className={styles.subheading}>
          Explore premium templates, planners, and resources created by talented individuals across India.
        </p>

        <div className={styles.productGrid}>
          {products.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              onProductClick={() => setSelectedProduct(product)}
            />
          ))}
        </div>
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

export default Home;