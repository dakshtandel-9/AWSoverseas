import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { FOOTER_NAV, SITE } from "@/lib/site";
import { getSiteSettings } from "@/lib/site-settings";
import { Logo } from "@/components/ui/logo";
import { Container } from "@/components/ui/container";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { SocialIcon, type SocialName } from "@/components/ui/social-icon";

const SOCIALS: { name: SocialName; label: string; href: string }[] = [
  { name: "linkedin", label: "LinkedIn", href: "#" },
  { name: "twitter", label: "Twitter", href: "#" },
  { name: "facebook", label: "Facebook", href: "#" },
  { name: "instagram", label: "Instagram", href: "#" },
];

const FOOTER_SERVICES = [
  { label: "Product Sourcing", href: "/sourcing-agent" },
  { label: "Supplier Verification", href: "/sourcing-agent" },
  { label: "International Shipping", href: "/services" },
  { label: "Export Documentation", href: "/services/export-services" },
  { label: "Customs Clearance", href: "/services/customs-clearance" },
  { label: "Warehousing", href: "/services/warehousing" },
];

const FOOTER_RESOURCES = [
  { label: "Product Catalog", href: "/products" },
  { label: "FAQ", href: "/faq" },
];

const NEWSLETTER = {
  title: "Stay Updated on Global Trade, Product Sourcing & Export Opportunities",
  description: "Supplier sourcing guides, export tips and shipping updates — straight to your inbox.",
  placeholder: "Enter your email address",
  buttonText: "Subscribe",
  successMessage: "Thank you for subscribing to the AWS Overseas newsletter!",
  privacyText: "We respect your privacy. Your email will never be shared with third parties.",
};

export async function Footer() {
  const settings = await getSiteSettings();
  const { phone1, phone2, email, address } = settings;
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#CFE8FF] text-ink/80">
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-60" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.15]" aria-hidden />

      <Container className="relative">
        {/* Newsletter band */}
        <div className="grid gap-8 border-b border-ink/10 py-14 lg:grid-cols-2 lg:items-center">
          <div>
            <h3 className="text-2xl font-bold !text-ink sm:text-3xl">{NEWSLETTER.title}</h3>
            <p className="mt-3 max-w-md text-ink/70">{NEWSLETTER.description}</p>
          </div>
          <div className="lg:justify-self-end">
            <NewsletterForm
              placeholder={NEWSLETTER.placeholder}
              buttonText={NEWSLETTER.buttonText}
              successText={NEWSLETTER.successMessage}
              privacyText={NEWSLETTER.privacyText}
            />
          </div>
        </div>

        {/* Link columns */}
        <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo tone="dark" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink/65">
              AWS Overseas is your trusted partner for product sourcing, supplier verification,
              export management and international shipping. We help businesses worldwide source
              quality products from India and deliver them safely across global markets.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {address && (
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-accent-400" />
                  <span>{address}</span>
                </li>
              )}
              {phone1 && (
                <li className="flex items-center gap-3">
                  <Phone className="size-4 shrink-0 text-accent-400" />
                  <span>{phone1}</span>
                </li>
              )}
              {phone2 && (
                <li className="flex items-center gap-3">
                  <Phone className="size-4 shrink-0 text-accent-400" />
                  <span>{phone2}</span>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-3">
                  <Mail className="size-4 shrink-0 text-accent-400" />
                  <span>{email}</span>
                </li>
              )}
            </ul>
          </div>

          <FooterColumn title="Services" className="lg:col-span-2">
            {FOOTER_SERVICES.map((s) => (
              <FooterLink key={s.label} href={s.href}>
                {s.label}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title="Resources" className="lg:col-span-2">
            {FOOTER_RESOURCES.map((r) => (
              <FooterLink key={r.label} href={r.href}>
                {r.label}
              </FooterLink>
            ))}
          </FooterColumn>

          {Object.entries(FOOTER_NAV)
            .filter(([title]) => title !== "Resources")
            .map(([title, links]) => (
              <FooterColumn key={title} title={title} className="lg:col-span-2">
                {links.map((l) => (
                  <FooterLink key={l.href} href={l.href}>
                    {l.label}
                  </FooterLink>
                ))}
              </FooterColumn>
            ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-6 border-t border-ink/10 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink/60">
            © {year} {SITE.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {SOCIALS.map(({ name, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="grid size-10 place-items-center rounded-full bg-ink/5 text-ink/80 ring-1 ring-ink/10 transition-colors hover:bg-accent-500 hover:text-white"
              >
                <SocialIcon name={name} className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <h4 className="text-sm font-semibold uppercase tracking-wider !text-ink">{title}</h4>
      <ul className="mt-3 space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="inline-flex items-center text-sm text-ink/70 transition-colors hover:text-ink"
      >
        {children}
      </Link>
    </li>
  );
}
