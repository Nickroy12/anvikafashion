import { CollectionPage } from "@/components/products/collection-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cosmetics and fashion Accessories — Anbika",
  description:
    "Complete your look with our curated cosmetics and fashion accessories collection — makeup, bags, jewelry, scarves and more.",
};

export default function CosmeticsAndFashionAccessoriesPage() {
  return (
    <CollectionPage
      title="Cosmetics and fashion Accessories"
      description="The finishing touch that transforms every outfit. Discover makeup, bags, jewelry, scarves and more."
      filter={{ type: "category", value: "cosmetics-and-fashion-accessories" }}
      heroImage="https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1400&auto=format&fit=crop"
      heroImageAlt="Cosmetics and fashion Accessories Collection"
      badge="Collection"
      breadcrumbs={[{ name: "Cosmetics and fashion Accessories", href: "/cosmetics-and-fashion-accessories" }]}
    />
  );
}
