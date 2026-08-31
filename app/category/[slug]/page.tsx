import { CollectionPage } from "@/components/products/collection-page";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const categoryName = resolvedParams.slug.charAt(0).toUpperCase() + resolvedParams.slug.slice(1);
  return {
    title: `${categoryName} — Anbika`,
    description: `Shop the latest ${categoryName} in our collection.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const categoryName = resolvedParams.slug.charAt(0).toUpperCase() + resolvedParams.slug.slice(1);
  return (
    <CollectionPage
      title={categoryName}
      description={`Browse our extensive collection of ${categoryName}.`}
      filter={{ type: "category", value: resolvedParams.slug }}
      badge="Category"
      breadcrumbs={[{ name: categoryName, href: `/category/${resolvedParams.slug}` }]}
    />
  );
}
