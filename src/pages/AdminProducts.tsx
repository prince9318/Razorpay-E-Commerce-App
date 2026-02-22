import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import { useApp } from "../context/useApp";

type Product = {
  _id?: string;
  title: string;
  price: number;
  description: string;
  image: string;
  stock: number;
};

export default function AdminProducts() {
  const { user } = useApp();
  const [items, setItems] = useState<Product[]>([]);
  const [form, setForm] = useState<Product>({
    title: "",
    price: 0,
    description: "",
    image: "",
    stock: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/products");
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async () => {
    if (!user || user.role !== "admin") return;
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, {
          title: form.title,
          price: form.price,
          description: form.description,
          image: form.image,
          stock: form.stock,
        });
      } else {
        await api.post("/products", form);
      }
      setForm({ title: "", price: 0, description: "", image: "", stock: 0 });
      setEditingId(null);
      await load();
    } finally {
      setSubmitting(false);
    }
  };

  const edit = (p: Product) => {
    setForm(p);
    setEditingId(p._id || null);
  };

  const cancelEdit = () => {
    setForm({ title: "", price: 0, description: "", image: "", stock: 0 });
    setEditingId(null);
  };

  const del = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    load();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Admin Products</h2>
        <p className="text-gray-600 mt-1">
          {editingId
            ? "Update the product below"
            : "Add new products or edit existing ones"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Add / Edit Product Form */}
        <div className="bg-white rounded-xl border-2 border-sky-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? "Edit Product" : "Add New Product"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Title
              </label>
              <input
                className="border-2 border-gray-300 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="e.g. Wireless Bluetooth Headphones"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  className="border-2 border-gray-300 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Add product price"
                  value={form.price || ""}
                  onChange={(e) =>
                    setForm({ ...form, price: Number(e.target.value) || 0 })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  min={0}
                  className="border-2 border-gray-300 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Add stock quantity"
                  value={form.stock || ""}
                  onChange={(e) =>
                    setForm({ ...form, stock: Number(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                className="border-2 border-gray-300 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="https://example.com/product-image.jpg"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
              {form.image && (
                <img
                  src={form.image}
                  alt="Preview"
                  className="mt-2 h-20 w-20 object-cover rounded-lg border-2 border-gray-200"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                className="border-2 border-gray-300 rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none"
                placeholder="Add product description (e.g. features, benefits)"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={submit}
                disabled={submitting}
                className="flex-1 bg-sky-600 text-white px-4 py-2.5 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting
                  ? "Saving..."
                  : editingId
                    ? "Update Product"
                    : "Add Product"}
              </button>
              {editingId && (
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Existing Products List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Existing Products ({items.length})
          </h3>
          {loading ? (
            <div className="bg-white rounded-xl border-2 border-sky-200 p-8 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-sky-200 border-t-sky-600" />
              <p className="mt-3 text-gray-600 text-sm">Loading products...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-xl border-2 border-sky-200 p-8 text-center text-gray-500">
              <p>No products yet. Add one using the form.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[calc(100vh-16rem)] overflow-y-auto pr-1">
              {items.map((p) => (
                <div
                  key={p._id}
                  className={`bg-white rounded-xl border-2 p-4 flex gap-4 shadow-sm hover:shadow-md transition-all ${
                    editingId === p._id
                      ? "border-sky-500 ring-2 ring-sky-200"
                      : "border-sky-200"
                  }`}
                >
                  <img
                    src={
                      p.image || "https://via.placeholder.com/80?text=No+Image"
                    }
                    alt={p.title}
                    className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-lg border-2 border-gray-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">
                      {p.title}
                    </div>
                    <div className="text-gray-600 text-sm mt-0.5">
                      ₹{p.price}
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      Stock: {p.stock}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                    <button
                      onClick={() => edit(p)}
                      className="text-sky-600 hover:bg-sky-50 px-3 py-1.5 rounded-lg font-medium text-sm border border-sky-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => del(p._id!)}
                      className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg font-medium text-sm border border-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
