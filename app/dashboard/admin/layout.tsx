import { roleRequired } from "@/lib/core/sessions"
import React from "react"

/**
 * Admin-only layout. Only users with role="admin" can access.
 * Customers are redirected to /dashboard/customer.
 */
const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  await roleRequired("admin")
  return <>{children}</>
}

export default AdminLayout
