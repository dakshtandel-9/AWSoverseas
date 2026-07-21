"use client";

import { motion } from "framer-motion";
import {
  Factory,
  ShoppingCart,
  Pill,
  Shirt,
  Car,
  Cpu,
  Store,
  Globe2,
  FileCheck2,
  MessageSquareText,
  type LucideIcon,
} from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

type Item = { title: string; icon: string };
type Data = { title: string; description: string; items: Item[] };

const ICONS: Record<string, LucideIcon> = {
  factory: Factory,
  "shopping-cart": ShoppingCart,
  pill: Pill,
  shirt: Shirt,
  car: Car,
  cpu: Cpu,
  store: Store,
  globe: Globe2,
};

/** Slugs of industries that have a detailed profile section below. */
const PROFILED = new Set([
  "Manufacturing",
  "eCommerce",
  "Pharmaceutical",
  "Textile",
  "Automotive",
]);

/**
 * The 8-industry grid, rendered as a classification schedule rather than
 * Home's icon+blurb card (src/components/home/trusted-partners.tsx) — this
 * page is the destination those cards link to, so it needs its own register.
 * Each row gets a 2-digit classification code and an honest status: five
 * industries have a full profile below; the other three are handled the
 * same way but on request, which is stated rather than papered over with
 * invented copy.
 */
export function IndustriesDirectory({ data }: { data: Data }) {
  return (
    <Section spacing="lg" tone="soft">
      <SectionHeading eyebrow="Directory" title={data.title} subtitle={data.description} />

      <div className="mt-12 overflow-hidden rounded-2xl border border-[#e4e9f2] bg-white">
        {data.items.map((item, i) => {
          const Icon = ICONS[item.icon] ?? Globe2;
          const hasProfile = PROFILED.has(item.title);
          const code = String(i + 1).padStart(2, "0");

          return (
            <motion.div
              key={item.title}
              className="group flex items-center gap-5 border-b border-[#e4e9f2] px-5 py-5 transition-colors duration-200 last:border-b-0 hover:bg-[#f6f8fc] sm:gap-6 sm:px-8"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: (i % 8) * 0.04, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="hidden font-mono text-xs font-semibold text-[#94a3b8] sm:block">
                {code}
              </span>
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#eef3fb] text-[#002144] transition-colors duration-300 group-hover:bg-[#002144] group-hover:text-white">
                <Icon className="size-5" />
              </span>
              <span className="min-w-0 flex-1 truncate text-base font-bold text-[#002144]">
                {item.title}
              </span>

              {hasProfile ? (
                <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-[#fceef1] px-3 py-1 text-[11px] font-semibold text-[#8d1a32] sm:inline-flex">
                  <FileCheck2 className="size-3.5" />
                  Profile below
                </span>
              ) : (
                <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-[#f6f8fc] px-3 py-1 text-[11px] font-semibold text-[#5b6b82] ring-1 ring-[#e4e9f2] sm:inline-flex">
                  <MessageSquareText className="size-3.5" />
                  Custom quote
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
