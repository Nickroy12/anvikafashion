import { CollectionPage } from "@/components/products/collection-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Arrivals — Anbika",
  description:
    "Discover the latest additions to our fashion collection. Fresh styles and trends, just arrived.",
};

export default function NewArrivalsPage() {
  return (
    <CollectionPage
      title="New Arrivals"
      description="Fresh from the runway — discover our latest styles and be the first to wear them."
      filter={{ type: "new-arrivals" }}
      badge="Just In"
      breadcrumbs={[{ name: "New Arrivals", href: "/new-arrivals" }]}
    />
  );
}
