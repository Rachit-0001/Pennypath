import { useEffect, useState, useCallback } from 'react';
import { MdAdd, MdSearch } from 'react-icons/md';
import toast from 'react-hot-toast';
import incomeService from '../services/incomeService';
import useAuth from '../hooks/useAuth';
import useDebounce from '../hooks/useDebounce';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import IncomeForm from '../components/IncomeForm';
import TransactionTable from '../components/TransactionTable';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';

const Income = () => {
  const { user } = useAuth();
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const debouncedSearch = useDebounce(search);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchIncomes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await incomeService.getIncomes({
        page,
        limit: 10,
        search: debouncedSearch || undefined,
        category: category || undefined,
      });
      setIncomes(res.incomes);
      setPages(res.pages);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load income entries');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, category]);

  useEffect(() => {
    fetchIncomes();
  }, [fetchIncomes]);

  const openAddModal = () => {
    setEditingIncome(null);
    setModalOpen(true);
  };

  const openEditModal = (income) => {
    setEditingIncome(income);
    setModalOpen(true);
  };

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editingIncome) {
        await incomeService.updateIncome(editingIncome._id, data);
        toast.success('Income updated successfully');
      } else {
        await incomeService.createIncome(data);
        toast.success('Income added successfully');
      }
      setModalOpen(false);
      fetchIncomes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await incomeService.deleteIncome(deleteTarget._id);
      toast.success('Income deleted');
      setDeleteTarget(null);
      fetchIncomes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete income');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Income</h1>
          <p className="text-sm text-gray-500">Track and manage all your income sources</p>
        </div>
        <button onClick={openAddModal} className="btn-primary">
          <MdAdd size={20} /> Add Income
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
            placeholder="Search income..."
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
          {(user?.categories?.income || []).map((c) => (
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
            items={incomes}
            type="income"
            onEdit={openEditModal}
            onDelete={setDeleteTarget}
          />
          <Pagination page={page} pages={pages} onPageChange={setPage} />
        </>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingIncome ? 'Edit Income' : 'Add Income'}
      >
        <IncomeForm
          initialData={editingIncome}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          submitting={submitting}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Income"
        message={`Are you sure you want to delete "${deleteTarget?.source}"? This action cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
};

export default Income;
