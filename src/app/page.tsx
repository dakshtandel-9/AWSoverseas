import type { Metadata } from "next";
import { home, faq, metaFrom } from "@/lib/content";
import { getActiveProducts } from "@/lib/product-data";
import { getAccount, enquiryAuthFor } from "@/lib/account";
import { ImageHeroSlider } from "@/components/home/image-hero-slider";
import { ReferralPopup } from "@/components/home/referral-popup";
import { Certifications } from "@/components/home/certifications";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { WarehouseConsolidation } from "@/components/home/warehouse-consolidation";
import { ProductsTeaser } from "@/components/home/products-teaser";
import { GlobalCoverage } from "@/components/home/global-coverage";
import { HowItWorks } from "@/components/home/how-it-works";
import { Testimonials } from "@/components/home/testimonials";
import { AppFeatures } from "@/components/home/app-features";
import { FaqSection } from "@/components/home/faq-section";

export const metadata: Metadata = metaFrom(home.meta, "/");

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "aws overseas",
  description: home.meta?.description,
  url: "https://awsoverseas.com",
  slogan: home.hero?.title,
  areaServed: "Worldwide",
};

export default async function HomePage() {
  const [catalog, account] = await Promise.all([getActiveProducts(), getAccount()]);
  const auth = enquiryAuthFor(account);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
      />

      <ReferralPopup loggedIn={Boolean(account)} referralCode={account?.profile.referral_code ?? null} />

      {/* <HeroSlider hero={home.hero} exportHero={home.exportHero} /> */}
      <ImageHeroSlider
        slides={[
          {
            video: "https://res.cloudinary.com/dwethh3fq/video/upload/v1784927227/awsoversea/hero-slider/ship.mp4",
            imageAlt: "Container ship loaded with cargo at sea",
            badge: home.hero.badge,
            title: home.hero.title,
            subtitle: home.hero.subtitle,
            primaryButton: home.hero.primaryButton,
            primaryButtonHref: "/quote",
            secondaryButton: home.hero.secondaryButton,
            secondaryButtonHref: "/mobile-app",
          },
          {
            video: "https://res.cloudinary.com/dwethh3fq/video/upload/v1784927234/awsoversea/hero-slider/manufacturing.mp4",
            imageAlt: "Warehouse aisle stacked with export-ready goods",
            badge: home.exportHero.badge,
            title: home.exportHero.title,
            subtitle: home.exportHero.subtitle,
            primaryButton: home.exportHero.primaryButton,
            primaryButtonHref: "/products",
            secondaryButton: home.exportHero.secondaryButton,
            secondaryButtonHref: "/products",
          },
          {
            video: "https://res.cloudinary.com/dwethh3fq/video/upload/v1784927226/awsoversea/hero-slider/cargo.mp4",
            imageAlt: "Aerial view of a container port with cranes and cargo ships",
            badge: "GLOBAL FREIGHT & LOGISTICS SOLUTIONS",
            title: "Move Cargo Anywhere in the World",
            subtitle:
              "From air freight and sea freight to customs clearance, warehousing, and door-to-door delivery, aws overseas manages every stage of international logistics with complete visibility and reliable execution.",
            primaryButton: "Request Shipping Quote",
            primaryButtonHref: "/quote",
            secondaryButton: "Explore Logistics Services",
            secondaryButtonHref: "/services",
          },
          {
            video: "https://res.cloudinary.com/dwethh3fq/video/upload/v1784927228/awsoversea/hero-slider/factory-to-destination.mp4",
            imageAlt: "Export warehouse with packaged goods, pallets, and loading docks",
            badge: "END-TO-END EXPORT MANAGEMENT",
            title: "Your Export Partner From Factory to Destination",
            subtitle:
              "We don't just ship products—we identify trusted suppliers, negotiate pricing, inspect product quality, prepare export documentation, coordinate freight, and deliver globally through one dedicated partner.",
            primaryButton: "Start Export Journey",
            primaryButtonHref: "/quote",
            secondaryButton: "Talk to an Expert",
            secondaryButtonHref: "/contact",
          },
          {
            video: "https://res.cloudinary.com/dwethh3fq/video/upload/v1785242161/awsoversea/hero-slider/warehouse.mp4",
            imageAlt: "Warehouse floor where export orders are received, packed, and staged for shipping",
            badge: "Warehousing & Order Consolidation",
            title: "One Shipment, Not Five",
            subtitle:
              "Orders from several suppliers land in our India warehouse, where goods are checked, packed to export grade, labeled, and consolidated into a single shipment — so you clear one load instead of five.",
            primaryButton: "Request Warehousing Quote",
            primaryButtonHref: "/quote",
            secondaryButton: "See Warehousing Service",
            secondaryButtonHref: "/services/warehousing",
          },
        ]}
      />
      <WhyChooseUs data={home.whyChooseUs} />
      <ProductsTeaser data={home.products} products={catalog} auth={auth} eyebrow="Catalog" />
      <GlobalCoverage data={home.coverage} />
      <WarehouseConsolidation data={home.warehouse} />
      <HowItWorks data={home.howItWorks} eyebrow="Process" />
      <Testimonials data={home.testimonials} eyebrow="Testimonials" />
      <AppFeatures data={home.mobileApp} eyebrow="Mobile App" />
      <FaqSection data={home.faq} items={faq.accordion.items} eyebrow="FAQ" />
      <Certifications data={home.certifications} />
    </>
  );
}
