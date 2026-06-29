import type { Metadata } from "next";
import { contact, metaFrom } from "@/lib/content";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata: Metadata = metaFrom(contact.meta, "/contact");

export default function Page() {
  return (
    <PagePlaceholder
      badge={contact.hero?.badge}
      title={contact.hero?.title}
      subtitle={contact.hero?.subtitle}
    />
  );
}
