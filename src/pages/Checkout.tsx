import { useEffect, useMemo, useState } from "react";
import { useApp } from "../context/useApp";
import { api } from "../lib/api";
import axios from "axios";
import type { CartItem } from "../context/Context";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayCheckout;
  }
}

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => Promise<void> | void;
  theme?: { color?: string };
};

type RazorpayCheckout = {
  open: () => void;
};

async function loadRazorpay() {
  return new Promise<void>((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const { cart, clearCart } = useApp();
  const total = useMemo(
    () =>
      cart.reduce((sum: number, i: CartItem) => sum + i.price * i.quantity, 0),
    [cart],
  );
  const [processing, setProcessing] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setMsg("");
  }, [cart]);

  const pay = async () => {
    setProcessing(true);
    try {
      const products = cart.map((c: CartItem) => ({
        productId: c.productId,
        quantity: c.quantity,
        price: c.price,
      }));
      const orderRes = await api.post("/orders", {
        products,
        totalAmount: total,
      });
      await loadRazorpay();
      const createRes = await api.post("/payments/create-order", {
        amount: total,
        orderId: orderRes.data._id,
      });
      const options = {
        key: createRes.data.keyId,
        amount: createRes.data.amount,
        currency: createRes.data.currency,
        order_id: createRes.data.orderId,
        name: "SmartCart AI",
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          const verifyRes = await api.post("/payments/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: orderRes.data._id,
          });
          if (verifyRes.data.ok) {
            setMsg("Payment successful");
            clearCart();
            // Refresh page to update stock in products list
            setTimeout(() => {
              window.location.href = "/";
            }, 2000);
          }
        },
        theme: { color: "#2563eb" },
      } satisfies RazorpayOptions;
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setMsg(err.response?.data?.message || err.message || "Payment failed");
      } else {
        setMsg("Payment failed");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Checkout</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Payment Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border-2 border-sky-200 p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Order Summary
            </h3>
            <div className="space-y-3 mb-6">
              {cart.map((item: CartItem) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-600">
                    {item.title} × {item.quantity}
                  </span>
                  <span className="font-medium text-gray-900">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 mb-4">
              <div className="flex items-center justify-between text-xl font-bold text-gray-900">
                <span>Total:</span>
                <span className="text-sky-600">₹{total}</span>
              </div>
            </div>
            <button
              disabled={processing || total === 0}
              className="w-full bg-linear-to-r from-sky-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-sky-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] font-semibold text-lg shadow-lg"
              onClick={pay}
            >
              {processing ? "Processing..." : "Pay with Razorpay"}
            </button>
            {msg && (
              <div
                className={`mt-4 p-3 rounded-lg ${
                  msg.includes("successful")
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {msg}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Product Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border-2 border-sky-200 p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Order Items
            </h3>
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No items in cart</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item: CartItem) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    {/* Product Image */}
                    <div className="shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-20 w-20 sm:h-24 sm:w-24 object-cover rounded-lg border-2 border-gray-200"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>Quantity: {item.quantity}</span>
                        <span>•</span>
                        <span>₹{item.price} each</span>
                      </div>
                      <div className="mt-2 text-base font-semibold text-gray-900">
                        Subtotal: ₹{item.price * item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
