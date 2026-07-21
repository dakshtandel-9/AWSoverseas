import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard } from "@/components/products/product-card";
import type { EnquiryAuth } from "@/components/products/enquiry-modal";
import type { PublicProduct } from "@/lib/product-data";

type Data = { title: string; description: string; button: string };

export function ProductsTeaser({
  data,
  products,
  auth,
  eyebrow,
}: {
  data: Data;
  products: PublicProduct[];
  auth: EnquiryAuth;
  eyebrow: string;
}) {
  if (products.length === 0) return null;

  return (
    <Section spacing="lg" tone="soft">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading eyebrow={eyebrow} title={data.title} subtitle={data.description} align="left" />
        <Link
          href="/products"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-brand-200 px-5 py-2.5 text-sm font-semibold text-brand-900 transition-colors hover:border-brand-400 hover:bg-brand-50"
        >
          {data.button} <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        {products.slice(0, 4).map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} auth={auth} />
        ))}
      </div>

      {products.length > 4 && (
        <div className="mt-10 flex justify-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full bg-[#02224C] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#011a38]"
          >
            View more products <ArrowRight className="size-4" />
          </Link>
        </div>
      )}
    </Section>
  );
}
