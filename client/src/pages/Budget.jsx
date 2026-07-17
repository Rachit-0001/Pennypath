import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MdSave } from 'react-icons/md';
import budgetService from '../services/budgetService';
import useAuth from '../hooks/useAuth';
import BudgetProgressBar from '../components/BudgetProgressBar';
import Loader from '../components/Loader';
import useCurrency from '../hooks/useCurrency';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const Budget = () => {
  const { user } = useAuth();
  const { format } = useCurrency();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [totalLimit, setTotalLimit] = useState('');
  const [categoryLimits, setCategoryLimits] = useState([]);
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchBudget = async () => {
    setLoading(true);
    try {
      const res = await budgetService.getBudget(month, year);
      setBudgetData(res);
      setTotalLimit(res.budget.totalLimit || '');
      setCategoryLimits(
        res.budget.categoryLimits?.length
          ? res.budget.categoryLimits
          : (user?.categories?.expense || []).slice(0, 5).map((c) => ({ category: c, limit: 0 }))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load budget');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudget();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  const handleCategoryLimitChange = (index, value) => {
    setCategoryLimits((prev) =>
      prev.map((c, i) => (i === index ? { ...c, limit: Number(value) } : c))
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!totalLimit || Number(totalLimit) < 0) {
      toast.error('Enter a valid total budget limit');
      return;
    }
    setSaving(true);
    try {
      await budgetService.setBudget({
        month,
        year,
        totalLimit: Number(totalLimit),
        categoryLimits: categoryLimits.filter((c) => c.limit > 0),
      });
      toast.success('Budget saved successfully');
      fetchBudget();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save budget');
    } finally {
      setSaving(false);
    }
  };

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Monthly Budget</h1>
        <p className="text-sm text-gray-500">Plan and track your spending limits</p>
      </div>

      <div className="flex gap-3">
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="input-field w-44">
          {MONTH_NAMES.map((m, i) => (
            <option key={m} value={i + 1}>
              {m}
            </option>
          ))}
        </select>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="input-field w-28">
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <form onSubmit={handleSave} className="card space-y-5">
            <h2 className="text-base font-semibold text-gray-900">Set Budget Limits</h2>

            <div>
              <label className="label">Total Monthly Limit</label>
              <input
                type="number"
                step="0.01"
                value={totalLimit}
                onChange={(e) => setTotalLimit(e.target.value)}
                placeholder="0.00"
                className="input-field"
              />
            </div>

            <div className="space-y-3">
              <p className="label">Category Limits (optional)</p>
              {categoryLimits.map((c, i) => (
                <div key={c.category} className="flex items-center gap-3">
                  <span className="w-1/2 truncate text-sm text-gray-600">{c.category}</span>
                  <input
                    type="number"
                    step="0.01"
                    value={c.limit || ''}
                    onChange={(e) => handleCategoryLimitChange(i, e.target.value)}
                    placeholder="0.00"
                    className="input-field"
                  />
                </div>
              ))}
            </div>

            <button type="submit" className="btn-primary w-full" disabled={saving}>
              <MdSave size={18} /> {saving ? 'Saving...' : 'Save Budget'}
            </button>
          </form>

          <div className="card">
            <h2 className="mb-4 text-base font-semibold text-gray-900">Budget Overview</h2>
            {budgetData?.budget?.totalLimit > 0 ? (
              <div className="space-y-5">
                <BudgetProgressBar
                  spent={budgetData.totalSpent}
                  limit={budgetData.budget.totalLimit}
                  label="Overall Spending"
                />
                <div className="rounded-xl bg-gray-50 p-4 text-sm">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Total Budget</span>
                    <span className="font-medium text-gray-900">{format(budgetData.budget.totalLimit)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Total Spent</span>
                    <span className="font-medium text-gray-900">{format(budgetData.totalSpent)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">Remaining</span>
                    <span
                      className={`font-medium ${
                        budgetData.remaining < 0 ? 'text-danger-600' : 'text-primary-600'
                      }`}
                    >
                      {format(budgetData.remaining)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="py-10 text-center text-sm text-gray-400">
                No budget set for this month yet. Set a total limit to start tracking.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;
