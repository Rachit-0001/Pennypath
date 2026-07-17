const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // never return password by default
    },
    avatar: {
      type: String,
      default: '',
    },
    currency: {
      type: String,
      default: 'INR', // ISO currency code, user-configurable in profile
    },
    monthlyBudget: {
      type: Number,
      default: 0,
      min: [0, 'Budget cannot be negative'],
    },
    categories: {
      expense: {
        type: [String],
        default: [],
      },
      income: {
        type: [String],
        default: [],
      },
    },
  },
  { timestamps: true }
);

// Hash password before saving whenever it is new or modified
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare plaintext password with hashed password
userSchema.methods.matchPassword = async function matchPassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Never leak password hash even if select('+password') was used elsewhere
userSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
