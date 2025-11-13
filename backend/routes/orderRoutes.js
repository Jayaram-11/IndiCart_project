import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { protect } from '../middleware/authMiddleware.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create a Razorpay order
// @route   POST /api/orders/create-razorpay-order
// @access  Private
router.post('/create-razorpay-order', protect, async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const options = {
      amount: product.price * 100, // Razorpay uses paise
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating Razorpay order' });
  }
});

// @desc    Verify payment and update wallets
// @route   POST /api/orders/verify-payment
// @access  Private
router.post('/verify-payment', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, productId } = req.body;

    // 1️⃣ VERIFY SIGNATURE
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // 2️⃣ PAYMENT IS VALID - PROCESS ORDER
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // 3️⃣ Calculate commission (e.g., 5%)
    const adminCommission = product.price * 0.05;
    const sellerEarnings = product.price - adminCommission;

    // 4️⃣ Update wallets
    await User.findByIdAndUpdate(product.seller, {
      $inc: { walletBalance: sellerEarnings },
    });

    await User.findOneAndUpdate(
      { role: 'Admin' },
      { $inc: { walletBalance: adminCommission } }
    );

    // 5️⃣ Save order record
    const order = new Order({
      buyer: req.user._id,
      product: productId,
      seller: product.seller,
      amount: product.price,
      commission: adminCommission, // ✅ NEW FIELD
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: 'Paid',
    });

    await order.save();

    res.json({ message: 'Payment successful and order verified', orderId: order._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error verifying payment' });
  }
});

// ✅ NEW: Get logged-in user's orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id }).populate('product');
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

export default router;
