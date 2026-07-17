const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Update user profile (name, currency, avatar)
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name ?? user.name;
  user.currency = req.body.currency ?? user.currency;
  user.avatar = req.body.avatar ?? user.avatar;

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: updatedUser,
  });
});

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.matchPassword(currentPassword))) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword; // hashed automatically via pre-save hook
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password updated successfully',
    token: generateToken(user._id),
  });
});

// @desc    Add a custom category
// @route   POST /api/users/categories
// @access  Private
const addCategory = asyncHandler(async (req, res) => {
  const { type, name } = req.body; // type: 'expense' | 'income'

  if (!['expense', 'income'].includes(type)) {
    res.status(400);
    throw new Error('Category type must be either "expense" or "income"');
  }

  const user = await User.findById(req.user._id);

  if (user.categories[type].includes(name)) {
    res.status(400);
    throw new Error('Category already exists');
  }

  user.categories[type].push(name);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Category added successfully',
    categories: user.categories,
  });
});

// @desc    Delete a custom category
// @route   DELETE /api/users/categories/:type/:name
// @access  Private
const deleteCategory = asyncHandler(async (req, res) => {
  const { type, name } = req.params;

  if (!['expense', 'income'].includes(type)) {
    res.status(400);
    throw new Error('Category type must be either "expense" or "income"');
  }

  const user = await User.findById(req.user._id);
  user.categories[type] = user.categories[type].filter((c) => c !== name);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully',
    categories: user.categories,
  });
});

// @desc    Set overall monthly budget default (used as fallback if no Budget doc exists)
// @route   PUT /api/users/budget
// @access  Private
const setMonthlyBudget = asyncHandler(async (req, res) => {
  const { monthlyBudget } = req.body;

  const user = await User.findById(req.user._id);
  user.monthlyBudget = monthlyBudget;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Monthly budget updated successfully',
    monthlyBudget: user.monthlyBudget,
  });
});

module.exports = {
  updateProfile,
  changePassword,
  addCategory,
  deleteCategory,
  setMonthlyBudget,
};
