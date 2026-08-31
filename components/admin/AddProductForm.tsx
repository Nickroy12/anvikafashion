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
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
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
    discount: "",
  })
  const [hasDiscount, setHasDiscount] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // ── ImgBB Upload ──────────────────────────────────────────────────────────
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    // Validate type & size (max 10 MB for ImgBB free tier)
    const validFiles = files.filter(f => f.type.startsWith("image/") && f.size <= 10 * 1024 * 1024)
    if (validFiles.length !== files.length) {
      setImageError("Some files were rejected. Must be images under 10 MB.")
      if (validFiles.length === 0) return
    } else {
      setImageError(null)
    }

    setImageUploading(true)

    // Show local previews immediately
    const newPreviews = validFiles.map(f => URL.createObjectURL(f))
    setImagePreviews(prev => [...prev, ...newPreviews])

    try {
      const uploadedUrls: string[] = []

      for (const file of validFiles) {
        // Convert to base64
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve((reader.result as string).split(",")[1])
          reader.onerror = reject
          reader.readAsDataURL(file)
        })

        // Upload to ImgBB
        const formPayload = new FormData()
        formPayload.append("key", process.env.NEXT_PUBLIC_IMGBB_API_KEY!)
        formPayload.append("image", base64)

        const res = await fetch("https://api.imgbb.com/1/upload", {
          method: "POST",
          body: formPayload,
        })
        const json = await res.json()
        if (!json.success) throw new Error(json.error?.message || "ImgBB upload failed")

        uploadedUrls.push(json.data.url)
      }

      setImageUrls(prev => [...prev, ...uploadedUrls])
    } catch (err: any) {
      setImageError(err.message || "Image upload failed. Please try again.")
    } finally {
      setImageUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const clearImage = () => {
    setImageUrls([])
    setImagePreviews([])
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
        discount: hasDiscount && formData.discount ? parseFloat(formData.discount) : undefined,
        imageUrls,
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
        discount: "",
      })
      setHasDiscount(false)
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

            {/* Discount Toggle */}
            <div className="flex items-center justify-between p-4 border border-border/60 rounded-lg">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Discount</label>
                <p className="text-xs text-muted-foreground">Add a promotional discount to this product.</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={hasDiscount}
                onClick={() => setHasDiscount(!hasDiscount)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 ${hasDiscount ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-200 dark:bg-zinc-800'
                  }`}
              >
                <span className="sr-only">Toggle discount</span>
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white dark:bg-zinc-900 shadow ring-0 transition duration-200 ease-in-out ${hasDiscount ? 'translate-x-4' : 'translate-x-0'
                    }`}
                />
              </button>
            </div>

            {hasDiscount && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <label htmlFor="discount" className="text-sm font-medium">
                  Discount Value <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="discount"
                  name="discount"
                  required={hasDiscount}
                  min="0"
                  step="0.01"
                  value={formData.discount}
                  onChange={handleChange}
                  placeholder="e.g. 10 (amount or % depending on your logic)"
                  className="w-full px-3 py-2 border border-border/60 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 text-sm"
                />
              </div>
            )}

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
                  <option value="cosmetics-and-fashion-accessories">Cosmetics and fashion Accessories</option>
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
                  {[
                    { value: "maxi-dresses", label: "Maxi Dresses" },
                    { value: "midi-dresses", label: "Midi Dresses" },
                    { value: "mini-dresses", label: "Mini Dresses" },
                    { value: "wrap-dresses", label: "Wrap Dresses" },
                    { value: "Saree", label: "Saree" },
                    { value: "Bracelet", label: "Bracelet" },
                  ].map((sub) => (
                    <option key={sub.value} value={sub.value}>
                      {sub.label}
                    </option>
                  ))}
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
                Product Images
              </label>

              {/* Hidden real file input */}
              <input
                ref={fileInputRef}
                type="file"
                id="product-image-input"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={handleImageChange}
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => {
                  const isUploaded = imageUrls[index] !== undefined;

                  return (
                    <div key={index} className="relative rounded-xl overflow-hidden border border-border/60 bg-zinc-50 dark:bg-zinc-800 aspect-square">
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Uploading overlay */}
                      {!isUploaded && imageUploading && (
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 text-white animate-spin" />
                        </div>
                      )}

                      {/* Uploaded badge + remove */}
                      {!imageUploading && isUploaded && (
                        <div className="absolute top-1 left-1 flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                          <Check className="w-3 h-3" />
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors shadow-sm"
                        aria-label="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}

                {/* Drop zone / Add more */}
                <label
                  htmlFor="product-image-input"
                  className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border/60 rounded-xl p-4 text-center hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group aspect-square min-h-[150px]"
                >
                  <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 flex items-center justify-center transition-colors">
                    <Upload className="w-4 h-4 text-foreground/60" />
                  </div>
                  <div>
                    <p className="text-xs font-medium">Add Images</p>
                  </div>
                </label>
              </div>

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
