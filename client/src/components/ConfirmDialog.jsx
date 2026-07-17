import Modal from './Modal';

/**
 * Reusable confirmation dialog for destructive actions (e.g. deleting
 * an expense, income entry, or budget).
 */
const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, loading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-sm">
      <p className="mb-6 text-sm text-gray-600">{message}</p>
      <div className="flex justify-end gap-3">
        <button className="btn-secondary" onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button className="btn-danger" onClick={onConfirm} disabled={loading}>
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
