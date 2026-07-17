import type { Metadata } from "next";
import { about, metaFrom } from "@/lib/content";
import { AboutHero } from "@/components/about/about-hero";
import { Story } from "@/components/about/story";
import { MissionVision } from "@/components/about/mission-vision";
import { Values } from "@/components/about/values";
import { GlobalNetwork } from "@/components/about/global-network";
import { Certifications } from "@/components/about/certifications";
import { WhyChoose } from "@/components/about/why-choose";
import { AboutCta } from "@/components/about/about-cta";

export const metadata: Metadata = metaFrom(about.meta, "/about");

const ABOUT_JSONLD = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: about.meta?.title,
  description: about.meta?.description,
  url: "https://awsoverseas.com/about",
  mainEntity: {
    "@type": "Organization",
    name: "AWSOverseas",
    description: about.companyStory?.description,
    areaServed: "Worldwide",
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ABOUT_JSONLD) }}
      />

      <AboutHero data={about.hero} />
      <Story data={about.companyStory} />
      <MissionVision data={about.missionVision} />
      <Values data={about.values} />
      <GlobalNetwork data={about.globalNetwork} />
      <Certifications data={about.certifications} />
      <WhyChoose data={about.whyChooseUs} />
      <AboutCta data={about.cta} />
    </>
  );
}
