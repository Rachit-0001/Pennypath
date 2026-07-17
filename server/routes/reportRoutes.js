const express = require('express');
const {
  getDashboardSummary,
  getMonthlyTrend,
  getCategoryBreakdown,
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/dashboard', getDashboardSummary);
router.get('/trend', getMonthlyTrend);
router.get('/category-breakdown', getCategoryBreakdown);

module.exports = router;
