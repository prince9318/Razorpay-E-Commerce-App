import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import { useApp } from "../context/useApp";
import { Link } from "react-router-dom";

type Product = {
  _id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  stock: number;
};

function ExpandableDescription({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 55;
  const shouldTruncate = description.length > maxLength;

  if (!shouldTruncate) {
    return <p className="text-gray-600 text-xs leading-snug">{description}</p>;
  }

  return (
    <div className="text-gray-600 text-xs leading-snug">
      <p>
        {expanded ? description : `${description.substring(0, maxLength)}...`}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sky-600 hover:text-sky-700 font-medium mt-0.5 text-xs transition-colors"
      >
        {expanded ? "See less" : "See more"}
      </button>
    </div>
  );
}

export default function Products() {
  const [items, setItems] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToCart } = useApp();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/products", { params: q ? { q } : {} });
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-6 sm:py-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-linear-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 animate-fade-in">
          Discover Amazing Products
        </h1>
        <p className="text-gray-600 text-lg sm:text-xl">
          Shop the latest trends and best deals
        </p>
      </div>

      {/* Enhanced Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto">
        <div className="flex-1 relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400 group-focus-within:text-sky-600 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && load()}
            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-sm transition-all text-gray-900 placeholder-gray-400"
            placeholder="Search for products..."
          />
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="px-8 py-3.5 bg-linear-to-r from-sky-600 to-blue-600 text-white rounded-xl hover:from-sky-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all transform hover:scale-105 active:scale-95 shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Searching...</span>
            </>
          ) : (
            <>
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span>Search</span>
            </>
          )}
        </button>
      </div>

      {/* Products Grid */}
      {loading && items.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
          <p className="mt-4 text-gray-600 text-lg">Loading products...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-sky-200">
          <svg
            className="mx-auto h-20 w-20 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="mt-4 text-gray-600 text-xl font-medium">
            No products found
          </p>
          <p className="text-gray-500 mt-2">Try adjusting your search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((p, index) => (
            <div
              key={p._id}
              className="group bg-white rounded-2xl border-2 border-sky-200 overflow-hidden flex flex-col shadow-sm hover:shadow-xl hover:border-sky-400 transition-all duration-300 transform hover:-translate-y-1"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Product Image with Overlay - reduced height */}
              <div className="relative overflow-hidden bg-linear-to-br from-gray-50 to-gray-100 aspect-4/3">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Stock Badge */}
                <div className="absolute top-2 right-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold shadow ${
                      p.stock > 0
                        ? "bg-emerald-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {p.stock > 0 ? `${p.stock} left` : "Sold out"}
                  </span>
                </div>
                {/* Out of Stock Overlay */}
                {p.stock === 0 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info - compact */}
              <div className="p-3 flex flex-col flex-1">
                <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2 leading-tight group-hover:text-sky-600 transition-colors">
                  {p.title}
                </h3>
                <div className="mb-2 min-h-0">
                  <ExpandableDescription description={p.description} />
                </div>

                {/* Price */}
                <div className="flex items-center justify-between gap-2 mb-2 mt-auto">
                  <span className="text-lg font-bold bg-linear-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                    ₹{p.price}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      addToCart({
                        productId: p._id,
                        title: p.title,
                        price: p.price,
                        image: p.image,
                        stock: p.stock,
                        description: p.description,
                      })
                    }
                    disabled={p.stock === 0}
                    className="flex-1 bg-linear-to-r from-sky-600 to-blue-600 text-white py-2 px-3 rounded-lg font-semibold text-xs hover:from-sky-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow flex items-center justify-center gap-1.5"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add to Cart
                  </button>
                  <Link
                    to="/cart"
                    className="py-2 px-2.5 rounded-lg border-2 border-sky-200 text-sky-700 hover:bg-sky-50 hover:border-sky-300 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center shadow-sm"
                    aria-label="Go to cart"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
