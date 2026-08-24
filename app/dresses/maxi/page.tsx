import { CollectionPage } from "@/components/products/collection-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maxi Dresses — Anbika",
  description:
    "Shop elegant maxi dresses perfect for any occasion — from beach walks to formal events.",
};

export default function MaxiDressesPage() {
  return (
    <CollectionPage
      title="Maxi Dresses"
      description="Floor-sweeping elegance for every occasion. Discover our curated maxi dress collection."
      filter={{ type: "subcategory", value: "maxi-dresses", parentCategory: "clothing" }}
      heroImage="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=1400&auto=format&fit=crop"
      heroImageAlt="Maxi Dresses"
      badge="Shop by Style"
      breadcrumbs={[
        { name: "Dresses", href: "/dresses" },
        { name: "Maxi Dresses", href: "/dresses/maxi" },
      ]}
    />
  );
}
