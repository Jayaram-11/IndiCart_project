import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    // Delete EVERYTHING from these collections
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('🔥🔥🔥 Data Destroyed! Database is completely empty. 🔥🔥🔥');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

// Check if the user passed a command line argument '-d'
if (process.argv[2] === '-d') {
  destroyData();
} else {
  console.log('To wipe data, run: npm run data:destroy');
  process.exit();
}