import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import reportService from '../services/reportService';
import TrendChart from '../components/TrendChart';
import CategoryPieChart from '../components/CategoryPieChart';
import Loader from '../components/Loader';

const Reports = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [type, setType] = useState('expense');
  const [trend, setTrend] = useState([]);
  const [breakdown, setBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        const res = await reportService.getMonthlyTrend(year);
        setTrend(res.trend);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load trend data');
      }
    };
    fetchTrend();
  }, [year]);

  useEffect(() => {
    const fetchBreakdown = async () => {
      setLoading(true);
      try {
        const startDate = new Date(year, 0, 1).toISOString();
        const endDate = new Date(year, 11, 31, 23, 59, 59).toISOString();
        const res = await reportService.getCategoryBreakdown(type, startDate, endDate);
        setBreakdown(res.breakdown);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load breakdown');
      } finally {
        setLoading(false);
      }
    };
    fetchBreakdown();
  }, [type, year]);

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500">Visualize your financial trends</p>
        </div>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="input-field w-32">
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="card">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Income vs Expense - {year}</h2>
        <TrendChart trend={trend} />
      </div>

      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Category Breakdown</h2>
          <div className="flex rounded-lg border border-gray-200 p-1 text-sm">
            <button
              onClick={() => setType('expense')}
              className={`rounded-md px-3 py-1 font-medium transition ${
                type === 'expense' ? 'bg-primary-600 text-white' : 'text-gray-600'
              }`}
            >
              Expense
            </button>
            <button
              onClick={() => setType('income')}
              className={`rounded-md px-3 py-1 font-medium transition ${
                type === 'income' ? 'bg-primary-600 text-white' : 'text-gray-600'
              }`}
            >
              Income
            </button>
          </div>
        </div>
        {loading ? <Loader /> : <CategoryPieChart data={breakdown} />}
      </div>
    </div>
  );
};

export default Reports;
