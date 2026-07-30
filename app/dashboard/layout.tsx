import { authRequired } from "@/lib/core/sessions"
import React from "react"

/**
 * Shared layout that guards all /dashboard/** routes.
 * Any unauthenticated request is redirected to /auth.
 */
const DashboardLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  await authRequired()
  return <>{children}</>
}

export default DashboardLayout
