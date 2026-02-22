import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";

type Order = {
  _id: string;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
  products?: { productId: string; quantity: number; price: number }[];
};

const statuses = ["pending", "paid", "failed", "shipped", "delivered"];

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  paid: "bg-emerald-100 text-emerald-800 border-emerald-200",
  failed: "bg-red-100 text-red-800 border-red-200",
  shipped: "bg-sky-100 text-sky-800 border-sky-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
};

function StatusBadge({ status }: { status: string }) {
  const style =
    statusStyles[status] || "bg-gray-100 text-gray-800 border-gray-200";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${style}`}
    >
      {status}
    </span>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders/all");
      setOrders(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const update = async (id: string, status: string) => {
    await api.put(`/orders/${id}/status`, { status });
    load();
  };

  const itemCount = (o: Order) =>
    o.products?.reduce((sum, p) => sum + p.quantity, 0) ?? 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Orders</h2>
          <p className="text-gray-600 mt-1">Manage and update order status</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-sky-200 text-sky-700 hover:bg-sky-50 font-medium transition-colors disabled:opacity-50"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="bg-white rounded-xl border-2 border-sky-200 p-12 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-sky-200 p-12 text-center">
          <svg
            className="mx-auto h-14 w-14 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="mt-4 text-gray-600 text-lg">No orders yet</p>
          <p className="text-gray-500 text-sm mt-1">
            Orders will appear here when customers checkout.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o._id}
              className="bg-white rounded-xl border-2 border-sky-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Left: Order info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-bold text-gray-900">
                      #{o._id.slice(-6)}
                    </span>
                    <StatusBadge status={o.orderStatus} />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <span className="font-semibold text-gray-900 text-lg">
                      ₹{o.totalAmount}
                    </span>
                    {o.products && (
                      <span className="text-gray-500">
                        • {itemCount(o)} item(s)
                      </span>
                    )}
                  </div>
                  <div className="text-gray-500 text-sm mt-1">
                    {new Date(o.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                </div>

                {/* Right: Status dropdown */}
                <div className="flex items-center gap-3 sm:shrink-0">
                  <label className="text-sm font-medium text-gray-700 hidden sm:block">
                    Status:
                  </label>
                  <select
                    className="border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 cursor-pointer min-w-35"
                    value={o.orderStatus}
                    onChange={(e) => update(o._id, e.target.value)}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
