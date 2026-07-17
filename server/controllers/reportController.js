const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const Income = require('../models/Income');
const { getMonthRange } = require('../utils/dateHelpers');

// @desc    Dashboard summary: totals, recent transactions, category breakdown
// @route   GET /api/reports/dashboard?month=&year=
// @access  Private
const getDashboardSummary = asyncHandler(async (req, res) => {
  const now = new Date();
  const month = parseInt(req.query.month, 10) || now.getMonth() + 1;
  const year = parseInt(req.query.year, 10) || now.getFullYear();
  const { startDate, endDate } = getMonthRange(month, year);
  const userId = new mongoose.Types.ObjectId(req.user._id);

  const [expenseTotalAgg, incomeTotalAgg, categoryBreakdown, recentExpenses, recentIncomes] =
    await Promise.all([
      Expense.aggregate([
        { $match: { user: userId, date: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
      Income.aggregate([
        { $match: { user: userId, date: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
      Expense.aggregate([
        { $match: { user: userId, date: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
        { $sort: { total: -1 } },
      ]),
      Expense.find({ user: userId }).sort('-date').limit(5),
      Income.find({ user: userId }).sort('-date').limit(5),
    ]);

  const totalExpense = expenseTotalAgg[0]?.total || 0;
  const totalIncome = incomeTotalAgg[0]?.total || 0;

  res.status(200).json({
    success: true,
    month,
    year,
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    expenseCount: expenseTotalAgg[0]?.count || 0,
    incomeCount: incomeTotalAgg[0]?.count || 0,
    categoryBreakdown: categoryBreakdown.map((c) => ({ category: c._id, total: c.total })),
    recentExpenses,
    recentIncomes,
  });
});

// @desc    Monthly trend for a given year (income vs expense per month) - for line/bar charts
// @route   GET /api/reports/trend?year=
// @access  Private
const getMonthlyTrend = asyncHandler(async (req, res) => {
  const year = parseInt(req.query.year, 10) || new Date().getFullYear();
  const userId = new mongoose.Types.ObjectId(req.user._id);

  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

  const [expenseByMonth, incomeByMonth] = await Promise.all([
    Expense.aggregate([
      { $match: { user: userId, date: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: { $month: '$date' }, total: { $sum: '$amount' } } },
    ]),
    Income.aggregate([
      { $match: { user: userId, date: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: { $month: '$date' }, total: { $sum: '$amount' } } },
    ]),
  ]);

  // Build a 12-month array so the frontend chart always has consistent axes
  const trend = Array.from({ length: 12 }, (_, i) => {
    const monthNum = i + 1;
    const expense = expenseByMonth.find((e) => e._id === monthNum)?.total || 0;
    const income = incomeByMonth.find((e) => e._id === monthNum)?.total || 0;
    return { month: monthNum, income, expense, net: income - expense };
  });

  res.status(200).json({ success: true, year, trend });
});

// @desc    Category-wise breakdown for expenses or income within a date range - for pie charts
// @route   GET /api/reports/category-breakdown?type=expense&startDate=&endDate=
// @access  Private
const getCategoryBreakdown = asyncHandler(async (req, res) => {
  const { type = 'expense', startDate, endDate } = req.query;
  const Model = type === 'income' ? Income : Expense;
  const userId = new mongoose.Types.ObjectId(req.user._id);

  const match = { user: userId };
  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);
  }

  const breakdown = await Model.aggregate([
    { $match: match },
    { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    { $sort: { total: -1 } },
  ]);

  res.status(200).json({
    success: true,
    type,
    breakdown: breakdown.map((b) => ({ category: b._id, total: b.total, count: b.count })),
  });
});

module.exports = { getDashboardSummary, getMonthlyTrend, getCategoryBreakdown };
