import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js'; // ✅ Added import for Order model
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ================= Cloudinary Configuration =================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ================= Multer Setup =================
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ================= Helper Function =================
const uploadToCloudinary = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    uploadStream.end(fileBuffer);
  });
};

// ================= CREATE PRODUCT =================
router.post('/', protect, upload.any(), async (req, res) => {
  const { name, description, category, price } = req.body;
  const seller = req.user._id;

  try {
    const coverImageFile = req.files.find(f => f.fieldname === 'coverImage');
    const productFile = req.files.find(f => f.fieldname === 'productFile');

    // ===== Ebooks & Templates =====
    if (category === 'Ebooks' || category === 'Templates') {
      if (!coverImageFile || !productFile) {
        return res.status(400).json({ message: 'Both cover image and product file are required.' });
      }

      const [coverImageResult, productFileResult] = await Promise.all([
        uploadToCloudinary(coverImageFile.buffer, { folder: 'indicart_products' }),
        uploadToCloudinary(productFile.buffer, { folder: 'indicart_products' }),
      ]);

      const product = new Product({
        name,
        description,
        category,
        price,
        seller,
        coverImageUrl: coverImageResult.secure_url,
        productFileUrl: productFileResult.secure_url,
      });

      const createdProduct = await product.save();
      return res.status(201).json(createdProduct);
    }

    // ===== Art =====
    else if (category === 'Art') {
      if (!productFile) {
        return res.status(400).json({ message: 'Art file is required.' });
      }

      const watermarkOptions = {
        folder: 'indicart_products',
        transformation: [
          {
            overlay: { font_family: 'Arial', font_size: 50, text: 'IndiCart' },
            color: '#FFFFFF',
            opacity: 25,
            gravity: 'center',
          },
        ],
      };

      const [originalResult, watermarkedResult] = await Promise.all([
        uploadToCloudinary(productFile.buffer, { folder: 'indicart_products' }),
        uploadToCloudinary(productFile.buffer, watermarkOptions),
      ]);

      const product = new Product({
        name,
        description,
        category,
        price,
        seller,
        coverImageUrl: originalResult.secure_url,
        watermarkedImageUrl: watermarkedResult.secure_url,
        productFileUrl: originalResult.secure_url,
      });

      const createdProduct = await product.save();
      return res.status(201).json(createdProduct);
    }

    // ===== Invalid Category =====
    else {
      return res.status(400).json({ message: 'Invalid product category.' });
    }

  } catch (error) {
    console.error('❌ Error creating product:', error);
    res.status(500).json({ message: 'Server Error during product creation' });
  }
});

// ================= FETCH ALL PRODUCTS =================
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}).populate('seller', 'fullName');
    res.json(products);
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ✅ ================= SELLER PRODUCTS WITH SALES COUNT =================
router.get('/myproducts', protect, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id }).lean();

    for (const product of products) {
      product.salesCount = await Order.countDocuments({
        product: product._id,
        status: 'Paid'
      });
    }

    res.json(products);
  } catch (error) {
    console.error('❌ Error fetching seller products:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ================= FETCH SINGLE PRODUCT =================
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'fullName bio');
    if (product) res.json(product);
    else res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    console.error('❌ Error fetching product by ID:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ================= CREATE REVIEW =================
router.post('/:id/reviews', protect, async (req, res) => {
  const { rating } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed' });
      }

      const review = {
        user: req.user._id,
        rating: Number(rating),
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;

      // ✅ Calculate precise average and round to one decimal
      const averageRating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
      product.rating = Math.round(averageRating * 10) / 10;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('❌ Error creating review:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// ================= DELETE PRODUCT (ADMIN ONLY) =================
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
