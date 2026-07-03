import type { Metadata } from "next";
import { faq, metaFrom } from "@/lib/content";
import { FaqHero } from "@/components/faq/faq-hero";
import { FaqBrowser } from "@/components/faq/faq-browser";
import { FaqCta } from "@/components/faq/faq-cta";

export const metadata: Metadata = metaFrom(faq.meta, "/faq");

export default function Page() {
  return (
    <>
      <FaqHero data={faq.hero} />
      <FaqBrowser categories={faq.categories} accordion={faq.accordion} />
      <FaqCta data={faq.contactCTA} />
    </>
  );
}
