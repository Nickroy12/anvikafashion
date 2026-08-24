import { CollectionPage } from "@/components/products/collection-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Party Dresses — Anbika",
  description:
    "Dazzle at every event with our glamorous party dress collection. Dance, celebrate and shine.",
};

export default function PartyDressesPage() {
  return (
    <CollectionPage
      title="Party Dresses"
      description="Life is a party — dress like it. Sequins, satin and shimmer for your most unforgettable nights."
      filter={{ type: "subcategory", value: "party", parentCategory: "clothing" }}
      heroImage="https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1400&auto=format&fit=crop"
      heroImageAlt="Party Dresses"
      badge="Shop by Occasion"
      breadcrumbs={[
        { name: "Dresses", href: "/dresses" },
        { name: "Party", href: "/dresses/party" },
      ]}
    />
  );
}
