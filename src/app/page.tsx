import type { Metadata } from "next";
import { home, faq, metaFrom } from "@/lib/content";
import { getActiveProducts } from "@/lib/product-data";
import { getAccount, enquiryAuthFor } from "@/lib/account";
import { ImageHeroSlider } from "@/components/home/image-hero-slider";
import { Certifications } from "@/components/home/certifications";
import { WhyChooseUs } from "@/components/home/why-choose-us";
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

      {/* <HeroSlider hero={home.hero} exportHero={home.exportHero} /> */}
      <ImageHeroSlider
        slides={[
          {
            image: "/hero-slider/slide-1-ship.jpg",
            video: "/hero-slider/ship.mp4",
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
            image: "/hero-slider/slide-2-warehouse.jpg",
            video: "/hero-slider/Manufacturing.mp4",
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
            image: "/hero-slider/slide-3-port.jpg",
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
          },
          {
            image: "/hero-slider/Manufacturing.png",
            imageAlt: "Textile manufacturing facility with industrial production lines",
            badge: "TRUSTED MANUFACTURING NETWORK",
            title: "Sourced and Manufactured to Your Exact Standard",
            subtitle:
              "We vet factories, audit production lines, and oversee manufacturing at the source, so every order leaves the facility meeting the specification, quality, and timeline you agreed to.",
            primaryButton: "Get a Sourcing Quote",
            primaryButtonHref: "/quote",
            secondaryButton: "Meet Our Sourcing Agents",
            secondaryButtonHref: "/sourcing-agent",
          },
        ]}
      />
      <WhyChooseUs data={home.whyChooseUs} />
      <ProductsTeaser data={home.products} products={catalog} auth={auth} eyebrow="Catalog" />
      <GlobalCoverage data={home.coverage} />
      <HowItWorks data={home.howItWorks} eyebrow="Process" />
      <Testimonials data={home.testimonials} eyebrow="Testimonials" />
      <AppFeatures data={home.mobileApp} eyebrow="Mobile App" />
      <FaqSection data={home.faq} items={faq.accordion.items} eyebrow="FAQ" />
      <Certifications data={home.certifications} />
    </>
  );
}
