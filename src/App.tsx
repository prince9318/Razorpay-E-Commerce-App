import { Link, Route, Routes, useLocation } from "react-router-dom"
import Products from "./pages/Products"
import Cart from "./pages/Cart"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Checkout from "./pages/Checkout"
import Orders from "./pages/Orders"
import AdminProducts from "./pages/AdminProducts"
import AdminOrders from "./pages/AdminOrders"
import { useApp } from "./context/useApp"

function NavLink({ to, children, className = "" }: { to: string; children: React.ReactNode; className?: string }) {
  const location = useLocation()
  const isActive = location.pathname === to || (to !== "/" && location.pathname.startsWith(to))
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-sky-100 text-sky-700" : "text-gray-700 hover:bg-gray-100 hover:text-sky-600"} ${className}`}
    >
      {children}
    </Link>
  )
}

function App() {
  const { user, setUser, cart } = useApp()
  const location = useLocation()

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  const isActive = (path: string) =>
    location.pathname === path || (path !== "/" && location.pathname.startsWith(path))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <header className="sticky top-0 z-50 bg-white/98 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-14 sm:h-16">
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 bg-gradient-to-br from-sky-600 to-indigo-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent hidden sm:inline">SmartCart AI</span>
            </Link>

            <div className="flex items-center gap-1 sm:gap-2">
              <NavLink to="/">Products</NavLink>
              <Link
                to="/cart"
                className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive("/cart") ? "bg-sky-100 text-sky-700" : "text-gray-700 hover:bg-gray-100 hover:text-sky-600"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="hidden sm:inline">Cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 sm:top-0 sm:right-0 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-bold bg-sky-600 text-white rounded-full">
                    {cart.reduce((n, i) => n + i.quantity, 0)}
                  </span>
                )}
              </Link>
              {user ? (
                <>
                  <NavLink to="/orders" className="hidden sm:inline-flex">Orders</NavLink>
                  {user.role === "admin" && (
                    <>
                      <NavLink to="/admin/products" className="hidden md:inline-flex">Admin Products</NavLink>
                      <NavLink to="/admin/orders" className="hidden md:inline-flex">Admin Orders</NavLink>
                    </>
                  )}
                  <div className="flex items-center gap-2 pl-2 ml-1 sm:ml-2 sm:pl-3 border-l border-gray-200">
                    <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-sky-600 to-indigo-600 text-white flex items-center justify-center font-semibold text-sm shadow-md ring-2 ring-white">
                      {user.name.slice(0, 1).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-800 max-w-[120px] truncate hidden sm:block">{user.name}</span>
                    <button
                      onClick={logout}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-lg border-2 border-sky-600 text-sky-600 hover:bg-sky-50 font-medium text-sm transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 text-white hover:from-sky-700 hover:to-indigo-700 font-medium text-sm shadow-md hover:shadow-lg transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
