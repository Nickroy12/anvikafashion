"use server"

import { serverMutation } from "@/lib/core/api"

export async function addProductAction(payload: {
  name: string
  price: number
  description: string
  category: string
  subcategory: string
  stock: number
  discount?: number
  imageUrls: string[]
}) {
  return serverMutation<{ error?: string; product?: unknown }>(
    "/api/products",
    payload
  )
}
