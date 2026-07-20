import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { individualService, metaFrom } from "@/lib/content";
import { ServiceHero } from "@/components/service-detail/service-hero";
import { ServiceOverview } from "@/components/service-detail/service-overview";
import { ServiceBenefits } from "@/components/service-detail/service-benefits";
import { ServiceProcess } from "@/components/service-detail/service-process";
import { ServiceWhy } from "@/components/service-detail/service-why";
import { ServiceFaq } from "@/components/service-detail/service-faq";
import { ServiceCta } from "@/components/service-detail/service-cta";

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

  const SERVICE_JSONLD = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: svc.hero?.title,
    provider: { "@type": "Organization", name: "AWS Overseas" },
    areaServed: "Worldwide",
    description: svc.overview?.description,
    url: `https://awsoverseas.com/services/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_JSONLD) }}
      />

      <ServiceHero data={svc.hero} stepCount={svc.process?.steps?.length ?? 0} />
      <ServiceOverview data={svc.overview} />
      <ServiceBenefits data={svc.benefits} />
      <ServiceProcess data={svc.process} />
      <ServiceWhy data={svc.whyAWS} />
      <ServiceFaq data={svc.faq} />
      <ServiceCta data={svc.cta} />
    </>
  );
}
