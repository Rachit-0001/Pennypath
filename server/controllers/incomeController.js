const asyncHandler = require('express-async-handler');
const Income = require('../models/Income');

// @desc    Get all income entries for logged in user
// @route   GET /api/income
// @access  Private
const getIncomes = asyncHandler(async (req, res) => {
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
      { source: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(parseInt(page, 10), 1);
  const limitNum = Math.min(parseInt(limit, 10) || 20, 100);
  const skip = (pageNum - 1) * limitNum;

  const [incomes, total] = await Promise.all([
    Income.find(query).sort(sort).skip(skip).limit(limitNum),
    Income.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: incomes.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    incomes,
  });
});

// @desc    Get a single income entry
// @route   GET /api/income/:id
// @access  Private
const getIncomeById = asyncHandler(async (req, res) => {
  const income = await Income.findOne({ _id: req.params.id, user: req.user._id });

  if (!income) {
    res.status(404);
    throw new Error('Income entry not found');
  }

  res.status(200).json({ success: true, income });
});

// @desc    Create a new income entry
// @route   POST /api/income
// @access  Private
const createIncome = asyncHandler(async (req, res) => {
  const { source, amount, category, description, date } = req.body;

  const income = await Income.create({
    user: req.user._id,
    source,
    amount,
    category,
    description,
    date: date || Date.now(),
  });

  res.status(201).json({
    success: true,
    message: 'Income added successfully',
    income,
  });
});

// @desc    Update an income entry
// @route   PUT /api/income/:id
// @access  Private
const updateIncome = asyncHandler(async (req, res) => {
  let income = await Income.findOne({ _id: req.params.id, user: req.user._id });

  if (!income) {
    res.status(404);
    throw new Error('Income entry not found');
  }

  income = await Income.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Income updated successfully',
    income,
  });
});

// @desc    Delete an income entry
// @route   DELETE /api/income/:id
// @access  Private
const deleteIncome = asyncHandler(async (req, res) => {
  const income = await Income.findOne({ _id: req.params.id, user: req.user._id });

  if (!income) {
    res.status(404);
    throw new Error('Income entry not found');
  }

  await income.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Income deleted successfully',
  });
});

module.exports = {
  getIncomes,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome,
};
