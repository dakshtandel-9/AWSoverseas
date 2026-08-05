import type { Metadata } from "next";
import { Suspense } from "react";
import { contact, metaFrom } from "@/lib/content";
import { getSiteSettings } from "@/lib/site-settings";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactChannels } from "@/components/contact/contact-channels";
import { OfficeLocations } from "@/components/contact/office-locations";
import { CityAgents } from "@/components/contact/city-agents";
import { getPublicOfficeGroups } from "@/lib/office-locations";
import { getPublicCityAgents } from "@/lib/city-agents";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = metaFrom(contact.meta, "/contact");

const CONTACT_JSONLD = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: contact.meta?.title,
  description: contact.meta?.description,
  url: "https://awsoverseas.com/contact",
};

export default async function Page() {
  const [settings, officeGroups, cityAgents] = await Promise.all([
    getSiteSettings(),
    getPublicOfficeGroups(),
    getPublicCityAgents(),
  ]);
  const location = settings.address
    ? { office: contact.officeLocations?.locations?.[0]?.office ?? "Head Office", address: settings.address }
    : contact.officeLocations?.locations?.[0];

  const contactInfoItems = [
    ...settings.phones.filter(Boolean).map((value) => ({ type: "Phone", value })),
    ...settings.emails.filter(Boolean).map((value) => ({ type: "Email", value })),
    {
      type: "Support",
      value: contact.contactInfo?.items?.find((i: { type: string }) => i.type === "Support")?.value ?? settings.emails[0],
    },
  ].filter((i) => i.value);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CONTACT_JSONLD) }}
      />

      <ContactHero data={contact.hero} phone={settings.phones[0]} />

      <Section spacing="lg">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-10">
          <ContactForm data={contact.contactForm} />
          <ContactChannels
            contactInfo={{ title: contact.contactInfo?.title ?? "Contact Information", items: contactInfoItems }}
            whatsapp={{ ...contact.whatsapp, link: settings.whatsappNumber ? `https://wa.me/${settings.whatsappNumber}` : contact.whatsapp?.link }}
            businessHours={contact.businessHours}
            location={location}
          />
        </div>
      </Section>

      <Suspense fallback={null}>
        <CityAgents agents={cityAgents} />
      </Suspense>

      <OfficeLocations groups={officeGroups} />
    </>
  );
}
