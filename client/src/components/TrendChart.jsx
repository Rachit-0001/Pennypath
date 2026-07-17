import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import useCurrency from '../hooks/useCurrency';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Bar chart comparing monthly income vs expense across a year.
 * Expects trend: [{ month: 1-12, income, expense, net }]
 */
const TrendChart = ({ trend }) => {
  const { format } = useCurrency();

  const data = (trend || []).map((t) => ({
    ...t,
    label: MONTH_LABELS[t.month - 1],
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={70} />
        <Tooltip formatter={(value) => format(value)} />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
        <Bar dataKey="income" fill="#22a866" name="Income" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expense" fill="#ef4444" name="Expense" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TrendChart;
