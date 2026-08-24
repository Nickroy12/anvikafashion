import { CollectionPage } from "@/components/products/collection-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mini Dresses — Anbika",
  description:
    "Shop flirty mini dresses that turn heads. Fun, youthful styles perfect for parties and nights out.",
};

export default function MiniDressesPage() {
  return (
    <CollectionPage
      title="Mini Dresses"
      description="Short, sweet and statement-making. Mini dresses for the bold and the beautiful."
      filter={{ type: "subcategory", value: "mini-dresses", parentCategory: "clothing" }}
      heroImage="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1400&auto=format&fit=crop"
      heroImageAlt="Mini Dresses"
      badge="Shop by Style"
      breadcrumbs={[
        { name: "Dresses", href: "/dresses" },
        { name: "Mini Dresses", href: "/dresses/mini" },
      ]}
    />
  );
}
