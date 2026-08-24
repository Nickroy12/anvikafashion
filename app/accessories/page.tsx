import { CollectionPage } from "@/components/products/collection-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessories — Anbika",
  description:
    "Complete your look with our curated accessories collection — bags, jewelry, scarves and more.",
};

export default function AccessoriesPage() {
  return (
    <CollectionPage
      title="Accessories"
      description="The finishing touch that transforms every outfit. Discover bags, jewelry, scarves and more."
      filter={{ type: "category", value: "accessories" }}
      heroImage="https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1400&auto=format&fit=crop"
      heroImageAlt="Accessories Collection"
      badge="Collection"
      breadcrumbs={[{ name: "Accessories", href: "/accessories" }]}
    />
  );
}
