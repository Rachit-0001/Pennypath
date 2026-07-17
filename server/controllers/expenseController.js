const asyncHandler = require('express-async-handler');
const Expense = require('../models/Expense');

// @desc    Get all expenses for logged in user (supports filtering & pagination)
// @route   GET /api/expenses
// @access  Private
const getExpenses = asyncHandler(async (req, res) => {
  const { category, startDate, endDate, search, page = 1, limit = 20, sort = '-date' } = req.query;

  const query = { user: req.user._id };

  if (category) query.category = category;

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(parseInt(page, 10), 1);
  const limitNum = Math.min(parseInt(limit, 10) || 20, 100);
  const skip = (pageNum - 1) * limitNum;

  const [expenses, total] = await Promise.all([
    Expense.find(query).sort(sort).skip(skip).limit(limitNum),
    Expense.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: expenses.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    expenses,
  });
});

// @desc    Get a single expense
// @route   GET /api/expenses/:id
// @access  Private
const getExpenseById = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });

  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }

  res.status(200).json({ success: true, expense });
});

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private
const createExpense = asyncHandler(async (req, res) => {
  const { title, amount, category, description, paymentMethod, date } = req.body;

  const expense = await Expense.create({
    user: req.user._id,
    title,
    amount,
    category,
    description,
    paymentMethod,
    date: date || Date.now(),
  });

  res.status(201).json({
    success: true,
    message: 'Expense added successfully',
    expense,
  });
});

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = asyncHandler(async (req, res) => {
  let expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });

  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }

  expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Expense updated successfully',
    expense,
  });
});

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });

  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }

  await expense.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Expense deleted successfully',
  });
});

module.exports = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
};
