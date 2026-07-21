"use client";

import { motion } from "framer-motion";
import {
  Globe2,
  TrendingUp,
  Headset,
  ShieldCheck,
  Cpu,
  Handshake,
  type LucideIcon,
} from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

type Item = { title: string; description: string };
type Data = { title: string; description: string; items: Item[] };

const ICONS: LucideIcon[] = [Globe2, TrendingUp, Headset, ShieldCheck, Cpu, Handshake];

const ease = [0.16, 1, 0.3, 1] as const;

/** Flat benefit grid — a value proposition list, not a sequence, so no numbering. */
export function PartnerBenefits({ data }: { data: Data }) {
  return (
    <Section spacing="lg">
      <SectionHeading eyebrow="Why Partner" title={data.title} subtitle={data.description} />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((item, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <motion.div
              key={item.title}
              className="group rounded-2xl border border-[#e4e9f2] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#d6274c]/30 hover:shadow-[0_18px_40px_-20px_rgba(3,62,141,0.25)]"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease }}
            >
              <span className="grid size-12 place-items-center rounded-xl bg-[#eef3fb] text-[#002144] transition-colors duration-300 group-hover:bg-[#002144] group-hover:text-white">
                <Icon className="size-5.5" />
              </span>
              <h3 className="mt-5 text-base font-bold text-[#002144]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5b6b82]">{item.description}</p>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
