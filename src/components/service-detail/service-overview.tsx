"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

type Data = { title: string; description: string; features: string[] };

/**
 * Two-column overview: narrative left, feature checklist right — distinct
 * from Industries/Services' centered-prose overview since this page has a
 * real features[] array worth giving its own column rather than folding
 * into a sentence.
 */
export function ServiceOverview({ data }: { data: Data }) {
  return (
    <Section spacing="md">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <Reveal direction="up">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">
            Overview
          </p>
          <h2 className="mt-3 text-3xl font-bold text-[#002144] sm:text-4xl lg:text-[2.25rem]">
            {data.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#5b6b82]">
            {data.description}
          </p>
        </Reveal>

        <motion.ul
          className="grid content-start gap-3 sm:grid-cols-2 lg:grid-cols-1"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {data.features.map((f) => (
            <motion.li
              key={f}
              className="flex items-center gap-3 rounded-xl border border-[#e4e9f2] bg-white px-4 py-3.5 text-sm font-semibold text-[#002144]"
              variants={{
                hidden: { opacity: 0, x: 16 },
                show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#fceef1] text-[#8d1a32]">
                <Check className="size-3.5" />
              </span>
              {f}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </Section>
  );
}
