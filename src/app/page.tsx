import type { Metadata } from "next";
import { home, faq, referralRewards, metaFrom } from "@/lib/content";
import { getPublishedPosts } from "@/lib/blog-data";
import { getActiveProducts } from "@/lib/product-data";
import { getAccount, enquiryAuthFor } from "@/lib/account";
import { HeroSlider } from "@/components/home/hero-slider";
import { TrustedPartners } from "@/components/home/trusted-partners";
import { AboutPreview } from "@/components/home/about-preview";
import { ServicesGrid } from "@/components/home/services-grid";
import { ProductsWeExport } from "@/components/home/products-we-export";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { ReferralTeaser } from "@/components/home/referral-teaser";
import { HowItWorks } from "@/components/home/how-it-works";
import { Testimonials } from "@/components/home/testimonials";
import { GlobalCoverage } from "@/components/home/global-coverage";
import { ProductsTeaser } from "@/components/home/products-teaser";
import { BlogTeaser } from "@/components/home/blog-teaser";
import { FaqSection } from "@/components/home/faq-section";
import { DownloadCTA } from "@/components/home/download-cta";

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
      <AboutPreview data={home.about} stats={home.hero.stats} />
      <ServicesGrid data={home.services} />
      <ProductsWeExport />
      <WhyChooseUs data={home.whyChooseUs} />
      <ReferralTeaser data={referralRewards.homeSection} />
      <HowItWorks data={home.howItWorks} eyebrow="Process" />
      <Testimonials data={home.testimonials} eyebrow="Testimonials" />
      <GlobalCoverage data={home.coverage} />
      <ProductsTeaser data={home.products} products={catalog} auth={auth} eyebrow="Catalog" />
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
      <DownloadCTA data={home.downloadApp} />
    </>
  );
}
