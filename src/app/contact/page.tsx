import type { Metadata } from "next";
import { contact, metaFrom } from "@/lib/content";
import { getSiteSettings } from "@/lib/site-settings";
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

export default async function Page() {
  const settings = await getSiteSettings();
  const location = settings.address
    ? { office: contact.officeLocations?.locations?.[0]?.office ?? "Head Office", address: settings.address, city: "", country: "" }
    : contact.officeLocations?.locations?.[0];

  const contactInfoItems = [
    { type: "Phone", value: settings.phone1 },
    ...(settings.phone2 ? [{ type: "Phone", value: settings.phone2 }] : []),
    { type: "Email", value: settings.email },
    { type: "Support", value: contact.contactInfo?.items?.find((i: { type: string }) => i.type === "Support")?.value ?? settings.email },
  ].filter((i) => i.value);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CONTACT_JSONLD) }}
      />

      <ContactHero data={contact.hero} phone={settings.phone1} />

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

      <OfficeMap data={contact.googleMap} location={location} />
    </>
  );
}
