import { ProductCard } from "@/components/ui/product-card";
import { serverFetch } from "@/lib/core/api";
import type { Product } from "@/components/products/collection-page";
export type { Product } from "@/components/products/collection-page";

export async function ProductSection() {
  let products: Product[] = [];

  try {
    const data: any = await serverFetch("/api/products");
    products = Array.isArray(data) ? data : data.products || [];
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <section className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center mb-12 text-center space-y-4">
        <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
          Featured Products
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Discover our curated collection of premium products designed with modern aesthetics and exceptional quality.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
        {products.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No products found.
          </div>
        )}
      </div>
    </section>
  );
}
