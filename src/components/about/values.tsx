"use client";

import { motion } from "framer-motion";
import {
  Heart,
  ShieldCheck,
  Timer,
  Sparkles,
  Globe2,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

type Item = { title: string; description: string };
type Data = { title: string; items: Item[] };

/**
 * Core values as a flat editorial index rather than heavy cards or 01/02/03
 * markers — a set of principles has no inherent order, so it reads as a
 * codified list with hairline dividers. Icons chosen per value.
 */
const ICONS: Record<string, LucideIcon> = {
  "Customer First": Heart,
  Integrity: ShieldCheck,
  Reliability: Timer,
  Innovation: Sparkles,
  "Global Excellence": Globe2,
  "Continuous Improvement": TrendingUp,
};

export function Values({ data }: { data: Data }) {
  return (
    <Section spacing="lg" tone="soft">
      <SectionHeading eyebrow="What We Stand By" title={data.title} align="left" />

      <div className="mt-12 grid gap-x-12 sm:grid-cols-2">
        {data.items.map((item, i) => {
          const Icon = ICONS[item.title] ?? Sparkles;
          return (
            <motion.div
              key={item.title}
              className="group flex items-start gap-5 border-t border-[#dfe6f1] py-7 first:border-t-0 sm:[&:nth-child(2)]:border-t-0"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-xl bg-white text-[#033e8d] shadow-[0_1px_2px_rgba(4,22,47,0.04),0_8px_20px_-10px_rgba(4,22,47,0.2)] ring-1 ring-[#e4e9f2] transition-colors duration-300 group-hover:bg-[#033e8d] group-hover:text-white">
                <Icon className="size-5" />
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-[#06234d]">{item.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-[#5b6b82]">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
