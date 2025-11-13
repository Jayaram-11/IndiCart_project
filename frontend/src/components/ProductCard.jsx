import React from 'react';
import styles from './Product.module.css';

const ProductCard = ({ product, onProductClick }) => {
  // Use watermarked image ONLY for Art, otherwise use the cover image
  const displayImageUrl = product.category === 'Art' 
    ? product.watermarkedImageUrl 
    : product.coverImageUrl;

  return (
    // 1. MOVED onClick HERE: Now the whole card triggers the modal
    <div className={styles.card} onClick={() => onProductClick(product)}>
      <div className={styles.imageContainer}>
        <img
          src={displayImageUrl}
          alt={product.name}
          className={styles.image}
        />
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{product.name}</h3>
        <p className={styles.sellerName}>by {product.seller.fullName}</p>
        <div className={styles.cardFooter}>
          <p className={styles.price}>₹{product.price}</p>
          {/* ✅ UPDATED LINE: show rating with one decimal */}
          <p className={styles.rating}>Rating: {product.rating.toFixed(1)} ★</p>
        </div>
        {/* 2. UPDATED BUTTON: Explicitly opens modal and stops bubbling */}
        <button 
            className={styles.buyButton} 
            style={{marginTop: '1rem'}}
            onClick={(e) => {
                e.stopPropagation(); // Prevents double-triggering the card click
                onProductClick(product);
            }}
        >
            Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
