import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { individualService, metaFrom } from "@/lib/content";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const services: any[] = individualService.services ?? [];

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug as string }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const svc = services.find((s) => s.slug === slug);
  return metaFrom(svc?.meta, `/services/${slug}`);
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const svc = services.find((s) => s.slug === slug);
  if (!svc) notFound();

  return (
    <PagePlaceholder
      badge={svc.hero?.badge ?? "Service"}
      title={svc.hero?.title ?? slug}
      subtitle={svc.hero?.subtitle ?? svc.overview?.description}
    />
  );
}
