"use server"

import { revalidatePath } from "next/cache"

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL

export async function getAllProductsAction() {
  try {
    const res = await fetch(`${BASE}/api/products`, { cache: "no-store" })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    return Array.isArray(data) ? data : data?.products ?? []
  } catch (err) {
    console.error("[getAllProductsAction]", err)
    return []
  }
}

export async function deleteProductAction(productId: string) {
  try {
    const res = await fetch(`${BASE}/api/products/${productId}`, {
      method: "DELETE",
    })
    const data = await res.json()
    revalidatePath("/dashboard/admin/products")
    return data
  } catch (err: any) {
    return { error: err.message || "Delete failed" }
  }
}

export async function updateProductAction(
  productId: string,
  payload: {
    name?: string
    price?: number
    description?: string
    category?: string
    subcategory?: string
    stock?: number
    discount?: number
    imageUrls?: string[]
  }
) {
  try {
    const res = await fetch(`${BASE}/api/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    revalidatePath("/dashboard/admin/products")
    return data
  } catch (err: any) {
    return { error: err.message || "Update failed" }
  }
}
