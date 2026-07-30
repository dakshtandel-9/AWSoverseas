"use client";

import { motion } from "framer-motion";
import { Leaf, HeartHandshake, type LucideIcon } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

type Item = { title: string; description: string };
type Data = { title: string; items: Item[] };

const MOSS = "#2F6B4F";

const ICONS: Record<string, LucideIcon> = {
  "Climate Action": Leaf,
  "Community-Driven Initiatives": HeartHandshake,
};

/**
 * Two parallel categories, deliberately not numbered 01/02 — Climate and
 * Community aren't a sequence, they're a simultaneous split (see the hero's
 * routing diagram).
 */
export function Pillars({ data }: { data: Data }) {
  return (
    <Section spacing="lg">
      <SectionHeading eyebrow="Where the Contribution Goes" title={data.title} align="left" />

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {data.items.map((item, i) => {
          const Icon = ICONS[item.title] ?? Leaf;
          return (
            <motion.div
              key={item.title}
              className="group rounded-2xl border border-[#e4e9f2] bg-white p-8 shadow-[0_1px_2px_rgba(4,22,47,0.04),0_12px_28px_-16px_rgba(4,22,47,0.16)] transition-colors duration-300"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                className="grid size-12 shrink-0 place-items-center rounded-xl text-white transition-transform duration-300 group-hover:scale-105"
                style={{ background: MOSS }}
              >
                <Icon className="size-5" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-[#1A0A53]">{item.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#5b6b82]">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
