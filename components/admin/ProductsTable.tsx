"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Eye,
  Pencil,
  Trash2,
  X,
  Loader2,
  Check,
  AlertTriangle,
  Package,
  Upload,
  ImageIcon,
} from "lucide-react"
import Link from "next/link"
import { deleteProductAction, updateProductAction } from "@/app/dashboard/admin/products/actions"

interface Product {
  _id: string | { $oid: string }
  name: string
  price: number
  description?: string
  category?: string
  subcategory?: string
  stock?: number
  discount?: number
  imageUrls?: string[]
  imageUrl?: string
  createdAt?: string
}

function getProductId(product: Product): string {
  if (typeof product._id === "object" && product._id?.$oid) {
    return product._id.$oid
  }
  return product._id as string
}

// ── Delete Confirm Dialog ─────────────────────────────────────────────────────
function DeleteDialog({
  product,
  onClose,
  onConfirm,
  deleting,
}: {
  product: Product
  onClose: () => void
  onConfirm: () => void
  deleting: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-zinc-900 rounded-2xl border border-border/60 shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-red-100 dark:bg-red-950/50 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground">Delete Product</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">"{product.name}"</span>? This action
              cannot be undone.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 text-foreground/60" />
          </button>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2 rounded-lg border border-border/60 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            id={`confirm-delete-${getProductId(product)}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Edit Modal ────────────────────────────────────────────────────────────────
function EditModal({
  product,
  onClose,
  onSaved,
}: {
  product: Product
  onClose: () => void
  onSaved: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [imageUrls, setImageUrls] = useState<string[]>(
    product.imageUrls ?? (product.imageUrl ? [product.imageUrl] : [])
  )
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    product.imageUrls ?? (product.imageUrl ? [product.imageUrl] : [])
  )
  const [imageUploading, setImageUploading] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: product.name ?? "",
    price: String(product.price ?? ""),
    description: product.description ?? "",
    category: product.category ?? "clothing",
    subcategory: product.subcategory ?? "maxi-dresses",
    stock: String(product.stock ?? 0),
    discount: String(product.discount ?? ""),
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const validFiles = files.filter((f) => f.type.startsWith("image/") && f.size <= 10 * 1024 * 1024)
    if (!validFiles.length) { setImageError("Must be images under 10 MB."); return }
    setImageUploading(true)
    setImageError(null)
    const newPreviews = validFiles.map((f) => URL.createObjectURL(f))
    setImagePreviews((prev) => [...prev, ...newPreviews])
    try {
      const uploaded: string[] = []
      for (const file of validFiles) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve((reader.result as string).split(",")[1])
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
        const fp = new FormData()
        fp.append("key", process.env.NEXT_PUBLIC_IMGBB_API_KEY!)
        fp.append("image", base64)
        const res = await fetch("https://api.imgbb.com/1/upload", { method: "POST", body: fp })
        const json = await res.json()
        if (!json.success) throw new Error(json.error?.message || "ImgBB upload failed")
        uploaded.push(json.data.url)
      }
      setImageUrls((prev) => [...prev, ...uploaded])
    } catch (err: any) {
      setImageError(err.message || "Upload failed")
    } finally {
      setImageUploading(false)
    }
  }

  const removeImage = (i: number) => {
    setImageUrls((p) => p.filter((_, idx) => idx !== i))
    setImagePreviews((p) => p.filter((_, idx) => idx !== i))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result: any = await updateProductAction(getProductId(product), {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory,
        stock: parseInt(formData.stock, 10),
        discount: formData.discount ? parseFloat(formData.discount) : undefined,
        imageUrls,
      })
      // Backend returns { modifiedCount, matchedCount } on success, { error } on failure
      if (result?.error) {
        setError(result.error || "Update failed")
      } else {
        setSuccess(true)
        setTimeout(() => { onSaved(); onClose() }, 900)
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-zinc-900 rounded-2xl border border-border/60 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-zinc-900 border-b border-border/60 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <Package className="w-4 h-4 text-foreground/70" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Edit Product</h2>
              <p className="text-xs text-muted-foreground truncate max-w-xs">{product.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4 text-foreground/60" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/50 rounded-lg border border-red-200 dark:border-red-900">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg border border-emerald-200 dark:border-emerald-900 flex items-center gap-2">
              <Check className="w-4 h-4" />
              Product updated successfully!
            </div>
          )}

          {/* Name & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="edit-name" className="text-sm font-medium">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="edit-name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border/60 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="edit-price" className="text-sm font-medium">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="edit-price"
                name="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border/60 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor="edit-description" className="text-sm font-medium">Description</label>
            <textarea
              id="edit-description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border/60 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 text-sm resize-none"
            />
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="edit-category" className="text-sm font-medium">Category</label>
              <select
                id="edit-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border/60 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 text-sm appearance-none bg-white dark:bg-zinc-900"
              >
                <option value="clothing">Clothing</option>
                <option value="cosmetics-and-fashion-accessories">Cosmetics and fashion Accessories</option>
                <option value="shoes">Shoes</option>
                <option value="jewelry">Jewelry</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="edit-subcategory" className="text-sm font-medium">Subcategory</label>
              <select
                id="edit-subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border/60 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 text-sm appearance-none bg-white dark:bg-zinc-900"
              >
                {[
                  { value: "maxi-dresses", label: "Maxi Dresses" },
                  { value: "midi-dresses", label: "Midi Dresses" },
                  { value: "mini-dresses", label: "Mini Dresses" },
                  { value: "wrap-dresses", label: "Wrap Dresses" },
                  { value: "Saree", label: "Saree" },
                ].map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Stock & Discount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="edit-stock" className="text-sm font-medium">Stock</label>
              <input
                type="number"
                id="edit-stock"
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border/60 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="edit-discount" className="text-sm font-medium">Discount (%)</label>
              <input
                type="number"
                id="edit-discount"
                name="discount"
                min="0"
                max="100"
                step="0.01"
                value={formData.discount}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-3 py-2 border border-border/60 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 text-sm"
              />
            </div>
          </div>

          {/* Images */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Product Images</label>
            <input
              type="file"
              id="edit-image-input"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={handleImageChange}
            />
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden border border-border/60 bg-zinc-50 dark:bg-zinc-800 aspect-square">
                  <img src={src} alt={`img-${i}`} className="w-full h-full object-cover" />
                  {imageUploading && !imageUrls[i] && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label
                htmlFor="edit-image-input"
                className="flex flex-col items-center justify-center gap-1 border-2 border-dashed border-border/60 rounded-xl text-center hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer aspect-square"
              >
                <Upload className="w-4 h-4 text-foreground/50" />
                <span className="text-[10px] text-muted-foreground font-medium">Add</span>
              </label>
            </div>
            {imageError && <p className="text-xs text-red-500">{imageError}</p>}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 rounded-lg border border-border/60 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              id={`save-product-${getProductId(product)}`}
              disabled={isPending || imageUploading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Main Products Table ───────────────────────────────────────────────────────
export function ProductsTable({ initialProducts }: { initialProducts: Product[] }) {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const [editTarget, setEditTarget] = useState<Product | null>(null)

  // Filter
  const filtered = products.filter((p) => {
    const matchSearch =
      !search || p.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory =
      categoryFilter === "all" || p.category === categoryFilter
    return matchSearch && matchCategory
  })

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    setDeleteError(null)
    const result: any = await deleteProductAction(getProductId(deleteTarget))
    // Backend returns { deletedCount: 1 } on success, { error: string } on failure
    if (result?.error) {
      setDeleteError(result.error)
    } else {
      setProducts((prev) => prev.filter((p) => getProductId(p) !== getProductId(deleteTarget)))
      setDeleteTarget(null)
    }
    setDeleting(false)
  }

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))] as string[]

  const getStockBadge = (stock?: number) => {
    if (stock === undefined || stock === null) return null
    if (stock === 0)
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400">Out of stock</span>
    if (stock <= 5)
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">Low: {stock}</span>
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">{stock} in stock</span>
  }

  return (
    <>
      {/* Delete Dialog */}
      {deleteTarget && (
        <DeleteDialog
          product={deleteTarget}
          onClose={() => { setDeleteTarget(null); setDeleteError(null) }}
          onConfirm={handleDelete}
          deleting={deleting}
        />
      )}

      {/* Edit Modal */}
      {editTarget && (
        <EditModal
          product={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={() => router.refresh()}
        />
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          id="product-search"
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border border-border/60 rounded-lg bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400"
        />
        <select
          id="product-category-filter"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-border/60 rounded-lg bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400 appearance-none min-w-[140px]"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All Categories" : c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {deleteError && (
        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/50 rounded-lg border border-red-200 dark:border-red-900">
          {deleteError}
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-border/60 bg-white dark:bg-zinc-900 overflow-hidden">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-zinc-50 dark:bg-zinc-800/60">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Package className="w-8 h-8 opacity-40" />
                      <p className="text-sm font-medium">No products found</p>
                      <p className="text-xs opacity-70">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((product) => {
                  const id = getProductId(product)
                  const thumbnail =
                    product.imageUrls?.[0] ?? product.imageUrl ?? null
                  return (
                    <tr
                      key={id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors group"
                    >
                      {/* Product */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 border border-border/40">
                            {thumbnail ? (
                              <img
                                src={thumbnail}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-4 h-4 text-foreground/30" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate max-w-[200px]">
                              {product.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                              ID: {id.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-foreground capitalize">{product.category ?? "—"}</span>
                          {product.subcategory && (
                            <span className="text-xs text-muted-foreground capitalize">
                              {product.subcategory}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3">
                        <span className="font-semibold text-foreground">₹{Number(product.price).toLocaleString("en-IN")}</span>
                      </td>

                      {/* Stock */}
                      <td className="px-4 py-3">{getStockBadge(product.stock)}</td>

                      {/* Discount */}
                      <td className="px-4 py-3">
                        {product.discount ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400">
                            {product.discount}% OFF
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {/* View */}
                          <Link
                            href={`/products/${id}`}
                            id={`view-product-${id}`}
                            title="View product details"
                            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-foreground/60 hover:text-foreground"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {/* Edit */}
                          <button
                            id={`edit-product-${id}`}
                            title="Edit product"
                            onClick={() => setEditTarget(product)}
                            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-foreground/60 hover:text-foreground"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            id={`delete-product-${id}`}
                            title="Delete product"
                            onClick={() => setDeleteTarget(product)}
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-foreground/60 hover:text-red-600 dark:hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-border/40">
          {filtered.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-2 text-muted-foreground">
              <Package className="w-8 h-8 opacity-40" />
              <p className="text-sm font-medium">No products found</p>
            </div>
          ) : (
            filtered.map((product) => {
              const id = getProductId(product)
              const thumbnail = product.imageUrls?.[0] ?? product.imageUrl ?? null
              return (
                <div key={id} className="p-4 flex items-start gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 border border-border/40">
                    {thumbnail ? (
                      <img src={thumbnail} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground capitalize mt-0.5">
                      {product.category}{product.subcategory ? ` · ${product.subcategory}` : ""}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-sm font-bold text-foreground">₹{Number(product.price).toLocaleString("en-IN")}</span>
                      {getStockBadge(product.stock)}
                      {product.discount ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400">
                          {product.discount}% OFF
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <Link
                      href={`/products/${id}`}
                      className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-foreground/60 hover:text-foreground"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setEditTarget(product)}
                      className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-foreground/60 hover:text-foreground"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(product)}
                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-foreground/60 hover:text-red-600 dark:hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Footer count */}
      {filtered.length > 0 && (
        <p className="mt-3 text-xs text-muted-foreground text-right">
          Showing {filtered.length} of {products.length} products
        </p>
      )}
    </>
  )
}
