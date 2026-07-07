import type { Metadata } from "next";
import { requestQuote, metaFrom } from "@/lib/content";
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
        />
      </Section>
    </>
  );
}
