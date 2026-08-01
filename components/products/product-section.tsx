import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { serverFetch } from "@/lib/core/api";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

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
          <Card key={product._id} className="flex flex-col h-full border-muted/60 hover:border-primary/40">
            <div className="relative w-full aspect-[4/3] bg-muted/20 overflow-hidden">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name || "Product"}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary/50 text-muted-foreground">
                  No image
                </div>
              )}
              {product.category && (
                <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-md text-xs font-semibold px-3 py-1 rounded-full shadow-sm text-foreground">
                  {product.category}
                </div>
              )}
            </div>
            <CardHeader className="flex-none p-5 pb-2">
              <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
              <CardDescription className="line-clamp-2 mt-2 text-sm h-10">
                {product.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-5 pt-3">
              <p className="text-3xl font-bold text-foreground">
                ${Number(product.price).toFixed(2)}
              </p>
            </CardContent>
            <CardFooter className="p-5 pt-0 mt-auto">
              <Button className="w-full font-semibold transition-all hover:shadow-md">
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
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
