const express = require('express');
const { body } = require('express-validator');
const {
  getBudget,
  setBudget,
  deleteBudget,
  getBudgetHistory,
} = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getBudget);
router.get('/history', getBudgetHistory);

router.post(
  '/',
  [
    body('month').isInt({ min: 1, max: 12 }).withMessage('Month must be between 1 and 12'),
    body('year').isInt({ min: 2000 }).withMessage('Year is invalid'),
    body('totalLimit').isFloat({ min: 0 }).withMessage('Total limit must be a positive number'),
  ],
  validate,
  setBudget
);

router.delete('/:id', deleteBudget);

module.exports = router;
