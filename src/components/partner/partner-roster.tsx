"use client";

import { motion } from "framer-motion";
import {
  Ship,
  FileCheck2,
  Truck,
  Warehouse,
  Anchor,
  Users,
  Globe2,
  type LucideIcon,
} from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

type Item = { title: string; description: string };
type Data = { title: string; description: string; items: Item[] };

const ICONS: LucideIcon[] = [Ship, FileCheck2, Truck, Warehouse, Anchor, Users];

/**
 * "Who can partner" rendered as a classification schedule, echoing Industries'
 * directory register — each row is an eligible partner class, coded like a
 * roster entry rather than a generic feature card grid.
 */
export function PartnerRoster({ data }: { data: Data }) {
  return (
    <Section spacing="lg" tone="soft">
      <SectionHeading eyebrow="Eligibility" title={data.title} subtitle={data.description} />

      <div className="mt-12 overflow-hidden rounded-2xl border border-[#e4e9f2] bg-white">
        {data.items.map((item, i) => {
          const Icon = ICONS[i % ICONS.length];
          const code = String(i + 1).padStart(2, "0");
          return (
            <motion.div
              key={item.title}
              className="group flex items-center gap-5 border-b border-[#e4e9f2] px-5 py-5 transition-colors duration-200 last:border-b-0 hover:bg-[#f6f8fc] sm:gap-6 sm:px-8"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: (i % 6) * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="hidden font-mono text-xs font-semibold text-[#94a3b8] sm:block">
                {code}
              </span>
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#eef3fb] text-[#033e8d] transition-colors duration-300 group-hover:bg-[#033e8d] group-hover:text-white">
                <Icon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-base font-bold text-[#06234d]">{item.title}</p>
                <p className="mt-0.5 truncate text-sm text-[#5b6b82]">{item.description}</p>
              </div>
              <Globe2 className="hidden size-4 shrink-0 text-[#c3cede] sm:block" aria-hidden />
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
