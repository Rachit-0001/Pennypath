const asyncHandler = require('express-async-handler');
const Budget = require('../models/Budget');
const Expense = require('../models/Expense');
const { getMonthRange } = require('../utils/dateHelpers');

// @desc    Get budget for a specific month/year (defaults to current month)
// @route   GET /api/budget?month=&year=
// @access  Private
const getBudget = asyncHandler(async (req, res) => {
  const now = new Date();
  const month = parseInt(req.query.month, 10) || now.getMonth() + 1;
  const year = parseInt(req.query.year, 10) || now.getFullYear();

  const budget = await Budget.findOne({ user: req.user._id, month, year });

  const { startDate, endDate } = getMonthRange(month, year);
  const spentAgg = await Expense.aggregate([
    {
      $match: {
        user: req.user._id,
        date: { $gte: startDate, $lte: endDate },
      },
    },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  const totalSpent = spentAgg[0]?.total || 0;

  res.status(200).json({
    success: true,
    budget: budget || { totalLimit: 0, categoryLimits: [], month, year },
    totalSpent,
    remaining: (budget?.totalLimit || 0) - totalSpent,
  });
});

// @desc    Create or update budget for a month/year (upsert)
// @route   POST /api/budget
// @access  Private
const setBudget = asyncHandler(async (req, res) => {
  const { month, year, totalLimit, categoryLimits } = req.body;

  const budget = await Budget.findOneAndUpdate(
    { user: req.user._id, month, year },
    { totalLimit, categoryLimits: categoryLimits || [] },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Budget saved successfully',
    budget,
  });
});

// @desc    Delete a budget for a month/year
// @route   DELETE /api/budget/:id
// @access  Private
const deleteBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findOne({ _id: req.params.id, user: req.user._id });

  if (!budget) {
    res.status(404);
    throw new Error('Budget not found');
  }

  await budget.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Budget deleted successfully',
  });
});

// @desc    Get all budget history for the user
// @route   GET /api/budget/history
// @access  Private
const getBudgetHistory = asyncHandler(async (req, res) => {
  const budgets = await Budget.find({ user: req.user._id }).sort({ year: -1, month: -1 });

  res.status(200).json({
    success: true,
    count: budgets.length,
    budgets,
  });
});

module.exports = { getBudget, setBudget, deleteBudget, getBudgetHistory };
