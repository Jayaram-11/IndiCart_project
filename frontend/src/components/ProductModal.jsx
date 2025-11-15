import React, { useState } from 'react';
import styles from './Product.module.css';
import { FaLock, FaUnlock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios'; // ✅ CHANGED
import StarRating from './StarRating';

const ProductModal = ({ product, onClose, onReviewSuccess }) => {
  const { isLoggedIn, user } = useAuth();
  const [myRating, setMyRating] = useState(0);
  const [isPaid, setIsPaid] = useState(false);

  const handleRatingSubmit = async () => {
    if (myRating === 0) {
      alert('Please select a rating from 1 to 5.');
      return;
    }
    try {
      // ❌ const config = { headers: { Authorization: `Bearer ${user.token}` } }; // 👈 REMOVED
      await axiosInstance.post(
        `/products/${product._id}/reviews`,
        { rating: myRating }
        // ❌ config // 👈 REMOVED
      );
      alert('Thank you for your review!');
      onReviewSuccess();
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting review.');
    }
  };

  const handleBuyNow = async () => {
    if (!isLoggedIn) {
      alert('Please login to purchase this product.');
      return;
    }
    try {
      // ❌ const config = { headers: { Authorization: `Bearer ${user.token}` } }; // 👈 REMOVED
      // 1. Create Order
      const { data: order } = await axiosInstance.post(
        '/orders/create-razorpay-order',
        { productId: product._id }
        // ❌ config // 👈 REMOVED
      );

      // 2. Configure Razorpay
      const options = {
        key: "rzp_test_RasgywNTJDHdiQ", // REPLACE WITH YOUR ACTUAL KEY ID
        amount: order.amount,
        currency: order.currency,
        name: "IndiCart",
        description: `Purchase ${product.name}`,
        order_id: order.id,
        handler: async function (response) {
          // 3. Verify Payment
          try {
            await axiosInstance.post(
              '/orders/verify-payment',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                productId: product._id,
              }
              // ❌ config // 👈 REMOVED
            );
            alert('Payment Successful!');
            setIsPaid(true); // Unlock download button
          } catch (error) {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.fullName,
          email: user.email,
          contact: user.mobile,
        },
        theme: { color: "#305CDE" },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error(error);
      alert('Error initiating payment.');
    }
  };

  // ✅ Final Download Handler
  const handleDownload = () => {
    const downloadUrl = product.productFileUrl.replace('/upload/', '/upload/fl_attachment/');
    window.open(downloadUrl, '_self');
  };

  if (!product) return null;

  const displayImageUrl = product.category === 'Art'
    ? product.watermarkedImageUrl
    : product.coverImageUrl;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <div className={styles.imageContainer}>
          <img src={displayImageUrl} alt={product.name} className={styles.modalImage} />
        </div>
        <h2 className={styles.cardTitle} style={{ marginTop: '1rem' }}>{product.name}</h2>
        <p><strong>Creator:</strong> {product.seller.fullName}</p>
        <p><strong>About Creator:</strong> {product.seller.bio}</p>
        <hr style={{ margin: '1rem 0' }} />
        <p><strong>Description:</strong></p>
        <p style={{ whiteSpace: 'pre-wrap' }}>{product.description}</p>

        {/* RATING SECTION */}
        {isLoggedIn && (
          <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
            <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Leave a Rating</h3>
            <StarRating rating={myRating} setRating={setMyRating} />
            <button
              onClick={handleRatingSubmit}
              className={styles.buyButton}
              style={{ marginTop: '1rem', width: 'auto', padding: '0.5rem 1.5rem' }}
            >
              Submit Rating
            </button>
          </div>
        )}

        {/* BUY / DOWNLOAD SECTION */}
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {!isPaid ? (
            <>
              <button className={styles.buyButton} onClick={handleBuyNow}>
                Buy Now for ₹{product.price}
              </button>
              <button className={styles.downloadButton} disabled>
                <FaLock /> <span>Download (locked)</span>
              </button>
              <p className={styles.downloadNote}>Pay via UPI to unlock instant download</p>
            </>
          ) : (
            <button
              className={styles.buyButton}
              style={{ backgroundColor: '#305CDE', color: 'white' }}
              onClick={handleDownload}
            >
              <FaUnlock /> <span style={{ marginLeft: '8px' }}>Download Now</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;