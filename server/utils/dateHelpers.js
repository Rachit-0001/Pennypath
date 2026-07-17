/**
 * Returns the start and end Date objects for a given month/year.
 * Used to build MongoDB range queries for monthly reports and budgets.
 * @param {number} month - 1-12
 * @param {number} year - e.g. 2026
 */
const getMonthRange = (month, year) => {
  const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999); // last day of month
  return { startDate, endDate };
};

module.exports = { getMonthRange };
