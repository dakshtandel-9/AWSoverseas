import { ProductCard } from "@/components/products/product-card";
import type { EnquiryAuth } from "@/components/products/enquiry-modal";
import type { PublicProduct } from "@/lib/product-data";

/**
 * Just the cards — no section band, no heading. Used directly under an About
 * block on a category page, where the surrounding <Section> already owns the
 * spacing, and wrapped by <ProductGrid> where a standalone band is wanted.
 */
export function ProductCardGrid({
  products,
  auth,
}: {
  products: PublicProduct[];
  auth: EnquiryAuth;
}) {
  if (products.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-[#e4e9f2] px-5 py-14 text-center text-sm text-[#94a3b8]">
        Nothing listed here yet — contact us and we&apos;ll source it for you.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} auth={auth} />
      ))}
    </div>
  );
}
