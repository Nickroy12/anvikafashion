"use client"

import { useRef, useState } from "react"
import { Package, Upload, Check, Loader2, ArrowLeft, X, ImageIcon } from "lucide-react"
import Link from "next/link"
import { addProductAction } from "@/app/dashboard/admin/products/add/actions"

export function AddProductForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Image upload state
  const [imageUrl, setImageUrl] = useState<string>("")
  const [imagePreview, setImagePreview] = useState<string>("")
  const [imageUploading, setImageUploading] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "clothing",
    subcategory: "maxi-dresses",
    stock: "0",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // ── ImgBB Upload ──────────────────────────────────────────────────────────
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate type & size (max 10 MB for ImgBB free tier)
    if (!file.type.startsWith("image/")) {
      setImageError("Please select a valid image file.")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setImageError("Image must be smaller than 10 MB.")
      return
    }

    setImageError(null)
    setImageUploading(true)
    setImageUrl("")
    setImagePreview("")

    try {
      // Convert to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const result = reader.result as string
          // Strip the data URL prefix
          resolve(result.split(",")[1])
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      // Show local preview immediately
      setImagePreview(URL.createObjectURL(file))

      // Upload to ImgBB
      const formPayload = new FormData()
      formPayload.append("key", process.env.NEXT_PUBLIC_IMGBB_API_KEY!)
      formPayload.append("image", base64)

      const res = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formPayload,
      })

      const json = await res.json()

      if (!json.success) {
        throw new Error(json.error?.message || "ImgBB upload failed")
      }

      setImageUrl(json.data.url)
    } catch (err: any) {
      setImageError(err.message || "Image upload failed. Please try again.")
      setImagePreview("")
    } finally {
      setImageUploading(false)
    }
  }

  const clearImage = () => {
    setImageUrl("")
    setImagePreview("")
    setImageError(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // ── Form Submit ───────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const data = await addProductAction({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        imageUrl,
      })

      if ((data as any).error) {
        throw new Error((data as any).error || "Failed to add product")
      }

      setSuccess(true)
      setFormData({
        name: "",
        price: "",
        description: "",
        category: "clothing",
        subcategory: "maxi-dresses",
        stock: "0",
      })
      clearImage()
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard/admin"
          className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-foreground/70"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Add New Product</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Create a new product listing in your catalog.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-white dark:bg-zinc-900 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/50 rounded-lg border border-red-200 dark:border-red-900">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg border border-emerald-200 dark:border-emerald-900 flex items-center gap-2">
              <Check className="w-4 h-4" />
              Product added successfully!
            </div>
          )}

          <div className="space-y-4">
            {/* Name & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Floral Summer Dress"
                  className="w-full px-3 py-2 border border-border/60 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="2450"
                  className="w-full px-3 py-2 border border-border/60 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 text-sm"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the product..."
                className="w-full px-3 py-2 border border-border/60 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 text-sm resize-none"
              />
            </div>

            {/* Category & Subcategory */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border/60 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 text-sm appearance-none"
                >
                  <option value="clothing">Clothing</option>
                  <option value="accessories">Accessories</option>
                  <option value="shoes">Shoes</option>
                  <option value="jewelry">Jewelry</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="subcategory" className="text-sm font-medium">
                  Subcategory
                </label>
                <select
                  id="subcategory"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border/60 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 text-sm appearance-none"
                >
                  <option value="maxi-dresses">Maxi Dresses</option>
                  <option value="midi-dresses">Midi Dresses</option>
                  <option value="mini-dresses">Mini Dresses</option>
                  <option value="wrap-dresses">Wrap Dresses</option>
                </select>
              </div>
            </div>

            {/* Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="stock" className="text-sm font-medium">
                  Initial Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border/60 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 text-sm"
                />
              </div>
            </div>

            {/* ── Image Upload via ImgBB ─────────────────────────────────── */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Product Image
              </label>

              {/* Hidden real file input */}
              <input
                ref={fileInputRef}
                type="file"
                id="product-image-input"
                accept="image/*"
                className="sr-only"
                onChange={handleImageChange}
              />

              {imagePreview ? (
                /* Preview state */
                <div className="relative rounded-xl overflow-hidden border border-border/60 bg-zinc-50 dark:bg-zinc-800">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="w-full h-48 object-cover"
                  />

                  {/* Uploading overlay */}
                  {imageUploading && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                      <p className="text-white text-xs font-medium">Uploading to ImgBB…</p>
                    </div>
                  )}

                  {/* Uploaded badge + remove */}
                  {!imageUploading && imageUrl && (
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                      <Check className="w-3 h-3" />
                      Uploaded
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Drop zone */
                <label
                  htmlFor="product-image-input"
                  className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border/60 rounded-xl p-8 text-center hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 flex items-center justify-center transition-colors">
                    <ImageIcon className="w-5 h-5 text-foreground/60" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Click to upload
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, GIF or WEBP — max 10 MB
                    </p>
                  </div>
                </label>
              )}

              {imageError && (
                <p className="text-xs text-red-500 mt-1">{imageError}</p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-border/60 flex justify-end gap-3">
            <Link
              href="/dashboard/admin"
              className="px-4 py-2 rounded-lg border border-border/60 bg-transparent text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || imageUploading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Package className="w-4 h-4" />
                  Save Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
