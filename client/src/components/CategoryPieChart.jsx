import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useCurrency from '../hooks/useCurrency';

const COLORS = [
  '#22a866', '#158a52', '#48c583', '#7adca4', '#0f472f',
  '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
];

/**
 * Pie chart showing category-wise spending/income breakdown.
 * Expects data: [{ category, total }]
 */
const CategoryPieChart = ({ data }) => {
  const { format } = useCurrency();

  if (!data || data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center text-sm text-gray-400">
        No data available for this period
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="total"
          nameKey="category"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => format(value)} />
        <Legend wrapperStyle={{ fontSize: '12px' }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryPieChart;
