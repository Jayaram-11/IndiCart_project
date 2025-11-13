// indicart/routes/userRoutes.js (UPDATED FOR SSO + SECURE COOKIE LOGIN)

import express from 'express';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ --- TOKEN FUNCTION UPDATED ---
// Now includes fullName and email inside the payload
const generateToken = (id, fullName, email, role) => {
  return jwt.sign({ id, fullName, email, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};
// ✅ --- END TOKEN FUNCTION UPDATE ---

// =================== USER AUTH & PROFILE ===================

// @desc    Register new user
router.post('/register', async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ fullName, email, password, role: 'Buyer' });
    if (user) {
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.fullName, user.email, user.role),
      });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
});

// @desc    Login user (UPDATED FOR SECURE COOKIE)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // 1. Generate the token
      const token = generateToken(
        user._id,
        user.fullName,
        user.email,
        user.role
      );

      // 2. ✅ Set the token as a secure, cross-site cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // True on Render
        sameSite: 'none', // Required for cross-domain cookies
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      // 3. ✅ Send back user data *without* the token in the body
      res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
});

// @desc    Get user profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        walletBalance: user.walletBalance,
        mobile: user.mobile,
        upiId: user.upiId,
        bio: user.bio,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
});

// @desc    Update user profile / Upgrade to Seller
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.mobile = req.body.mobile || user.mobile;
      user.upiId = req.body.upiId || user.upiId;
      user.bio = req.body.bio || user.bio;

      if (user.mobile && user.upiId && user.bio) user.role = 'Seller';

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        role: updatedUser.role,
        token: generateToken(
          updatedUser._id,
          updatedUser.fullName,
          updatedUser.email,
          updatedUser.role
        ),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
});

// =================== ADMIN ROUTES ===================

// @desc    Get all users
router.get('/', protect, admin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Delete a user
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch {
    res.status(500).json({ message: 'Server Error' });
  }
});

// =================== ADMIN STATS ===================

router.get('/admin/stats', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalProducts = await Product.countDocuments({});
    const totalOrders = await Order.countDocuments({ status: 'Paid' });

    const revenueData = await Order.aggregate([
      { $match: { status: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    const adminUser = await User.findById(req.user._id);
    const adminEarnings = adminUser.walletBalance;

    res.json({ totalUsers, totalProducts, totalOrders, totalRevenue, adminEarnings });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// =================== WALLET & COMMISSION ===================

// @desc    Withdraw wallet balance (Seller/Admin)
router.post('/withdraw', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.walletBalance <= 0) {
      return res.status(400).json({ message: 'No funds to withdraw.' });
    }

    const amountWithdrawn = user.walletBalance;
    user.walletBalance = 0;
    await user.save();

    res.json({ message: `Withdrawal of ₹${amountWithdrawn} successful!`, newBalance: 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Admin - View all commission records
router.get('/admin/commissions', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({ status: 'Paid' })
      .sort({ createdAt: -1 })
      .populate('product', 'name')
      .populate('seller', 'fullName');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
