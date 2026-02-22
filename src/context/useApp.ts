import { useContext } from "react"
import { Context } from "./Context"
import type { Ctx } from "./Context"

export function useApp(): Ctx {
  const ctx = useContext(Context)
  if (!ctx) throw new Error("AppContext missing")
  return ctx
}
