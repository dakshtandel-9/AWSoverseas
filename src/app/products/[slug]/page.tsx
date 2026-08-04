import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getActiveCategories,
  getActiveCategoryBySlug,
  getCategoryTrail,
  rendersAsCard,
} from "@/lib/category-data";
import { getCategoryBranches } from "@/lib/catalog-tree";
import { getActiveProductsByCategory } from "@/lib/product-data";
import { getAccount, enquiryAuthFor } from "@/lib/account";
import { Section } from "@/components/ui/section";
import { CategoryHero } from "@/components/products/category-hero";
import { CategoryAbout, hasAboutContent } from "@/components/products/category-about";
import { CategoryGrid } from "@/components/products/category-grid";
import { CategorySection } from "@/components/products/category-section";
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
  const title = category ? `${category.name} | AWS OVERSEAS impex` : "Category | AWS OVERSEAS impex";
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

  const [subcategories, catalog, trailWithSelf, account] = await Promise.all([
    getCategoryBranches(category.id),
    getActiveProductsByCategory(category.id),
    getCategoryTrail(category),
    getAccount(),
  ]);
  const auth = enquiryAuthFor(account);

  // A category holds subcategories or products, never both — so show whichever
  // it has. An empty one falls through to the product grid's empty state.
  const isBranch = subcategories.length > 0;
  const ancestors = trailWithSelf.slice(0, -1);

  // Cards to click through to, or opened out in place — this category's own
  // "Subcategory layout" setting decides (see rendersAsCard).
  const linked = subcategories.filter((s) => rendersAsCard(s, category.child_layout));
  const inlined = subcategories.filter((s) => !rendersAsCard(s, category.child_layout));

  const CATEGORY_JSONLD = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description,
    url: `https://awsoverseas.com/products/${slug}`,
    hasPart: isBranch
      ? subcategories.map((item) => ({
          "@type": "ProductGroup",
          name: item.name,
          url: `https://awsoverseas.com/products/${item.slug}`,
        }))
      : catalog.map((item) => ({
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

      <CategoryHero
        category={category}
        count={isBranch ? subcategories.length : catalog.length}
        trail={ancestors}
        countLabel={isBranch ? "SUBCATEGORIES" : "LISTED"}
      />

      {linked.length > 0 && (
        <CategoryGrid
          categories={linked}
          title={`Explore Our ${category.name} Range`}
          subtitle="Pick a range to see everything filed under it."
        />
      )}

      {inlined.map((branch, i) => (
        <CategorySection
          key={branch.id}
          branch={branch}
          auth={auth}
          // Keep the tone alternating across the cards band above it.
          index={linked.length > 0 ? i + 1 : i}
        />
      ))}

      {!isBranch && (
        <ProductGrid
          products={catalog}
          auth={auth}
          title={`Browse ${category.name}`}
          subtitle="Tap Enquire now on anything you're interested in — we'll follow up with availability and a quote."
        />
      )}

      <ProductsCta data={productsContent.cta} />
    </>
  );
}
