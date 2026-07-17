import { useEffect, useState } from 'react';
import { MdTrendingUp, MdTrendingDown, MdAccountBalanceWallet, MdSavings } from 'react-icons/md';
import toast from 'react-hot-toast';
import reportService from '../services/reportService';
import budgetService from '../services/budgetService';
import StatCard from '../components/StatCard';
import CategoryPieChart from '../components/CategoryPieChart';
import BudgetProgressBar from '../components/BudgetProgressBar';
import Loader from '../components/Loader';
import useCurrency from '../hooks/useCurrency';
import { format } from 'date-fns';

const Dashboard = () => {
  const { format: formatCurrency } = useCurrency();
  const [summary, setSummary] = useState(null);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);

  const now = new Date();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, budgetRes] = await Promise.all([
          reportService.getDashboardSummary(now.getMonth() + 1, now.getFullYear()),
          budgetService.getBudget(now.getMonth() + 1, now.getFullYear()),
        ]);
        setSummary(summaryRes);
        setBudget(budgetRes);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Overview for {format(now, 'MMMM yyyy')}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Income"
          value={formatCurrency(summary?.totalIncome)}
          icon={MdTrendingUp}
          accent="primary"
          subtitle={`${summary?.incomeCount || 0} entries`}
        />
        <StatCard
          title="Total Expense"
          value={formatCurrency(summary?.totalExpense)}
          icon={MdTrendingDown}
          accent="danger"
          subtitle={`${summary?.expenseCount || 0} entries`}
        />
        <StatCard
          title="Net Balance"
          value={formatCurrency(summary?.balance)}
          icon={MdAccountBalanceWallet}
          accent="blue"
        />
        <StatCard
          title="Monthly Budget"
          value={formatCurrency(budget?.budget?.totalLimit)}
          icon={MdSavings}
          accent="amber"
          subtitle={`${formatCurrency(budget?.remaining)} remaining`}
        />
      </div>

      {budget?.budget?.totalLimit > 0 && (
        <div className="card">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Budget Progress</h2>
          <BudgetProgressBar
            spent={budget.totalSpent}
            limit={budget.budget.totalLimit}
            label="Overall Spending"
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-2 text-base font-semibold text-gray-900">Spending by Category</h2>
          <CategoryPieChart data={summary?.categoryBreakdown} />
        </div>

        <div className="card">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Recent Expenses</h2>
          <div className="space-y-3">
            {summary?.recentExpenses?.length ? (
              summary.recentExpenses.map((e) => (
                <div key={e._id} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{e.title}</p>
                    <p className="text-xs text-gray-400">{e.category} &middot; {format(new Date(e.date), 'dd MMM')}</p>
                  </div>
                  <span className="text-sm font-semibold text-danger-600">-{formatCurrency(e.amount)}</span>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-sm text-gray-400">No expenses recorded yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
