import { CollectionPage } from "@/components/products/collection-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Midi Dresses — Anbika",
  description:
    "Shop stylish midi dresses that hit right below the knee. Versatile styles for work and weekends.",
};

export default function MidiDressesPage() {
  return (
    <CollectionPage
      title="Midi Dresses"
      description="The perfect length — effortlessly chic midi dresses for work, brunch, and beyond."
      filter={{ type: "subcategory", value: "midi-dresses", parentCategory: "clothing" }}
      heroImage="https://images.unsplash.com/photo-1558171813-7f016b0f37b5?q=80&w=1400&auto=format&fit=crop"
      heroImageAlt="Midi Dresses"
      badge="Shop by Style"
      breadcrumbs={[
        { name: "Dresses", href: "/dresses" },
        { name: "Midi Dresses", href: "/dresses/midi" },
      ]}
    />
  );
}
