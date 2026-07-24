import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getActiveCategories, getActiveCategoryBySlug } from "@/lib/category-data";
import { getActiveProductsByCategory } from "@/lib/product-data";
import { getAccount, enquiryAuthFor } from "@/lib/account";
import { CategoryHero } from "@/components/products/category-hero";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductsCta } from "@/components/products/products-cta";
import { products as productsContent } from "@/lib/content";

export async function generateStaticParams() {
  const categories = await getActiveCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getActiveCategoryBySlug(slug);
  const title = category ? `${category.name} | aws overseas` : "Category | aws overseas";
  const description = category?.description || productsContent.meta?.description;
  return {
    title,
    description,
    alternates: { canonical: `https://awsoverseas.com/products/${slug}` },
  };
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getActiveCategoryBySlug(slug);
  if (!category) notFound();

  const [catalog, account] = await Promise.all([getActiveProductsByCategory(category.id), getAccount()]);
  const auth = enquiryAuthFor(account);

  const CATEGORY_JSONLD = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description,
    url: `https://awsoverseas.com/products/${slug}`,
    hasPart: catalog.map((item) => ({
      "@type": "Product",
      name: item.name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CATEGORY_JSONLD) }}
      />

      <CategoryHero category={category} count={catalog.length} />
      <ProductGrid products={catalog} auth={auth} />
      <ProductsCta data={productsContent.cta} />
    </>
  );
}
