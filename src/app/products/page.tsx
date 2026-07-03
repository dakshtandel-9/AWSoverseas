import type { Metadata } from "next";
import { products, metaFrom } from "@/lib/content";
import { ProductsHero } from "@/components/products/products-hero";
import { Overview } from "@/components/products/overview";
import { ProductsDirectory } from "@/components/products/products-directory";
import { ProductProfiles } from "@/components/products/product-profiles";
import { ProductsCta } from "@/components/products/products-cta";

export const metadata: Metadata = metaFrom(products.meta, "/products");

const PROFILE_BLOCKS = [
  products.foodGrains,
  products.garments,
  products.leatherFootwear,
  products.steelUtensils,
  products.tractors,
  products.medicines,
  products.medicalEquipment,
  products.chemicals,
  products.activatedCarbon,
  products.spices,
  products.furniture,
].filter(Boolean);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ICON_BY_TITLE: Record<string, string> = Object.fromEntries(
  (products.productsGrid?.items ?? []).map((item: { title: string; icon: string }) => [
    item.title,
    item.icon,
  ]),
);

const PROFILES = PROFILE_BLOCKS.map((p) => ({
  ...p,
  icon: ICON_BY_TITLE[p.title],
}));

const PRODUCTS_JSONLD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: products.meta?.title,
  description: products.meta?.description,
  url: "https://awsoversea.com/products",
  hasPart: products.productsGrid?.items?.map((item: { title: string }) => ({
    "@type": "Thing",
    name: item.title,
  })),
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCTS_JSONLD) }}
      />

      <ProductsHero data={products.hero} stats={products.overview.stats} />
      <Overview data={products.overview} />
      <ProductsDirectory data={products.productsGrid} />
      <ProductProfiles profiles={PROFILES} />
      <ProductsCta data={products.cta} />
    </>
  );
}
