import { Section } from "@/components/ui/section";
import { CategoryAbout } from "@/components/products/category-about";
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

  return (
    <Section spacing="lg" tone={flipped ? "default" : "soft"}>
      <CategoryAbout category={branch} imageSide={flipped ? "left" : "right"} />
      <div className="mt-14">
        <ProductCardGrid products={branch.products} auth={auth} />
      </div>
    </Section>
  );
}
