"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { iconFor } from "@/lib/icons";

type ServiceBlock = {
  title: string;
  description: string;
  features: string[];
  button: string;
};

type Item = ServiceBlock & { href: string; code: string };

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * The service lines rendered as tariff-schedule cards — each gets a 2-digit
 * line code (not a 01/02/03 narrative sequence, but a genuine schedule-item
 * number, same device Industries used for its directory rows). Deliberately
 * a card grid rather than Industries' accordion, since these link out to
 * full detail pages instead of expanding inline. Most link to /services/[slug];
 * Sourcing Agent links to its own top-level page instead (/sourcing-agent).
 */
export function ServicesSchedule({ items }: { items: Item[] }) {
  return (
    <Section spacing="lg" tone="soft">
      <SectionHeading
        eyebrow="Service Lines"
        title="Every Stage, One Partner"
        subtitle="Each line item below is a full service in its own right — open one for scope, features, and how to book it."
        align="left"
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const Icon = iconFor(item.title);
          return (
            <motion.div
              key={item.title}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#e4e9f2] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#002144]/30 hover:shadow-[0_24px_48px_-24px_rgba(4,22,47,0.25)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease }}
            >
              <div className="flex items-start justify-between">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#eef3fb] text-[#002144] transition-colors duration-300 group-hover:bg-[#002144] group-hover:text-white">
                  <Icon className="size-5" />
                </span>
                <span className="font-mono text-[11px] font-semibold tracking-[0.16em] text-[#94a3b8]">
                  LINE&nbsp;{item.code}
                </span>
              </div>

              <h3 className="mt-5 text-lg font-bold text-[#002144]">{item.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-[#5b6b82]">
                {item.description}
              </p>

              <ul className="mt-5 flex flex-1 flex-col gap-2">
                {item.features.slice(0, 4).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px] text-[#2a3a52]">
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[#9e4953]" aria-hidden />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={item.href}
                className="mt-6 inline-flex items-center gap-1.5 border-t border-[#e4e9f2] pt-5 text-sm font-bold text-[#002144] transition-colors group-hover:text-[#861b28]"
              >
                {item.button}
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
