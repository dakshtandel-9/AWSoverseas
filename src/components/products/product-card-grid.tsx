"use client";

import { useState } from "react";
import { ProductCard } from "@/components/products/product-card";
import type { EnquiryAuth } from "@/components/products/enquiry-modal";
import type { PublicProduct } from "@/lib/product-data";

const PAGE_SIZE = 12;

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
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  if (products.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-[#e4e9f2] px-5 py-14 text-center text-sm text-[#94a3b8]">
        Nothing listed here yet — contact us and we&apos;ll source it for you.
      </p>
    );
  }

  const visibleProducts = products.slice(0, visibleCount);
  const remaining = products.length - visibleProducts.length;

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        {visibleProducts.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} auth={auth} />
        ))}
      </div>

      {remaining > 0 && (
        <div className="mt-10 flex flex-col items-center gap-3">
          <p className="text-sm text-[#5b6b82]">
            Showing {visibleProducts.length} of {products.length} products
          </p>
          <button
            type="button"
            onClick={() => setVisibleCount((count) => Math.min(count + PAGE_SIZE, products.length))}
            className="btn-navy inline-flex min-h-12 items-center justify-center rounded-full px-7 py-3 text-sm font-semibold text-white transition-colors duration-200"
          >
            Load {Math.min(PAGE_SIZE, remaining)} more products
          </button>
        </div>
      )}
    </div>
  );
}
