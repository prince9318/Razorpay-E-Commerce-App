import { useEffect, useMemo, useState } from "react"
import { Context } from "./Context"

type User = { id: string; name: string; email: string; role: "user" | "admin" } | null
type CartItem = { productId: string; title: string; price: number; image: string; quantity: number; stock: number; description: string }

function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("cart")
    if (saved) setCart(JSON.parse(saved))
    const token = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")
    if (token && savedUser) setUser(JSON.parse(savedUser))
  }, [])

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCart((prev) => {
      const found = prev.find((p) => p.productId === item.productId)
      if (found) {
        // Don't add if stock is insufficient
        if (found.quantity >= item.stock) return prev
        return prev.map((p) => (p.productId === item.productId ? { ...p, quantity: p.quantity + 1, stock: item.stock } : p))
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((p) => p.productId !== productId))
  }

  const updateQty = (productId: string, qty: number) => {
    setCart((prev) => {
      const item = prev.find((p) => p.productId === productId)
      if (!item) return prev
      // Limit quantity to available stock
      const maxQty = Math.min(qty, item.stock)
      if (maxQty < 1) return prev
      return prev.map((p) => (p.productId === productId ? { ...p, quantity: maxQty } : p))
    })
  }

  const updateStock = (productId: string, newStock: number) => {
    setCart((prev) => prev.map((p) => (p.productId === productId ? { ...p, stock: newStock, quantity: Math.min(p.quantity, newStock) } : p)))
  }

  const updateCartItem = (productId: string, updates: Partial<CartItem>) => {
    setCart((prev) => prev.map((p) => (p.productId === productId ? { ...p, ...updates } : p)))
  }

  const clearCart = () => setCart([])

  const value = useMemo(
    () => ({ user, setUser, cart, addToCart, removeFromCart, updateQty, clearCart, updateStock, updateCartItem }),
    [user, cart]
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export default AppProvider
