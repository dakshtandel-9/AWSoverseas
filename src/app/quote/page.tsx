import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requestQuote, metaFrom } from "@/lib/content";
import { getAccount } from "@/lib/account";
import { QuoteHero } from "@/components/quote/quote-hero";
import { QuoteForm } from "@/components/quote/quote-form";
import { VerificationNotice } from "@/components/account/verification-notice";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = metaFrom(requestQuote.meta, "/quote");

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;

  // Quotes require a signed-in, admin-approved account.
  const account = await getAccount();
  if (!account) redirect(`/login?next=${encodeURIComponent(product ? `/quote?product=${product}` : "/quote")}`);
  if (account.profile.status === "incomplete") redirect("/profile/setup");

  const { profile } = account;
  const approved = profile.status === "approved";

  const contactDefaults = {
    "Full Name": `${profile.first_name} ${profile.last_name}`.trim(),
    "Company Name": profile.company_name,
    "Email Address": profile.email,
    "Phone Number": profile.phone,
  };

  return (
    <>
      <QuoteHero data={requestQuote.hero} />
      <Section spacing="lg" tone="soft">
        {approved ? (
          <QuoteForm
            quoteForm={requestQuote.quoteForm}
            shipmentDetails={requestQuote.shipmentDetails}
            contactDetails={requestQuote.contactDetails}
            submit={requestQuote.submit}
            product={product}
            contactDefaults={contactDefaults}
          />
        ) : (
          <VerificationNotice status={profile.status} />
        )}
      </Section>
    </>
  );
}
