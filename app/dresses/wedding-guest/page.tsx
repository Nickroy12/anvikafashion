import { CollectionPage } from "@/components/products/collection-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wedding Guest Dresses — Anbika",
  description:
    "Look effortlessly elegant at every wedding. Sophisticated, occasion-ready dresses for the perfect guest.",
};

export default function WeddingGuestDressesPage() {
  return (
    <CollectionPage
      title="Wedding Guest Dresses"
      description="Look stunning without outshining the bride. Sophisticated styles made for celebrating love."
      filter={{ type: "subcategory", value: "wedding-guest", parentCategory: "clothing" }}
      heroImage="https://images.unsplash.com/photo-1529640988-b75ecbccc1de?q=80&w=1400&auto=format&fit=crop"
      heroImageAlt="Wedding Guest Dresses"
      badge="Shop by Occasion"
      breadcrumbs={[
        { name: "Dresses", href: "/dresses" },
        { name: "Wedding Guest", href: "/dresses/wedding-guest" },
      ]}
    />
  );
}
