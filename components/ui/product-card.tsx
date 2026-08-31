import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Product } from "@/components/products/product-section";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const productId = typeof product._id === 'object' && product._id !== null ? (product._id as any).$oid : product._id;
  const mainImage = product.imageUrls?.[0] || product.imageUrl;

  return (
    <Card className="flex flex-col h-full border-muted/60 hover:border-primary/40 group/card">
      <Link href={`/products/${productId}`} className="flex flex-col h-full">
        <div className="relative w-full aspect-[4/3] bg-muted/20 overflow-hidden">
          {mainImage ? (
            <Image
              src={mainImage}
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
          {product.discount && (
            <div className="absolute top-3 left-3 bg-red-600/95 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
              -{product.discount}%
            </div>
          )}
        </div>
        <CardHeader className="flex-none p-5 pb-2">
          <CardTitle className="text-lg line-clamp-1 group-hover/card:text-primary transition-colors">{product.name}</CardTitle>
          {product.createdAt && new Date(product.createdAt).getTime() >= Date.now() - 24 * 60 * 60 * 1000 && (
            <div className="text-xs text-muted-foreground mt-1">
              Added {Math.max(1, Math.floor((Date.now() - new Date(product.createdAt).getTime()) / (60 * 60 * 1000)))}h ago
            </div>
          )}
        </CardHeader>
      </Link>
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
  );
}
