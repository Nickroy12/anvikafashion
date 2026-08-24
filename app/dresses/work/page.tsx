import { CollectionPage } from "@/components/products/collection-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work Dresses — Anbika",
  description:
    "Professional, polished and powerful — work dresses that command the boardroom.",
};

export default function WorkDressesPage() {
  return (
    <CollectionPage
      title="Work Dresses"
      description="Dress for the job you want. Professional, polished and powerful styles that mean business."
      filter={{ type: "subcategory", value: "work", parentCategory: "clothing" }}
      heroImage="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=1400&auto=format&fit=crop"
      heroImageAlt="Work Dresses"
      badge="Shop by Occasion"
      breadcrumbs={[
        { name: "Dresses", href: "/dresses" },
        { name: "Work", href: "/dresses/work" },
      ]}
    />
  );
}
