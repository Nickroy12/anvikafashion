import { CollectionPage } from "@/components/products/collection-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Summer Collection '26 — Anbika",
  description:
    "Sun-drenched styles for the warmest season. Explore our Summer Collection '26.",
};

export default function SummerCollectionPage() {
  return (
    <CollectionPage
      title="Summer Collection '26"
      description="Golden hours, warm breezes and effortless style. Everything you need for a perfect summer."
      filter={{ type: "collection", slug: "summer" }}
      heroImage="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1400&auto=format&fit=crop"
      heroImageAlt="Summer Collection"
      badge="Summer '26"
      breadcrumbs={[
        { name: "Collections", href: "/collections" },
        { name: "Summer '26", href: "/collections/summer" },
      ]}
    />
  );
}
