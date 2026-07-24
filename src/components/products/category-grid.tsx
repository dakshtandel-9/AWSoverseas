import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { CategoryCard } from "@/components/products/category-card";
import type { PublicCategory } from "@/lib/category-data";

export function CategoryGrid({ categories }: { categories: PublicCategory[] }) {
  return (
    <Section spacing="lg" tone="soft">
      <SectionHeading
        eyebrow="Categories"
        title="Explore Our Product Range"
        subtitle="Pick a category to see everything we have available in it — enquire on anything you're interested in."
      />

      {categories.length === 0 ? (
        <p className="mt-12 rounded-2xl border border-dashed border-[#e4e9f2] px-5 py-14 text-center text-sm text-[#94a3b8]">
          Our catalog is being updated — check back shortly, or contact us directly for what you need.
        </p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, i) => (
            <CategoryCard key={category.id} category={category} index={i} />
          ))}
        </div>
      )}
    </Section>
  );
}
