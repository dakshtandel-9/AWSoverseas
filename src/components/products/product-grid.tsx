import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCardGrid } from "@/components/products/product-card-grid";
import type { EnquiryAuth } from "@/components/products/enquiry-modal";
import type { PublicProduct } from "@/lib/product-data";

export function ProductGrid({
  products,
  auth,
  eyebrow = "Catalog",
  title = "Browse Our Products",
  subtitle = "Tap Enquire now on anything you're interested in — we'll follow up with availability and a quote.",
  tone = "soft",
}: {
  products: PublicProduct[];
  auth: EnquiryAuth;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  tone?: "default" | "soft";
}) {
  return (
    <Section spacing="lg" tone={tone}>
      <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />

      <div className="mt-12">
        <ProductCardGrid products={products} auth={auth} />
      </div>
    </Section>
  );
}
