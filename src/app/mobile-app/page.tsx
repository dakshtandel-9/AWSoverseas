import type { Metadata } from "next";
import { mobileApp, metaFrom } from "@/lib/content";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata: Metadata = metaFrom(mobileApp.meta, "/mobile-app");

export default function Page() {
  return (
    <PagePlaceholder
      badge={mobileApp.hero?.badge}
      title={mobileApp.hero?.title}
      subtitle={mobileApp.hero?.subtitle}
    />
  );
}
