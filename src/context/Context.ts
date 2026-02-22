import { createContext } from "react"

type User = { id: string; name: string; email: string; role: "user" | "admin" } | null
export type CartItem = { productId: string; title: string; price: number; image: string; quantity: number; stock: number; description: string }

export type Ctx = {
  user: User
  setUser: (u: User) => void
  cart: CartItem[]
  addToCart: (item: Omit<CartItem, "quantity">) => void
  removeFromCart: (productId: string) => void
  updateQty: (productId: string, qty: number) => void
  clearCart: () => void
  updateStock: (productId: string, newStock: number) => void
  updateCartItem: (productId: string, updates: Partial<CartItem>) => void
}

export const Context = createContext<Ctx | undefined>(undefined)
