import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { CategoryCard } from "@/components/products/category-card";
import type { PublicCategory } from "@/lib/category-data";

type Data = { title: string; description: string; button: string };

export function ProductsTeaser({
  data,
  categories,
  eyebrow,
}: {
  data: Data;
  categories: PublicCategory[];
  eyebrow: string;
}) {
  if (categories.length === 0) return null;

  return (
    <Section spacing="lg" tone="soft">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading eyebrow={eyebrow} title={data.title} subtitle={data.description} align="left" />
        <Link
          href="/products"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-brand-200 px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-brand-400 hover:bg-brand-50"
        >
          {data.button} <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.slice(0, 4).map((category, i) => (
          <CategoryCard key={category.id} category={category} index={i} />
        ))}
      </div>

      {categories.length > 4 && (
        <div className="mt-10 flex justify-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full btn-navy px-6 py-3 text-sm font-semibold text-white transition-colors"
          >
            View more categories <ArrowRight className="size-4" />
          </Link>
        </div>
      )}
    </Section>
  );
}
