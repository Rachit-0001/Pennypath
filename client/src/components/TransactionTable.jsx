import { MdEdit, MdDelete } from 'react-icons/md';
import { format } from 'date-fns';
import useCurrency from '../hooks/useCurrency';

/**
 * Generic table for listing expenses or income entries.
 * `type` determines which field is used as the row's primary label
 * ("title" for expenses, "source" for income).
 */
const TransactionTable = ({ items, type = 'expense', onEdit, onDelete }) => {
  const { format: formatCurrency } = useCurrency();
  const labelKey = type === 'expense' ? 'title' : 'source';

  if (!items || items.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm font-medium text-gray-500">
          No {type === 'expense' ? 'expenses' : 'income entries'} found
        </p>
        <p className="mt-1 text-xs text-gray-400">Try adjusting your filters or add a new entry</p>
      </div>
    );
  }

  return (
    <div className="card overflow-x-auto p-0">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
            <th className="px-5 py-3 font-medium">{type === 'expense' ? 'Title' : 'Source'}</th>
            <th className="px-5 py-3 font-medium">Category</th>
            <th className="px-5 py-3 font-medium">Date</th>
            {type === 'expense' && <th className="px-5 py-3 font-medium">Payment</th>}
            <th className="px-5 py-3 text-right font-medium">Amount</th>
            <th className="px-5 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
              <td className="px-5 py-3.5">
                <p className="font-medium text-gray-900">{item[labelKey]}</p>
                {item.description && (
                  <p className="mt-0.5 max-w-xs truncate text-xs text-gray-400">{item.description}</p>
                )}
              </td>
              <td className="px-5 py-3.5">
                <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700">
                  {item.category}
                </span>
              </td>
              <td className="px-5 py-3.5 text-gray-500">{format(new Date(item.date), 'dd MMM yyyy')}</td>
              {type === 'expense' && <td className="px-5 py-3.5 text-gray-500">{item.paymentMethod}</td>}
              <td
                className={`px-5 py-3.5 text-right font-semibold ${
                  type === 'expense' ? 'text-danger-600' : 'text-primary-600'
                }`}
              >
                {type === 'expense' ? '-' : '+'}
                {formatCurrency(item.amount)}
              </td>
              <td className="px-5 py-3.5">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-primary-600"
                    aria-label="Edit"
                  >
                    <MdEdit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-danger-600"
                    aria-label="Delete"
                  >
                    <MdDelete size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
