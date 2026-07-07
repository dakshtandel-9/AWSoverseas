import type { Metadata } from "next";
import { products, metaFrom } from "@/lib/content";
import { getActiveProducts } from "@/lib/product-data";
import { getAccount } from "@/lib/account";
import { ProductsHero } from "@/components/products/products-hero";
import { Overview } from "@/components/products/overview";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductsCta } from "@/components/products/products-cta";
import type { EnquiryAuth } from "@/components/products/enquiry-modal";

export const metadata: Metadata = metaFrom(products.meta, "/products");

export default async function Page() {
  const [catalog, account] = await Promise.all([getActiveProducts(), getAccount()]);

  // The catalog stays public; the enquiry modal gates on account state.
  const auth: EnquiryAuth = !account
    ? { state: "guest" }
    : account.profile.status === "incomplete"
      ? { state: "setup" }
      : account.profile.status !== "approved"
        ? { state: account.profile.status }
        : {
            state: "approved",
            fullName: `${account.profile.first_name} ${account.profile.last_name}`.trim(),
            email: account.profile.email,
            phone: account.profile.phone,
          };

  const stats = products.overview.stats.map((stat: { number: string; label: string }, i: number) =>
    i === 0 ? { ...stat, number: String(catalog.length) } : stat,
  );

  const PRODUCTS_JSONLD = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: products.meta?.title,
    description: products.meta?.description,
    url: "https://awsoversea.com/products",
    hasPart: catalog.map((item) => ({
      "@type": "Product",
      name: item.name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCTS_JSONLD) }}
      />

      <ProductsHero data={products.hero} stats={stats} />
      <Overview data={products.overview} />
      <ProductGrid products={catalog} auth={auth} />
      <ProductsCta data={products.cta} />
    </>
  );
}
