import type { Metadata } from "next";
import { home, faq, metaFrom } from "@/lib/content";
import { getPublishedPosts } from "@/lib/blog-data";
import { getActiveProducts } from "@/lib/product-data";
import { getAccount, enquiryAuthFor } from "@/lib/account";
import { HeroSlider } from "@/components/home/hero-slider";
import { TrustedPartners } from "@/components/home/trusted-partners";
import { Certifications } from "@/components/home/certifications";
import { StatsStrip } from "@/components/home/stats-strip";
import { ServicesGrid } from "@/components/home/services-grid";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { IndustriesStrip } from "@/components/home/industries-strip";
import { ProductsTeaser } from "@/components/home/products-teaser";
import { GlobalCoverage } from "@/components/home/global-coverage";
import { HowItWorks } from "@/components/home/how-it-works";
import { Testimonials } from "@/components/home/testimonials";
import { AppFeatures } from "@/components/home/app-features";
import { BlogTeaser } from "@/components/home/blog-teaser";
import { FaqSection } from "@/components/home/faq-section";

export const metadata: Metadata = metaFrom(home.meta, "/");

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AWSOverseas",
  description: home.meta?.description,
  url: "https://awsoverseas.com",
  slogan: home.hero?.title,
  areaServed: "Worldwide",
};

export default async function HomePage() {
  const [posts, catalog, account] = await Promise.all([getPublishedPosts(), getActiveProducts(), getAccount()]);
  const auth = enquiryAuthFor(account);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
      />

      <HeroSlider hero={home.hero} exportHero={home.exportHero} />
      <TrustedPartners data={home.trustedPartners} partners={home.industries.items} />
      <Certifications data={home.certifications} />
      <StatsStrip stats={home.hero.stats} />
      <ServicesGrid data={home.services} />
      <WhyChooseUs data={home.whyChooseUs} />
      <IndustriesStrip data={home.industries} eyebrow="Industries" />
      <ProductsTeaser data={home.products} products={catalog} auth={auth} eyebrow="Catalog" />
      <GlobalCoverage data={home.coverage} />
      <HowItWorks data={home.howItWorks} eyebrow="Process" />
      <Testimonials data={home.testimonials} eyebrow="Testimonials" />
      <AppFeatures data={home.mobileApp} eyebrow="Mobile App" />
      <BlogTeaser
        data={home.blogs}
        posts={posts.map((p) => ({
          slug: p.slug,
          title: p.title,
          category: p.category,
          readTime: p.read_time,
          imageUrl: p.image_url,
          excerpt: p.excerpt,
        }))}
        eyebrow="Insights"
      />
      <FaqSection data={home.faq} items={faq.accordion.items} eyebrow="FAQ" />
    </>
  );
}
