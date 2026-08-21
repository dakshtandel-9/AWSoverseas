import type { Metadata } from "next";
import { requestProduct, metaFrom } from "@/lib/content";
import { getAccount } from "@/lib/account";
import { RequestProductHero } from "@/components/request-product/request-product-hero";
import { RequestProductForm } from "@/components/request-product/request-product-form";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = metaFrom(requestProduct.meta, "/request-product");

export default async function Page() {
  // No login is required to submit — but if a customer happens to be signed
  // in, prefill their contact details from their profile so they don't have
  // to retype them. Unlike the order flow, this never gates on approval
  // status: it's a convenience prefill, not a permission check.
  const account = await getAccount();
  const contactDefaults = account
    ? {
        name: `${account.profile.first_name} ${account.profile.last_name}`.trim(),
        email: account.profile.email,
        phone: account.profile.phone,
      }
    : undefined;

  return (
    <>
      <RequestProductHero data={requestProduct.hero} />
      <Section spacing="lg" tone="soft">
        <RequestProductForm data={requestProduct.form} contactDefaults={contactDefaults} />
      </Section>
    </>
  );
}
