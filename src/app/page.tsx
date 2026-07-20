import type { Metadata } from "next";
import { home, faq, metaFrom } from "@/lib/content";
import { getPublishedPosts } from "@/lib/blog-data";
import { getActiveProducts } from "@/lib/product-data";
import { getAccount, enquiryAuthFor } from "@/lib/account";
import { HeroSlider } from "@/components/home/hero-slider";
import { ImageHeroSlider } from "@/components/home/image-hero-slider";
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

      {/* <HeroSlider hero={home.hero} exportHero={home.exportHero} /> */}
      <ImageHeroSlider
        slides={[
          {
            image: "/hero-slider/slide-1-ship.jpg",
            imageAlt: "Container ship loaded with cargo at sea",
            badge: home.hero.badge,
            title: home.hero.title,
            subtitle: home.hero.subtitle,
            primaryButton: home.hero.primaryButton,
            primaryButtonHref: "/quote",
            secondaryButton: home.hero.secondaryButton,
            secondaryButtonHref: "/mobile-app",
            stats: home.hero.stats,
          },
          {
            image: "/hero-slider/slide-2-warehouse.jpg",
            imageAlt: "Warehouse aisle stacked with export-ready goods",
            badge: home.exportHero.badge,
            title: home.exportHero.title,
            subtitle: home.exportHero.subtitle,
            primaryButton: home.exportHero.primaryButton,
            primaryButtonHref: "/products",
            secondaryButton: home.exportHero.secondaryButton,
            secondaryButtonHref: "/products",
            stats: home.exportHero.stats,
          },
          {
            image: "/hero-slider/slide-3-port.jpg",
            imageAlt: "Aerial view of a container port with cranes and cargo ships",
            badge: "GLOBAL FREIGHT & LOGISTICS SOLUTIONS",
            title: "Move Cargo Anywhere in the World",
            subtitle:
              "From air freight and sea freight to customs clearance, warehousing, and door-to-door delivery, AWSOverseas manages every stage of international logistics with complete visibility and reliable execution.",
            primaryButton: "Request Shipping Quote",
            primaryButtonHref: "/quote",
            secondaryButton: "Explore Logistics Services",
            secondaryButtonHref: "/industries",
            stats: [
              { number: "100+", label: "Countries Served" },
              { number: "24/7", label: "Shipment Tracking" },
              { number: "1000+", label: "Successful Shipments" },
              { number: "99%", label: "On-Time Delivery" },
            ],
          },
          {
            image: "/hero-slider/slide-4-export-warehouse.jpg",
            imageAlt: "Export warehouse with packaged goods, pallets, and loading docks",
            badge: "END-TO-END EXPORT MANAGEMENT",
            title: "Your Export Partner From Factory to Destination",
            subtitle:
              "We don't just ship products—we identify trusted suppliers, negotiate pricing, inspect product quality, prepare export documentation, coordinate freight, and deliver globally through one dedicated partner.",
            primaryButton: "Start Export Journey",
            primaryButtonHref: "/quote",
            secondaryButton: "Talk to an Expert",
            secondaryButtonHref: "/contact",
            stats: [
              { number: "500+", label: "Verified Suppliers" },
              { number: "100%", label: "Quality Inspection" },
              { number: "40+", label: "Product Categories" },
              { number: "1", label: "Dedicated Partner" },
            ],
          },
        ]}
      />
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
