"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

type Step = { step: string; title: string; description: string };
type Data = { title: string; description: string; steps: Step[] };

const ease = [0.16, 1, 0.3, 1] as const;

/** Share → convert → get paid is a real ordered sequence, so numbering earns its place. */
export function ReferralHowItWorks({ data }: { data: Data }) {
  return (
    <Section id="how-it-works" spacing="lg">
      <SectionHeading eyebrow="How It Works" title={data.title} subtitle={data.description} />

      <ol className="relative mt-14 grid gap-10 sm:grid-cols-3">
        <div
          className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-[#dfe6f1] sm:block"
          aria-hidden
        />
        {data.steps.map((s, i) => (
          <motion.li
            key={s.step}
            className="relative flex flex-col"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.1, ease }}
          >
            <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full bg-[#01214a] font-mono text-sm font-bold text-white ring-4 ring-white">
              {s.step}
            </span>
            <h3 className="mt-4 text-base font-bold text-[#01214a]">{s.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[#5b6b82]">{s.description}</p>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}
