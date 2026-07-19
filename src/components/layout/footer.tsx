import Link from "next/link";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { FOOTER_NAV, SITE } from "@/lib/site";
import { blog } from "@/lib/content";
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
  { label: "International Logistics", href: "/services" },
  { label: "Export Documentation", href: "/services/export-services" },
  { label: "Customs Clearance", href: "/services/customs-clearance" },
  { label: "Warehousing", href: "/services/warehousing" },
];

const FOOTER_RESOURCES = [
  { label: "Export Guide", href: "/blog" },
  { label: "Product Catalog", href: "/products" },
  { label: "Industry Insights", href: "/blog" },
  { label: "FAQ", href: "/faq" },
];

export async function Footer() {
  const settings = await getSiteSettings();
  const { phone1, phone2, email, address } = settings;
  const newsletter = blog.newsletter;
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-brand-950 text-brand-100/80">
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-60" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.15]" aria-hidden />

      <Container className="relative">
        {/* Newsletter band */}
        <div className="grid gap-8 border-b border-white/10 py-14 lg:grid-cols-2 lg:items-center">
          <div>
            <h3 className="text-2xl font-bold !text-white sm:text-3xl">
              {newsletter?.title ?? "Stay Updated on Global Trade, Product Sourcing & Export Opportunities"}
            </h3>
            <p className="mt-3 max-w-md text-brand-100/70">
              {newsletter?.description ??
                "Supplier sourcing guides, export tips and shipping updates — straight to your inbox."}
            </p>
          </div>
          <div className="lg:justify-self-end">
            <NewsletterForm
              placeholder={newsletter?.placeholder ?? "Enter your email"}
              buttonText={newsletter?.buttonText ?? "Subscribe"}
              successText={newsletter?.successMessage ?? "You're subscribed. Welcome aboard!"}
              privacyText={newsletter?.privacyText}
            />
          </div>
        </div>

        {/* Link columns */}
        <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo tone="light" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-brand-100/65">
              AWSOverseas is your trusted partner for product sourcing, supplier verification,
              export management and international logistics. We help businesses worldwide source
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

          <FooterColumn title="Services" className="lg:col-span-3">
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
        <div className="flex flex-col gap-6 border-t border-white/10 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-brand-100/60">
            © {year} {SITE.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {SOCIALS.map(({ name, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="grid size-10 place-items-center rounded-full bg-white/5 text-brand-100/80 ring-1 ring-white/10 transition-colors hover:bg-accent-500 hover:text-white"
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
      <h4 className="text-sm font-semibold uppercase tracking-wider !text-white">{title}</h4>
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="group inline-flex items-center gap-1.5 text-sm text-brand-100/70 transition-colors hover:text-white"
      >
        <ArrowRight className="size-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
        {children}
      </Link>
    </li>
  );
}
