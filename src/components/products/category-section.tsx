import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { CategoryAbout, hasAboutContent } from "@/components/products/category-about";
import { ProductCardGrid } from "@/components/products/product-card-grid";
import type { EnquiryAuth } from "@/components/products/enquiry-modal";
import type { CategoryBranch } from "@/lib/catalog-tree";

/**
 * A subcategory rendered in place on its parent's page: its own About block
 * followed by everything filed under it. Used when the subcategory holds
 * products — there is nothing further to drill into, so sending someone to
 * another page would cost a click and show them the same thing.
 *
 * `index` drives the alternation: the photo swaps sides and the band tone
 * flips on each one, so a page with several of these reads as a rhythm.
 */
export function CategorySection({
  branch,
  auth,
  index,
}: {
  branch: CategoryBranch;
  auth: EnquiryAuth;
  index: number;
}) {
  const flipped = index % 2 === 1;
  const showAbout = hasAboutContent(branch);

  return (
    <Section spacing="lg" tone={flipped ? "default" : "soft"}>
      {showAbout ? (
        <CategoryAbout category={branch} imageSide={flipped ? "left" : "right"} />
      ) : (
        // No description written yet — the grid still needs naming.
        <Reveal direction="up" className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold text-ink sm:text-4xl">{branch.name}</h2>
        </Reveal>
      )}

      <div className="mt-14">
        <ProductCardGrid products={branch.products} auth={auth} />
      </div>
    </Section>
  );
}
