const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pages || Math.abs(p - page) <= 1
  );

  return (
    <div className="mt-4 flex items-center justify-center gap-1.5">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 disabled:opacity-40"
      >
        Prev
      </button>
      {pageNumbers.map((p, idx) => (
        <div key={p} className="flex items-center gap-1.5">
          {idx > 0 && pageNumbers[idx - 1] !== p - 1 && <span className="text-gray-400">...</span>}
          <button
            onClick={() => onPageChange(p)}
            className={`h-8 w-8 rounded-lg text-sm font-medium ${
              p === page ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {p}
          </button>
        </div>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
