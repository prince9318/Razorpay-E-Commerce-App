type PaginationProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  itemLabel?: string;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  itemLabel = "items",
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const startItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border-2 border-sky-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-600">
        Showing <span className="font-semibold text-gray-900">{startItem}</span>
        {" "}to{" "}
        <span className="font-semibold text-gray-900">{endItem}</span>
        {" "}of{" "}
        <span className="font-semibold text-gray-900">{totalItems}</span> {itemLabel}
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded-lg border-2 border-sky-200 px-4 py-2 text-sm font-medium text-sky-700 transition-colors hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <span className="min-w-24 text-center text-sm font-semibold text-gray-900">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
