const mongoose = require('mongoose');

// A Budget document represents one user's spending limit for a
// specific month/year, optionally broken down by category.
const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    month: {
      type: Number, // 1-12
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    totalLimit: {
      type: Number,
      required: [true, 'Total budget limit is required'],
      min: [0, 'Budget cannot be negative'],
    },
    categoryLimits: [
      {
        category: { type: String, required: true },
        limit: { type: Number, required: true, min: 0 },
      },
    ],
  },
  { timestamps: true }
);

// A user can only have one budget document per month/year
budgetSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
