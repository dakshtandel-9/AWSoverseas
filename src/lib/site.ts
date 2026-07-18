/** Static site structure — routes, service slugs, social links. */
import { individualService } from "@/lib/content";

export const SITE = {
  name: "AWSOverseas",
  tagline: "Global Logistics Beyond Borders",
  url: "https://awsoverseas.com",
};

export type ServiceLink = { slug: string; title: string; description: string };

/** Service detail routes, derived from individualService.json (single source of truth). */
export const SERVICE_LINKS: ServiceLink[] = (individualService.services ?? []).map(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (s: any) => ({
    slug: s.slug as string,
    title: (s.hero?.title ?? s.slug) as string,
    description: (s.hero?.subtitle ?? s.overview?.description ?? "") as string,
  }),
);

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services", mega: true },
  { label: "Industries", href: "/industries" },
  { label: "Products", href: "/products" },
  { label: "Sourcing Agent", href: "/sourcing-agent" },
  { label: "Referral Rewards", href: "/referral-rewards" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_NAV = {
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Sourcing Agent", href: "/sourcing-agent" },
    { label: "Partner With Us", href: "/partner" },
    { label: "Referral Rewards", href: "/referral-rewards" },
    { label: "Contact", href: "/contact" },
    { label: "Request a Quote", href: "/quote" },
  ],
  Resources: [
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
    { label: "Track Shipment", href: "/tracking" },
    { label: "Mobile App", href: "/mobile-app" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Refund Policy", href: "/refund-policy" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
};
