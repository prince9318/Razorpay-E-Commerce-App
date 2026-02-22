import { useMemo, useEffect, useState } from "react";
import { useApp } from "../context/useApp";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import type { CartItem } from "../context/Context";

function ExpandableDescription({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 100;
  const shouldTruncate = description.length > maxLength;

  if (!shouldTruncate) {
    return <p className="text-gray-600 text-sm">{description}</p>;
  }

  return (
    <div className="text-gray-600 text-sm">
      <p>
        {expanded ? description : `${description.substring(0, maxLength)}...`}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sky-600 hover:text-sky-700 font-medium mt-1 text-xs"
      >
        {expanded ? "See less" : "See more"}
      </button>
    </div>
  );
}

function ImageModal({
  image,
  title,
  onClose,
}: {
  image: string;
  title: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl max-h-[95vh] w-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-2 z-10"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <img
          src={image}
          alt={title}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
        />
        <p className="text-white text-center mt-4 text-lg font-medium">
          {title}
        </p>
      </div>
    </div>
  );
}

export default function Cart() {
  const { cart, removeFromCart, updateQty, updateStock, updateCartItem } =
    useApp();
  const total = useMemo(
    () =>
      cart.reduce((sum: number, i: CartItem) => sum + i.price * i.quantity, 0),
    [cart],
  );
  const [selectedImage, setSelectedImage] = useState<{
    image: string;
    title: string;
  } | null>(null);

  // Fetch current stock and description for all cart items
  useEffect(() => {
    const fetchProductData = async () => {
      if (cart.length === 0) return;
      try {
        for (const item of cart) {
          const res = await api.get(`/products/${item.productId}`);
          // Update stock if changed
          if (res.data.stock !== item.stock) {
            updateStock(item.productId, res.data.stock);
          }
          // Update description if missing
          if (!item.description && res.data.description) {
            updateCartItem(item.productId, {
              description: res.data.description,
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      }
    };
    fetchProductData();
  }, [cart.length, updateStock, updateCartItem]);

  const handleQtyChange = (item: CartItem, newQty: number) => {
    // Limit quantity to available stock
    const maxQty = Math.min(newQty, item.stock);
    if (maxQty < 1 && item.stock > 0) {
      updateQty(item.productId, 1);
    } else if (maxQty >= 1) {
      updateQty(item.productId, maxQty);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Your Cart</h2>
        <Link
          to="/"
          className="text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Continue Shopping
        </Link>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white rounded-lg border-2 border-sky-200 p-12 text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-4"
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
          <div className="text-gray-600 text-lg mb-4">Your cart is empty</div>
          <Link
            to="/"
            className="inline-block bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition-colors font-medium"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg border-2 border-sky-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {cart.map((item: CartItem) => (
                <div
                  key={item.productId}
                  className="p-3 sm:p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image - Clickable */}
                    <div className="shrink-0">
                      <button
                        onClick={() =>
                          setSelectedImage({
                            image: item.image,
                            title: item.title,
                          })
                        }
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-20 w-20 sm:h-24 sm:w-24 object-cover rounded-lg border-2 border-gray-200"
                        />
                      </button>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">
                        {item.title}
                      </h3>
                      <div className="text-lg font-semibold text-gray-900 mb-2">
                        ₹{item.price}
                      </div>

                      {/* Description with See More */}
                      {item.description && (
                        <div className="mb-2">
                          <ExpandableDescription
                            description={item.description}
                          />
                        </div>
                      )}

                      {/* Stock Info */}
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded ${
                            item.stock > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.stock > 0
                            ? `Stock Available: ${item.stock}`
                            : "Out of Stock"}
                        </span>
                      </div>

                      {/* Quantity and Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex items-center gap-3">
                          <label className="text-sm font-medium text-gray-700">
                            Quantity:
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={item.stock}
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1;
                              handleQtyChange(item, val);
                            }}
                            disabled={item.stock === 0}
                            className="w-20 border-2 border-gray-300 rounded-lg px-3 py-2 text-center font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          {item.stock > 0 && (
                            <span className="text-xs text-gray-500">
                              (Max: {item.stock})
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-semibold text-gray-700">
                          Subtotal:{" "}
                          <span className="text-lg text-gray-900">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <div className="flex items-start">
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="bg-white rounded-lg border-2 border-sky-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  Total: <span className="text-sky-600">₹{total}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} item(s)
                  in cart
                </div>
              </div>
              <Link
                to="/checkout"
                className="bg-linear-to-r from-sky-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-sky-700 hover:to-blue-700 transition-all transform hover:scale-105 active:scale-95 font-semibold text-lg shadow-lg text-center"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          image={selectedImage.image}
          title={selectedImage.title}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}
