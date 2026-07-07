import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard } from "@/components/products/product-card";
import type { PublicProduct } from "@/lib/product-data";

export function ProductGrid({ products }: { products: PublicProduct[] }) {
  return (
    <Section spacing="lg" tone="soft">
      <SectionHeading
        eyebrow="Catalog"
        title="Browse Our Products"
        subtitle="Tap Enquiry on anything you're interested in — we'll follow up with availability and a quote."
      />

      {products.length === 0 ? (
        <p className="mt-12 rounded-2xl border border-dashed border-[#e4e9f2] px-5 py-14 text-center text-sm text-[#94a3b8]">
          Our catalog is being updated — check back shortly, or contact us directly for what you need.
        </p>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </Section>
  );
}
