import React, { useState } from 'react';
import styles from './SellProducts.module.css';

const faqData = [
  {
    question: 'How do payouts work?',
    answer: 'Once you make a sale, the payment is credited instantly to your registered UPI ID. No waiting for 3–7 days like on global platforms.',
  },
  {
    question: 'What products can I sell?',
    answer: 'You can sell any digital product such as resume templates, study notes, digital art, eBooks, design kits, notion templates, and more — as long as it’s original and follows our guidelines.',
  },
];

const SellProducts = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    alert('Your product has been submitted successfully!');
    event.target.reset();
    setFilePreview(null); // Clear the preview after submission
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Start Selling Your Digital Products in Minutes</h1>
      <p className={styles.subheading}>
        Upload your digital files, set your price, and reach thousands of buyers instantly. No complicated setup, no delays—just simple, fast selling with instant UPI payments.
      </p>

      <div className={styles.formBox}>
        <form className={styles.form} onSubmit={handleFormSubmit}>
          {/* ... other form groups ... */}
           <div className={styles.formGroup}>
            <label htmlFor="productName">Product Name</label>
            <input type="text" id="productName" placeholder="e.g., Notion Templates" required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="price">Price (₹)</label>
            <input type="number" id="price" required />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="category">Product Category</label>
            <select id="category" required>
              <option value="templates">Templates</option>
              <option value="art">Art</option>
              <option value="ebooks">Ebooks</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="fileUpload">Upload File (jpg, png, pdf)</label>
            <input type="file" id="fileUpload" accept=".jpg,.jpeg,.png,.pdf" required onChange={handleFileChange} />
          </div>

          {/* Conditionally render the preview box */}
          {filePreview && (
            <div className={styles.filePreview}>
              <img src={filePreview} alt="File preview" className={styles.previewImage} />
            </div>
          )}

          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </form>
      </div>

      <div className={styles.faqSection}>
        <h2 className={styles.faqHeading}>FAQ</h2>
        {faqData.map((faq, index) => (
          <div key={index} className={styles.faqItem}>
            <button onClick={() => toggleFaq(index)} className={styles.faqQuestion}>
              <span>{faq.question}</span>
              <span>{openFaqIndex === index ? '−' : '+'}</span>
            </button>
            <div className={`${styles.faqAnswer} ${openFaqIndex === index ? styles.open : ''}`}>
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellProducts;