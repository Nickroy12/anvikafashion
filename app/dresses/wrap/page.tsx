import { CollectionPage } from "@/components/products/collection-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wrap Dresses — Anbika",
  description:
    "Flattering wrap dresses for every body type. Timeless, adjustable and effortlessly stylish.",
};

export default function WrapDressesPage() {
  return (
    <CollectionPage
      title="Wrap Dresses"
      description="Universally flattering and timelessly chic — wrap dresses that celebrate every silhouette."
      filter={{ type: "subcategory", value: "wrap-dresses", parentCategory: "clothing" }}
      heroImage="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1400&auto=format&fit=crop"
      heroImageAlt="Wrap Dresses"
      badge="Shop by Style"
      breadcrumbs={[
        { name: "Dresses", href: "/dresses" },
        { name: "Wrap Dresses", href: "/dresses/wrap" },
      ]}
    />
  );
}
