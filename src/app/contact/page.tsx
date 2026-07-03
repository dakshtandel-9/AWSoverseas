import type { Metadata } from "next";
import { contact, metaFrom } from "@/lib/content";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactChannels } from "@/components/contact/contact-channels";
import { OfficeMap } from "@/components/contact/office-map";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = metaFrom(contact.meta, "/contact");

const CONTACT_JSONLD = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: contact.meta?.title,
  description: contact.meta?.description,
  url: "https://awsoversea.com/contact",
};

export default function Page() {
  const phone = contact.contactInfo?.items?.find(
    (i: { type: string }) => i.type === "Phone",
  )?.value;
  const location = contact.officeLocations?.locations?.[0];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CONTACT_JSONLD) }}
      />

      <ContactHero data={contact.hero} phone={phone} />

      <Section spacing="lg">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-10">
          <ContactForm data={contact.contactForm} />
          <ContactChannels
            contactInfo={contact.contactInfo}
            whatsapp={contact.whatsapp}
            businessHours={contact.businessHours}
            location={location}
          />
        </div>
      </Section>

      <OfficeMap data={contact.googleMap} location={location} />
    </>
  );
}
