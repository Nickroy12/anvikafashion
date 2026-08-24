import { CollectionPage } from "@/components/products/collection-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Casual Dresses — Anbika",
  description:
    "Effortless everyday dresses for relaxed, casual days. Comfortable, stylish and always on-trend.",
};

export default function CasualDressesPage() {
  return (
    <CollectionPage
      title="Casual Dresses"
      description="Easy, breezy and beautiful — everyday dresses you'll reach for again and again."
      filter={{ type: "subcategory", value: "casual", parentCategory: "clothing" }}
      heroImage="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1400&auto=format&fit=crop"
      heroImageAlt="Casual Dresses"
      badge="Shop by Occasion"
      breadcrumbs={[
        { name: "Dresses", href: "/dresses" },
        { name: "Casual", href: "/dresses/casual" },
      ]}
    />
  );
}
