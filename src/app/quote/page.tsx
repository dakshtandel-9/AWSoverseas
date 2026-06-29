import type { Metadata } from "next";
import { requestQuote, metaFrom } from "@/lib/content";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata: Metadata = metaFrom(requestQuote.meta, "/quote");

export default function Page() {
  return (
    <PagePlaceholder
      badge={requestQuote.hero?.badge}
      title={requestQuote.hero?.title}
      subtitle={requestQuote.hero?.subtitle}
    />
  );
}
