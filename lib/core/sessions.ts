import "server-only"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

/** Returns the logged-in user object, or null if not authenticated. */
export const getUserSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return session?.user || null
}

/** Returns the raw session token string, or null if not authenticated. */
export const getUserToken = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return session?.session?.token || null
}

/**
 * Asserts the user is authenticated.
 * Redirects to /auth if there is no active session.
 */
export const authRequired = async () => {
  const user = await getUserSession()
  if (!user) {
    redirect("/auth")
  }
  return user
}

/**
 * Asserts the logged-in user has the required role.
 * - Not authenticated  → redirect to /auth
 * - Wrong role         → redirect to /unauthorized
 */
export const roleRequired = async (role: string) => {
  const user = await getUserSession()

  if (!user) {
    redirect("/auth")
  }

  if ((user as any).role !== role) {
    redirect("/unauthorized")
  }
}
