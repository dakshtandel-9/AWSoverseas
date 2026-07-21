"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { iconFor } from "@/lib/icons";

type Data = { title: string; description: string; highlights: string[] };

/**
 * Overview copy plus the `highlights` array (unique to this page's JSON,
 * unlike Industries' plain overview) rendered as a capability strip of
 * icon+label tags — a manifest of what "complete" logistics covers, not a
 * generic bullet list.
 */
export function CapabilityStrip({ data }: { data: Data }) {
  return (
    <Section spacing="md">
      <Reveal direction="up">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">
            Scope of Cover
          </p>
          <h2 className="mt-3 text-3xl font-bold text-[#002144] sm:text-4xl lg:text-[2.5rem]">
            {data.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#5b6b82]">
            {data.description}
          </p>
        </div>
      </Reveal>

      <motion.div
        className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-3"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {data.highlights.map((h) => {
          const Icon = iconFor(h);
          return (
            <motion.span
              key={h}
              className="inline-flex items-center gap-2 rounded-full border border-[#e4e9f2] bg-white px-4 py-2.5 text-sm font-semibold text-[#002144] shadow-[0_1px_2px_rgba(4,22,47,0.04)]"
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              <Icon className="size-4 text-maroon-admin" />
              {h}
            </motion.span>
          );
        })}
      </motion.div>
    </Section>
  );
}
