const express = require('express');
const { body } = require('express-validator');
const {
  getIncomes,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome,
} = require('../controllers/incomeController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(protect);

const incomeValidation = [
  body('source').trim().notEmpty().withMessage('Source is required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than 0'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('date').optional().isISO8601().withMessage('Date must be a valid date'),
];

router.route('/').get(getIncomes).post(incomeValidation, validate, createIncome);

router
  .route('/:id')
  .get(getIncomeById)
  .put(incomeValidation.map((v) => v.optional()), validate, updateIncome)
  .delete(deleteIncome);

module.exports = router;
