import type { Metadata } from "next";
import { requestQuote, metaFrom } from "@/lib/content";
import { getAccount, enquiryAuthFor } from "@/lib/account";
import { QuoteHero } from "@/components/quote/quote-hero";
import { QuoteForm } from "@/components/quote/quote-form";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = metaFrom(requestQuote.meta, "/quote");

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;

  // The form itself stays visible to everyone; it only gates on submit, so
  // guests can fill it in before being asked to sign in.
  const account = await getAccount();
  const auth = enquiryAuthFor(account);
  const { profile } = account ?? {};

  const contactDefaults = profile
    ? {
        "Full Name": `${profile.first_name} ${profile.last_name}`.trim(),
        "Company Name": profile.company_name,
        "Email Address": profile.email,
        "Phone Number": profile.phone,
      }
    : undefined;

  return (
    <>
      <QuoteHero data={requestQuote.hero} />
      <Section spacing="lg" tone="soft">
        <QuoteForm
          quoteForm={requestQuote.quoteForm}
          shipmentDetails={requestQuote.shipmentDetails}
          contactDetails={requestQuote.contactDetails}
          submit={requestQuote.submit}
          product={product}
          contactDefaults={contactDefaults}
          auth={auth}
        />
      </Section>
    </>
  );
}
