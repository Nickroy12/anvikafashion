import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Shirt, Glasses, Footprints, Gem } from "lucide-react";

const categories = [
  {
    name: "Clothing",
    slug: "clothing",
    icon: Shirt,
    description: "Discover our latest apparel",
  },
  {
    name: "Cosmetics and fashion Accessories",
    slug: "cosmetics-and-fashion-accessories",
    icon: Glasses,
    description: "Complete your look",
  },
  {
    name: "Shoes",
    slug: "shoes",
    icon: Footprints,
    description: "Step into style",
  },
  {
    name: "Jewelry",
    slug: "jewelry",
    icon: Gem,
    description: "Shine bright with our collection",
  },
];

export function Categories() {
  return (
    <section className="container mx-auto py-16 px-4 md:px-8">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Shop by Category</h2>
        <p className="text-muted-foreground">Find exactly what you are looking for</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link key={category.slug} href={`/category/${category.slug}`}>
            <Card className="h-full hover:border-primary transition-all hover:shadow-md cursor-pointer group">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <category.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
