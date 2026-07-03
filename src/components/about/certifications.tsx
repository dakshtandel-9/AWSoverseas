"use client";

import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

type Data = { title: string; description: string; items: string[] };

/**
 * Compliance & certifications rendered as stamped document credentials —
 * the one place the manifest metaphor is literally true, since these ARE
 * registrations and codes. Each item gets a mono reference tag.
 */
const REFS = ["REG-01", "REG-02", "REG-03", "STD-01", "STD-02", "STD-03"];

export function Certifications({ data }: { data: Data }) {
  return (
    <Section spacing="lg">
      <SectionHeading
        eyebrow="Compliance & Certifications"
        title={data.title}
        subtitle={data.description}
        align="left"
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((item, i) => (
          <motion.div
            key={item}
            className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-[#e4e9f2] bg-white px-5 py-5 shadow-[0_1px_2px_rgba(4,22,47,0.04),0_8px_24px_-10px_rgba(4,22,47,0.1)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0fade8]/40 hover:shadow-[0_10px_30px_-12px_rgba(4,22,47,0.22)]"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Perforated "stamp" edge accent */}
            <span
              className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#033e8d] to-[#0fade8]"
              aria-hidden
            />
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#eef3fb] text-[#0489c2] transition-colors duration-300 group-hover:bg-[#033e8d] group-hover:text-white">
              <BadgeCheck className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#94a3b8]">
                {REFS[i] ?? "STD"}
              </p>
              <p className="mt-1 text-sm font-bold text-[#06234d]">{item}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
