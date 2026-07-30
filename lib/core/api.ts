import "server-only"
import { getUserToken } from "./sessions"

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL

export const authHeader = async (): Promise<Record<string, string>> => {
  const token = await getUserToken()
  return token ? { authorization: `Bearer ${token}` } : {}
}

/**
 * Server-side GET fetch to the backend.
 * Usage (server component / server action):
 *   const products = await serverFetch("/api/products")
 */
export const serverFetch = async <T = unknown>(path: string): Promise<T> => {
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      headers: await authHeader(),
    })
    return res.json() as Promise<T>
  } catch (error) {
    console.error(`[serverFetch] ${path}`, error)
    return {} as T
  }
}

/**
 * Server-side mutation (POST / PUT / PATCH / DELETE) to the backend.
 * Usage (server component / server action):
 *   const result = await serverMutation("/api/products", data)
 *   const result = await serverMutation("/api/products/123", {}, "DELETE")
 */
export const serverMutation = async <T = unknown>(
  path: string,
  data: unknown = {},
  method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST"
): Promise<T> => {
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(await authHeader()),
      },
      body: method !== "DELETE" ? JSON.stringify(data) : undefined,
    })
    return res.json() as Promise<T>
  } catch (error) {
    console.error(`[serverMutation] ${method} ${path}`, error)
    return {} as T
  }
}
