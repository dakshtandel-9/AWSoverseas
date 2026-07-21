"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Plane } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import { iconFor } from "@/lib/icons";
import { SERVICE_LINKS } from "@/lib/site";

type Item = { title: string; description: string };
type Data = { title: string; subtitle: string; items: Item[] };

// Per-service supporting stat shown on compact cards
const SERVICE_STATS: Record<string, string> = {
  "Product Sourcing": "500+ verified manufacturers",
  "Supplier Verification": "On-ground checks in India",
  "Quality Inspection": "Pre-shipment, every order",
  "Export Documentation": "Filed by our own team",
  "Freight Forwarding": "100+ ports worldwide",
  "Door Delivery": "Door-to-door worldwide",
  "Cargo Tracking": "Live via mobile app",
};

// Sourcing-side cards route to /sourcing-agent — they have no matching
// slug in individualService.json (that file only covers freight services).
const SOURCING_TITLES = ["sourcing", "supplier", "verification", "inspection", "quality"];

function slugFor(title: string) {
  const key = title.toLowerCase();
  if (SOURCING_TITLES.some((t) => key.includes(t))) return "/sourcing-agent";
  const found = SERVICE_LINKS.find((s) =>
    s.title.toLowerCase().includes(title.toLowerCase().split(" ")[0]),
  );
  return found ? `/services/${found.slug}` : "/services";
}

// Animated route line with a plane icon drifting across it
function AirplaneRoute() {
  return (
    <div className="pointer-events-none relative w-full opacity-30" aria-hidden>
      <div className="relative flex items-center">
        {/* Dashed line */}
        <svg viewBox="0 0 320 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <motion.line
            x1="0" y1="6" x2="320" y2="6"
            stroke="#002144" strokeWidth="1.5" strokeDasharray="6 8"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeInOut", delay: 0.3 }}
          />
          <motion.circle cx="6" cy="6" r="3.5" fill="#002144"
            initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.3, ease: "backOut" }}
          />
          <motion.circle cx="314" cy="6" r="3.5" fill="#002144"
            initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
            transition={{ delay: 1.4, duration: 0.3, ease: "backOut" }}
          />
        </svg>
        {/* Plane travelling left→right, rotated to point right */}
        <motion.div
          className="absolute -translate-y-1/2"
          style={{ top: "50%" }}
          initial={{ left: "2%" }}
          whileInView={{ left: "86%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.4, 0, 0.2, 1], delay: 0.5 }}
        >
          <Plane className="size-10 text-[#002144]" style={{ transform: "rotate(45deg)" }} strokeWidth={1.5} fill="#002144" />
        </motion.div>
      </div>
    </div>
  );
}

export function ServicesGrid({ data }: { data: Data; eyebrow?: string }) {
  const [featured, ...rest] = data.items;
  const FeaturedIcon = iconFor(featured.title);

  return (
    <Section tone="soft" spacing="lg" id="services">
      {/* Heading */}
      <div className="mb-14 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#5b6b82]">Our Services</p>
          <h2 className="mt-3 max-w-md text-3xl font-bold leading-tight text-[#002144] sm:text-4xl lg:text-[2.6rem]">
            Sourcing & Shipping,<br className="hidden sm:block" /> End to End
          </h2>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-[#5b6b82] lg:text-right">{data.subtitle}</p>
      </div>

      {/*
        Desktop layout: 2-col
          Left col: featured tall card (row-span-2)
          Right col: 2 compact cards stacked
        Second row:
          Left: 2 compact cards (or remaining)
          Right: already occupied by row-span-2
        Then last row: remaining cards

        Simplest approach: CSS grid with explicit placement
      */}
      <div className="grid gap-5 lg:grid-cols-2">

        {/* Featured — left col, spans 2 rows */}
        <motion.div
          className="flex lg:row-span-2"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="flex h-full w-full"
          >
            <Link
              href={slugFor(featured.title)}
              className="group relative flex h-full min-h-[274px] flex-col overflow-hidden rounded-3xl bg-[#CFE8FF] p-8 text-ink shadow-[0_12px_48px_-12px_rgba(3,62,141,0.25)] lg:min-h-[323px] lg:p-10"
            >
              {/* Dot-grid texture */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage: "radial-gradient(circle, rgba(1,33,74,0.9) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
                aria-hidden
              />
              {/* Top-right radial glow */}
              <div className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-[#9e4953]/25 blur-3xl" aria-hidden />
              {/* Bottom-left secondary glow */}
              <div className="pointer-events-none absolute -bottom-12 -left-12 size-48 rounded-full bg-[#9e4953]/15 blur-2xl" aria-hidden />

              {/* Icon */}
              <span className="relative grid size-16 place-items-center rounded-2xl bg-ink/8 ring-1 ring-ink/15 backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
                <FeaturedIcon className="size-8 text-maroon-admin" />
              </span>

              {/* Animated route — sits between icon and content, fills available space */}
              <div className="flex flex-1 items-center">
                <AirplaneRoute />
              </div>

              {/* Content */}
              <div className="relative">
                {/* Stat badge */}
                <span className="mb-4 inline-flex items-center rounded-full bg-ink/8 px-3 py-1 text-[11px] font-semibold tracking-wide text-maroon-admin ring-1 ring-ink/15">
                  {SERVICE_STATS[featured.title] ?? "500+ verified manufacturers"}
                </span>
                <h3 className="text-2xl font-bold lg:text-3xl" style={{ color: "#002144" }}>{featured.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-ink/70">{featured.description}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-maroon-admin">
                  Explore service
                  <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Right col: 2 compact cards stacked, each row is 1fr so combined height = featured card */}
        <div className="grid gap-5" style={{ gridTemplateRows: "1fr 1fr" }}>
          {rest.slice(0, 2).map((item, i) => {
            const Icon = iconFor(item.title);
            const stat = SERVICE_STATS[item.title];
            return (
              <motion.div
                key={item.title}
                className="flex"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <CompactCard item={item} Icon={Icon} stat={stat} href={slugFor(item.title)} />
              </motion.div>
            );
          })}
        </div>

        {/* Bottom row: remaining 3 cards in a 3-col sub-grid spanning both columns */}
        <Stagger className="grid gap-5 sm:grid-cols-3 lg:col-span-2">
          {rest.slice(2).map((item) => {
            const Icon = iconFor(item.title);
            const stat = SERVICE_STATS[item.title];
            return (
              <StaggerItem key={item.title}>
                <CompactCard item={item} Icon={Icon} stat={stat} href={slugFor(item.title)} />
              </StaggerItem>
            );
          })}
        </Stagger>

      </div>
    </Section>
  );
}

function CompactCard({
  item,
  Icon,
  stat,
  href,
}: {
  item: Item;
  Icon: React.ComponentType<{ className?: string }>;
  stat?: string;
  href: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="flex h-full w-full"
    >
      <Link
        href={href}
        className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-[0_1px_2px_rgba(4,22,47,0.04),0_8px_24px_-8px_rgba(4,22,47,0.10)] ring-1 ring-[#e4e9f2] transition-all duration-300 hover:ring-[#9e4953]/35 hover:shadow-[0_8px_32px_-4px_rgba(4,22,47,0.18),0_0_0_1px_rgba(144, 45, 57,0.2)]"
      >
        {/* Left accent stripe on hover */}
        <span className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 bg-gradient-to-b from-[#002144] to-[#9e4953] transition-transform duration-300 group-hover:scale-y-100" />

        <div className="flex items-start justify-between">
          <span className="grid size-12 place-items-center rounded-xl bg-[#eef3fb] text-[#002144] shadow-[0_2px_8px_rgba(3,62,141,0.08)] transition-all duration-300 group-hover:bg-[#002144] group-hover:text-white group-hover:scale-110">
            <Icon className="size-6" />
          </span>
          <ArrowUpRight className="size-4 text-[#c8d5e8] transition-all duration-200 group-hover:text-[#002144] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>

        <h3 className="mt-4 text-base font-bold text-[#002144]">{item.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-[#5b6b82]">{item.description}</p>

        {stat && (
          <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold text-maroon-admin">
            <span className="size-1.5 rounded-full bg-[#9e4953]" />
            {stat}
          </span>
        )}
      </Link>
    </motion.div>
  );
}
