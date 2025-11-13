import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    // ✅ Role field includes 'Admin'
    role: {
      type: String,
      required: true,
      enum: ['Buyer', 'Seller', 'Admin'],
      default: 'Buyer',
    },
    // Optional seller-specific fields
    mobile: {
      type: String,
    },
    upiId: {
      type: String,
    },
    bio: {
      type: String,
    },
    // 💰 NEW FIELD: Wallet balance for user
    walletBalance: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// 🔒 Password hashing before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
