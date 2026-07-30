"use client"
import { authClient } from "../auth-client"

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL

const getClientAuthHeader = async (): Promise<Record<string, string>> => {
  const { data: session } = await authClient.getSession()
  const token = (session?.session as any)?.token
  return token ? { authorization: `Bearer ${token}` } : {}
}

/**
 * Client-side GET fetch to the backend.
 * Usage (client component):
 *   const products = await clientFetch("/api/products")
 */
export const clientFetch = async <T = unknown>(path: string): Promise<T> => {
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      headers: await getClientAuthHeader(),
    })
    return res.json() as Promise<T>
  } catch (error) {
    console.error(`[clientFetch] ${path}`, error)
    return {} as T
  }
}

/**
 * Client-side mutation (POST / PUT / PATCH / DELETE) to the backend.
 * Usage (client component):
 *   const result = await clientMutation("/api/products", data)
 *   const result = await clientMutation("/api/products/123", {}, "DELETE")
 */
export const clientMutation = async <T = unknown>(
  path: string,
  data: unknown = {},
  method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST"
): Promise<T> => {
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(await getClientAuthHeader()),
      },
      body: method !== "DELETE" ? JSON.stringify(data) : undefined,
    })
    return res.json() as Promise<T>
  } catch (error) {
    console.error(`[clientMutation] ${method} ${path}`, error)
    return {} as T
  }
}
