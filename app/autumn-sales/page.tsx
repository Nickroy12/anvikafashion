import { CollectionPage } from "@/components/products/collection-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Autumn Sales — Anbika",
  description:
    "Incredible deals on premium fashion. Shop our Autumn Sale for up to 50% off selected styles.",
};

export default function AutumnSalesPage() {
  return (
    <CollectionPage
      title="Autumn Sales 🍂"
      description="The season of stunning discounts is here. Shop now and save big on our most-loved styles."
      filter={{ type: "on-sale" }}
      heroImage="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1400&auto=format&fit=crop"
      heroImageAlt="Autumn Sales"
      badge="Limited Time Offer"
      breadcrumbs={[{ name: "Autumn Sales", href: "/autumn-sales" }]}
    />
  );
}
