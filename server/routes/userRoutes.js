const express = require('express');
const { body } = require('express-validator');
const {
  updateProfile,
  changePassword,
  addCategory,
  deleteCategory,
  setMonthlyBudget,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(protect); // all routes below require authentication

router.put(
  '/profile',
  [body('name').optional().trim().notEmpty().withMessage('Name cannot be empty')],
  validate,
  updateProfile
);

router.put(
  '/password',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters'),
  ],
  validate,
  changePassword
);

router.post(
  '/categories',
  [
    body('type').isIn(['expense', 'income']).withMessage('Type must be expense or income'),
    body('name').trim().notEmpty().withMessage('Category name is required'),
  ],
  validate,
  addCategory
);

router.delete('/categories/:type/:name', deleteCategory);

router.put(
  '/budget',
  [body('monthlyBudget').isFloat({ min: 0 }).withMessage('Budget must be a positive number')],
  validate,
  setMonthlyBudget
);

module.exports = router;
