import { useCallback, useEffect, useState } from "react"
import { api } from "../lib/api"
import { Link } from "react-router-dom"

type Order = {
  _id: string
  totalAmount: number
  orderStatus: string
  createdAt: string
  products?: { productId: string; quantity: number; price: number }[]
}

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  paid: "bg-emerald-100 text-emerald-800 border-emerald-200",
  failed: "bg-red-100 text-red-800 border-red-200",
  shipped: "bg-sky-100 text-sky-800 border-sky-200",
  delivered: "bg-green-100 text-green-800 border-green-200"
}

function StatusBadge({ status }: { status: string }) {
  const style = statusStyles[status] || "bg-gray-100 text-gray-800 border-gray-200"
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${style}`}>
      {status}
    </span>
  )
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get("/orders")
      setOrders(res.data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const itemCount = (o: Order) =>
    o.products?.reduce((sum, p) => sum + p.quantity, 0) ?? 0

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Your Orders</h2>
          <p className="text-gray-600 mt-1">View and track your order history</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-sky-200 text-sky-700 hover:bg-sky-50 font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Continue Shopping
        </Link>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="bg-white rounded-xl border-2 border-sky-200 p-12 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-sky-200 p-12 text-center">
          <svg className="mx-auto h-14 w-14 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="mt-4 text-gray-600 text-lg">No orders yet</p>
          <p className="text-gray-500 text-sm mt-1">When you place an order, it will show up here.</p>
          <Link
            to="/"
            className="inline-block mt-6 bg-sky-600 text-white px-6 py-2.5 rounded-lg hover:bg-sky-700 transition-colors font-medium"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o._id}
              className="bg-white rounded-xl border-2 border-sky-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Order info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-bold text-gray-900">Order #{o._id.slice(-6)}</span>
                    <StatusBadge status={o.orderStatus} />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="font-semibold text-gray-900 text-lg">₹{o.totalAmount}</span>
                    {o.products && (
                      <span className="text-gray-500">• {itemCount(o)} item(s)</span>
                    )}
                  </div>
                  <div className="text-gray-500 text-sm mt-1">
                    Placed on {new Date(o.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short"
                    })}
                  </div>
                </div>

                {/* Visual accent */}
                <div className="sm:border-l sm:pl-5 sm:ml-2 border-gray-200 flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-600 capitalize">{o.orderStatus}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
