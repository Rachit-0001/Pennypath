import useCurrency from '../hooks/useCurrency';

/**
 * Visual progress bar showing spend vs limit, color-coded by how close
 * the user is to (or over) their budget.
 */
const BudgetProgressBar = ({ spent, limit, label }) => {
  const { format } = useCurrency();
  const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const isOver = spent > limit && limit > 0;

  let barColor = 'bg-primary-500';
  if (percent >= 90 && !isOver) barColor = 'bg-amber-500';
  if (isOver) barColor = 'bg-danger-500';

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className={`font-semibold ${isOver ? 'text-danger-600' : 'text-gray-600'}`}>
          {format(spent)} / {format(limit)}
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {isOver && (
        <p className="mt-1 text-xs font-medium text-danger-600">
          Over budget by {format(spent - limit)}
        </p>
      )}
    </div>
  );
};

export default BudgetProgressBar;
