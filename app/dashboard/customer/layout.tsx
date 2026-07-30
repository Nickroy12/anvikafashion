import { roleRequired } from "@/lib/core/sessions"
import React from "react"

/**
 * Customer-only layout. Admins also pass through (super-user behaviour).
 * Unauthenticated users are redirected to /auth.
 */
const CustomerLayout = async ({ children }: { children: React.ReactNode }) => {
  await roleRequired("customer")
  return <>{children}</>
}

export default CustomerLayout
