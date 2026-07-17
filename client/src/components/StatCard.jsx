/**
 * Small metric card used across the Dashboard (income, expense, balance, budget).
 */
const StatCard = ({ title, value, icon: Icon, accent = 'primary', subtitle }) => {
  const accents = {
    primary: 'bg-primary-50 text-primary-600',
    danger: 'bg-danger-500/10 text-danger-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="card flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${accents[accent]}`}>
          <Icon size={22} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
