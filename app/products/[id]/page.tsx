import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Check, Star, ShieldCheck, Truck } from "lucide-react"
import { serverFetch } from "@/lib/core/api"
import { ProductGallery } from "@/components/products/product-gallery"
import { AddToCartSection } from "@/components/products/add-to-cart-section"

// Helper to parse the multiline description into structured data
function parseDescription(description: string) {
  if (!description) return { specs: [], paragraphs: [] }

  const lines = description.split('\n').filter(line => line.trim() !== '')
  const specs: { key: string; value: string }[] = []
  const paragraphs: string[] = []

  lines.forEach(line => {
    const colonIndex = line.indexOf(':')
    if (colonIndex !== -1 && colonIndex < 30) { // arbitrary length check for keys
      const key = line.slice(0, colonIndex).trim()
      const value = line.slice(colonIndex + 1).trim()
      specs.push({ key, value })
    } else {
      paragraphs.push(line.trim())
    }
  })

  return { specs, paragraphs }
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let product: any = null

  try {
    // Attempt to fetch specific product first
    const data: any = await serverFetch(`/api/products/${id}`)
    product = data?.product || data

    // In case the endpoint returns an array or doesn't find it
    if (Array.isArray(product)) {
      product = product.find((p: any) =>
        (p._id?.$oid || p._id) === id
      ) || product[0]
    }

    // Fallback: If product wasn't found or API returned an error/empty, fetch all and filter
    if (!product || product.error || !product.name) {
      const allData: any = await serverFetch('/api/products');
      const allProducts = Array.isArray(allData) ? allData : allData.products || [];
      product = allProducts.find((p: any) => (p._id?.$oid || p._id) === id);
    }
  } catch (error) {
    console.error("Error fetching product details:", error)
  }

  if (!product || !product.name) {
    notFound()
  }

  const { specs, paragraphs } = parseDescription(product.description || '')

  // Price calculations
  const originalPrice = Number(product.price)
  const discount = product.discount ? Number(product.discount) : 0
  const finalPrice = discount > 0 ? originalPrice - (originalPrice * discount / 100) : originalPrice

  const allImages = product.imageUrls && product.imageUrls.length > 0 
    ? product.imageUrls 
    : (product.imageUrl ? [product.imageUrl] : [])

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {/* Breadcrumb / Back Navigation */}
        <Link 
          href="/products" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          
          {/* Left Column: Image Gallery */}
          <div className="w-full">
            <ProductGallery 
              images={allImages} 
              alt={product.name} 
              discount={product.discount} 
            />
          </div>

          {/* Right Column: Details */}
          <div className="flex flex-col justify-start">
            {product.category && (
              <div className="mb-4">
                <span className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wider">
                  {product.category} {product.subcategory ? `• ${product.subcategory}` : ''}
                </span>
              </div>
            )}

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              {product.name}
            </h1>

            {/* Price Section */}
            <div className="flex items-baseline gap-4 mb-6 pb-6 border-b border-border/60">
              <span className="text-4xl md:text-5xl font-black text-foreground">
                ${finalPrice.toFixed(2)}
              </span>
              {discount > 0 && (
                <span className="text-xl text-muted-foreground line-through font-medium">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Paragraph Description */}
            {paragraphs.length > 0 && (
              <div className="prose prose-zinc dark:prose-invert mb-8 text-muted-foreground">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}

            {/* Organized Specs Table */}
            {specs.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Product Specifications</h3>
                <div className="bg-secondary/20 border border-border/50 rounded-2xl overflow-hidden">
                  <dl className="divide-y divide-border/50">
                    {specs.map((spec, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center px-5 py-3 hover:bg-secondary/40 transition-colors"
                      >
                        <dt className="text-sm font-medium text-muted-foreground sm:w-1/3 mb-1 sm:mb-0">
                          {spec.key}
                        </dt>
                        <dd className="text-sm text-foreground font-medium sm:w-2/3">
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}

            {/* Stock & Action */}
            <AddToCartSection product={product} />

            {/* Badges / Guarantees */}
            <div className="grid grid-cols-2 gap-4 mt-10 pt-6 border-t border-border/60">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Truck className="w-5 h-5" />
                <span className="text-sm font-medium">Free & Fast Delivery</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-sm font-medium">Secure Checkout</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}
