const express = require('express');
const { body } = require('express-validator');
const {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(protect);

const expenseValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('date').optional().isISO8601().withMessage('Date must be a valid date'),
];

router.route('/').get(getExpenses).post(expenseValidation, validate, createExpense);

router
  .route('/:id')
  .get(getExpenseById)
  .put(expenseValidation.map((v) => v.optional()), validate, updateExpense)
  .delete(deleteExpense);

module.exports = router;
