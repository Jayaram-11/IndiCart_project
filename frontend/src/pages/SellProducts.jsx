import React, { useState } from 'react';
import axiosInstance from '../api/axios'; // ✅ CHANGED
import { useAuth } from '../context/AuthContext';
import styles from './SellProducts.module.css';

const faqData = [
  // ... (faq data remains the same)
];

const SellProducts = () => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Ebooks'); // Default category
  const [coverPreview, setCoverPreview] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const { user } = useAuth();

  const wordCount = description.trim().split(/\s+/).filter(Boolean).length;

  const toggleFaq = (index) => setOpenFaqIndex(openFaqIndex === index ? null : index);

  const handleCoverImageChange = (event) => {
    // ... (function remains the same)
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData();
    formData.append('name', form.productName.value);
    formData.append('price', form.price.value);
    formData.append('category', category);
    formData.append('description', description);

    // NEW LOGIC: Conditionally append files
    if (category === 'Ebooks' || category === 'Templates') {
      formData.append('coverImage', form.coverImage.files[0]);
      formData.append('productFile', form.productFile.files[0]);
    } else { // For Art
      formData.append('productFile', form.productFile.files[0]);
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axiosInstance.post('/products', formData, config); // ✅ CHANGED

      alert('Your product has been submitted successfully!');
      form.reset();
      setCoverPreview(null);
      setDescription('');
    } catch (error) {
      alert('Error submitting product. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Start Selling Your Digital Products</h1>
      <p className={styles.subheading}>
        Upload your product file and cover image, set your price, and reach
        thousands of buyers instantly. No complicated setup, no delays—just
        simple, fast selling with instant UPI payments.
      </p>

      <div className={styles.formBox}>
        <form className={styles.form} onSubmit={handleFormSubmit}>
          {/* Product Name */}
          <div className={styles.formGroup}>
            <label htmlFor="productName">Product Name</label>
            <input type="text" id="productName" placeholder="e.g., Notion Templates" required />
          </div>

          {/* Price */}
          <div className={styles.formGroup}>
            <label htmlFor="price">Price (₹)</label>
            <input type="number" id="price" required />
          </div>

          {/* Category */}
          <div className={styles.formGroup}>
            <label htmlFor="category">Product Category</label>
            <select id="category" required value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Ebooks">Ebooks</option>
              <option value="Templates">Templates</option>
              <option value="Art">Art</option>
            </select>
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label htmlFor="description">Description (30–200 words)</label>
            <textarea id="description" required value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            <p className={styles.wordCount}>{wordCount} / 200 words</p>
          </div>

          {/* Conditional File Inputs */}
          {category === 'Ebooks' || category === 'Templates' ? (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="coverImage">Cover Page Image (JPG/PNG)</label>
                <input type="file" id="coverImage" accept="image/jpeg,image/png" required onChange={handleCoverImageChange} />
              </div>
              {coverPreview && (
                <div className={styles.filePreview}>
                  <img src={coverPreview} alt="Cover preview" className={styles.previewImage} />
                </div>
              )}
              <div className={styles.formGroup}>
                <label htmlFor="productFile">Actual Product File (PDF, ZIP, JPG, PNG)</label>
                <input type="file" id="productFile" accept=".pdf,.zip,.jpg,.jpeg,.png" required />
              </div>
            </>
          ) : (
            <div className={styles.formGroup}>
              <label htmlFor="productFile">Upload Your Art (JPG, PNG)</label>
              <input type="file" id="productFile" accept="image/jpeg,image/png" required />
            </div>
          )}

          <button type="submit" className={styles.submitButton}>Submit</button>
        </form>
      </div>

      {/* FAQ Section */}
      <div className={styles.faqSection}>
         {/* ... (FAQ section remains the same) ... */}
      </div>
    </div>
  );
};

export default SellProducts;