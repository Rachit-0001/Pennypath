import { useEffect, useState, useCallback } from 'react';
import { MdAdd, MdSearch } from 'react-icons/md';
import toast from 'react-hot-toast';
import expenseService from '../services/expenseService';
import useAuth from '../hooks/useAuth';
import useDebounce from '../hooks/useDebounce';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import ExpenseForm from '../components/ExpenseForm';
import TransactionTable from '../components/TransactionTable';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';

const Expenses = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const debouncedSearch = useDebounce(search);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await expenseService.getExpenses({
        page,
        limit: 10,
        search: debouncedSearch || undefined,
        category: category || undefined,
      });
      setExpenses(res.expenses);
      setPages(res.pages);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, category]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const openAddModal = () => {
    setEditingExpense(null);
    setModalOpen(true);
  };

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setModalOpen(true);
  };

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editingExpense) {
        await expenseService.updateExpense(editingExpense._id, data);
        toast.success('Expense updated successfully');
      } else {
        await expenseService.createExpense(data);
        toast.success('Expense added successfully');
      }
      setModalOpen(false);
      fetchExpenses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await expenseService.deleteExpense(deleteTarget._id);
      toast.success('Expense deleted');
      setDeleteTarget(null);
      fetchExpenses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete expense');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-sm text-gray-500">Track and manage all your expenses</p>
        </div>
        <button onClick={openAddModal} className="btn-primary">
          <MdAdd size={20} /> Add Expense
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search expenses..."
            className="input-field pl-9"
          />
        </div>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="input-field sm:w-56"
        >
          <option value="">All Categories</option>
          {(user?.categories?.expense || []).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <TransactionTable
            items={expenses}
            type="expense"
            onEdit={openEditModal}
            onDelete={setDeleteTarget}
          />
          <Pagination page={page} pages={pages} onPageChange={setPage} />
        </>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}
      >
        <ExpenseForm
          initialData={editingExpense}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          submitting={submitting}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Expense"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
};

export default Expenses;
