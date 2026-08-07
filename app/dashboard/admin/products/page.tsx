import Link from "next/link"
import { ArrowLeft, Plus, Package } from "lucide-react"
import { getAllProductsAction } from "@/app/dashboard/admin/products/actions"
import { ProductsTable } from "@/components/admin/ProductsTable"

export const dynamic = "force-dynamic"

export default async function AdminProductsPage() {
  const products = await getAllProductsAction()

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <div className="border-b border-border/40 bg-background sticky top-16 z-10">
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/admin"
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-foreground/60"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-foreground/60" />
                <h1 className="text-lg font-semibold tracking-tight">All Products</h1>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {products.length} product{products.length !== 1 ? "s" : ""} in your catalog
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/admin/products/add"
            id="add-product-btn"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Product
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8">
        <ProductsTable initialProducts={products} />
      </div>
    </main>
  )
}
