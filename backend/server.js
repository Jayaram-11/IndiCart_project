// indicart/backend/server.js (FINAL FIX)

import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ --- THIS IS THE FIX ---
// We must be specific about which frontend URLs to trust.
// We get your live Vercel URL from the .env file
const corsOptions = {
  origin: [
    'http://localhost:5173', // Your local frontend
    process.env.FRONTEND_URL  // Your live Vercel URL
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions)); // ✅ Use the specific options
app.use(express.json());
// ❌ We no longer need the simple app.use(cors());
// ✅ --- END THE FIX ---


// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully!');
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Connect to DB
connectDB();

// Test Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});