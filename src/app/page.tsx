import type { Metadata } from "next";
import { home, blog, faq, metaFrom } from "@/lib/content";
import { Hero } from "@/components/home/hero";
import { TrustedPartners } from "@/components/home/trusted-partners";
import { AboutPreview } from "@/components/home/about-preview";
import { ServicesGrid } from "@/components/home/services-grid";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { HowItWorks } from "@/components/home/how-it-works";
import { Testimonials } from "@/components/home/testimonials";
import { GlobalCoverage } from "@/components/home/global-coverage";
import { BlogTeaser } from "@/components/home/blog-teaser";
import { FaqSection } from "@/components/home/faq-section";
import { DownloadCTA } from "@/components/home/download-cta";

export const metadata: Metadata = metaFrom(home.meta, "/");

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AWSoversea",
  description: home.meta?.description,
  url: "https://awsoversea.com",
  slogan: home.hero?.title,
  areaServed: "Worldwide",
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
      />

      <Hero data={home.hero} />
      <TrustedPartners data={home.trustedPartners} partners={home.industries.items} />
      <AboutPreview data={home.about} stats={home.hero.stats} />
      <ServicesGrid data={home.services} />
      <WhyChooseUs data={home.whyChooseUs} />
      <HowItWorks data={home.howItWorks} eyebrow="Process" />
      <Testimonials data={home.testimonials} eyebrow="Testimonials" />
      <GlobalCoverage data={home.coverage} />
      <BlogTeaser data={home.blogs} posts={blog.blogGrid.posts} eyebrow="Insights" />
      <FaqSection data={home.faq} items={faq.accordion.items} eyebrow="FAQ" />
      <DownloadCTA data={home.downloadApp} />
    </>
  );
}
