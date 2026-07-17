import api from './api';

const getDashboardSummary = (month, year) =>
  api.get('/reports/dashboard', { params: { month, year } }).then((res) => res.data);
const getMonthlyTrend = (year) =>
  api.get('/reports/trend', { params: { year } }).then((res) => res.data);
const getCategoryBreakdown = (type, startDate, endDate) =>
  api
    .get('/reports/category-breakdown', { params: { type, startDate, endDate } })
    .then((res) => res.data);

export default { getDashboardSummary, getMonthlyTrend, getCategoryBreakdown };
