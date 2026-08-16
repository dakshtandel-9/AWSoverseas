import type { Metadata } from "next";
import { products, metaFrom } from "@/lib/content";
import { absoluteUrl } from "@/lib/site-url";
import { getActiveProducts } from "@/lib/product-data";
import { getRootCategories } from "@/lib/category-data";
import { ProductsHero } from "@/components/products/products-hero";
import { CategoryGrid } from "@/components/products/category-grid";
import { ProductsCta } from "@/components/products/products-cta";

export const metadata: Metadata = metaFrom(products.meta, "/products");

export default async function Page() {
  const [catalog, categories] = await Promise.all([getActiveProducts(), getRootCategories()]);

  const stats = products.overview.stats.map((stat: { number: string; label: string }, i: number) =>
    i === 0 ? { ...stat, number: String(catalog.length) } : stat,
  );

  const PRODUCTS_JSONLD = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: products.meta?.title,
    description: products.meta?.description,
    url: absoluteUrl("/products"),
    hasPart: categories.map((item) => ({
      "@type": "ProductGroup",
      name: item.name,
      url: absoluteUrl(`/products/${item.slug}`),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCTS_JSONLD) }}
      />

      <ProductsHero data={products.hero} stats={stats} />
      <CategoryGrid categories={categories} />
      <ProductsCta data={products.cta} />
    </>
  );
}
