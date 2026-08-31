import { ProductCard } from "@/components/ui/product-card";
import { serverFetch } from "@/lib/core/api";
import Link from "next/link";
import { Package } from "lucide-react";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount?: number;
  imageUrl?: string;
  imageUrls?: string[];
  category: string;
  subcategory?: string;
  createdAt?: string;
  stock?: number;
}

export type CollectionFilter =
  | { type: "all" }
  | { type: "category"; value: string }
  | { type: "subcategory"; value: string; parentCategory?: string }
  | { type: "new-arrivals" }
  | { type: "on-sale" }
  | { type: "collection"; slug: string };

interface CollectionPageProps {
  title: string;
  description?: string;
  filter: CollectionFilter;
  heroImage?: string;
  heroImageAlt?: string;
  badge?: string;
  breadcrumbs?: { name: string; href: string }[];
}

function applyFilter(products: Product[], filter: CollectionFilter): Product[] {
  switch (filter.type) {
    case "all":
      return products;

    case "category":
      return products.filter(
        (p) => p.category?.toLowerCase() === filter.value.toLowerCase()
      );

    case "subcategory":
      return products.filter((p) => {
        const subMatch =
          p.subcategory?.toLowerCase().replace(/\s+/g, "-") ===
          filter.value.toLowerCase().replace(/\s+/g, "-");
        const catMatch = filter.parentCategory
          ? p.category?.toLowerCase() === filter.parentCategory.toLowerCase()
          : true;
        return subMatch && catMatch;
      });

    case "new-arrivals":
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).getTime();
      return [...products]
        .filter((p) => {
          if (!p.createdAt) return false;
          return new Date(p.createdAt).getTime() >= twentyFourHoursAgo;
        })
        .sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });


    case "on-sale":
      return products.filter((p) => p.discount && Number(p.discount) > 0);

    case "collection":
      // Map slug → filter logic
      if (filter.slug === "summer") {
        return products.filter(
          (p) =>
            p.category?.toLowerCase() === "clothing" ||
            p.subcategory?.toLowerCase().includes("dress")
        );
      }
      return products;

    default:
      return products;
  }
}

export async function CollectionPage({
  title,
  description,
  filter,
  heroImage,
  heroImageAlt,
  badge,
  breadcrumbs,
}: CollectionPageProps) {
  let allProducts: Product[] = [];

  try {
    const data: any = await serverFetch("/api/products");
    allProducts = Array.isArray(data) ? data : data.products || [];
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  const products = applyFilter(allProducts, filter);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="relative w-full overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white">
        {heroImage && (
          <>
            <img
              src={heroImage}
              alt={heroImageAlt || title}
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          </>
        )}
        <div className="relative container mx-auto px-4 md:px-8 py-16 md:py-24">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              {breadcrumbs.map((crumb, i) => (
                <span key={crumb.href} className="flex items-center gap-2">
                  <span>/</span>
                  {i < breadcrumbs.length - 1 ? (
                    <Link
                      href={crumb.href}
                      className="hover:text-white transition-colors"
                    >
                      {crumb.name}
                    </Link>
                  ) : (
                    <span className="text-white font-medium">{crumb.name}</span>
                  )}
                </span>
              ))}
            </nav>
          )}

          {badge && (
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-semibold uppercase tracking-widest text-white/80 mb-4">
              {badge}
            </span>
          )}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            {title}
          </h1>
          {description && (
            <p className="text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
          <div className="mt-6 flex items-center gap-3 text-sm text-white/50">
            <Package className="w-4 h-4" />
            <span>
              {products.length} product{products.length !== 1 ? "s" : ""} found
            </span>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <section className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={String(product._id)} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
              <Package className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              No products found
            </h2>
            <p className="text-muted-foreground max-w-md mb-8">
              We couldn&apos;t find any products in this collection. Check back
              soon or browse all products.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-semibold text-sm hover:opacity-80 transition-opacity"
            >
              Browse all products
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
