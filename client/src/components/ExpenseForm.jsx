import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';

const PAYMENT_METHODS = ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Other'];

const emptyForm = {
  title: '',
  amount: '',
  category: '',
  description: '',
  paymentMethod: 'Cash',
  date: new Date().toISOString().slice(0, 10),
};

/**
 * Add/Edit form for a single expense. Used inside a Modal by the Expenses page.
 */
const ExpenseForm = ({ initialData, onSubmit, onCancel, submitting }) => {
  const { user } = useAuth();
  const categories = user?.categories?.expense || [];
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        amount: initialData.amount ?? '',
        category: initialData.category || '',
        description: initialData.description || '',
        paymentMethod: initialData.paymentMethod || 'Cash',
        date: initialData.date ? initialData.date.slice(0, 10) : emptyForm.date,
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.amount || Number(form.amount) <= 0) errs.amount = 'Enter a valid amount';
    if (!form.category) errs.category = 'Please select a category';
    if (!form.date) errs.date = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, amount: Number(form.amount) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Grocery shopping"
          className="input-field"
        />
        {errors.title && <p className="mt-1 text-xs text-danger-600">{errors.title}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Amount</label>
          <input
            type="number"
            step="0.01"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
            className="input-field"
          />
          {errors.amount && <p className="mt-1 text-xs text-danger-600">{errors.amount}</p>}
        </div>
        <div>
          <label className="label">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="input-field"
          />
          {errors.date && <p className="mt-1 text-xs text-danger-600">{errors.date}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-xs text-danger-600">{errors.category}</p>}
        </div>
        <div>
          <label className="label">Payment Method</label>
          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            className="input-field"
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label">Description (optional)</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={2}
          placeholder="Add a note..."
          className="input-field resize-none"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : initialData ? 'Update Expense' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
