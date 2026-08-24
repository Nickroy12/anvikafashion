import { CollectionPage } from "@/components/products/collection-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dresses — Anbika",
  description:
    "Shop our full collection of dresses — maxi, midi, mini, wrap, casual, party and more.",
};

export default function DressesPage() {
  return (
    <CollectionPage
      title="Dresses"
      description="From sun-kissed casuals to elegant evening gowns — find your perfect dress for every occasion."
      filter={{ type: "category", value: "clothing" }}
      heroImage="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1400&auto=format&fit=crop"
      heroImageAlt="Dresses Collection"
      badge="Collection"
      breadcrumbs={[{ name: "Dresses", href: "/dresses" }]}
    />
  );
}
