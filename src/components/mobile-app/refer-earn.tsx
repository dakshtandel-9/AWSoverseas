"use client";

import { motion } from "framer-motion";
import { Check, Gift } from "lucide-react";
import { Section } from "@/components/ui/section";

type Step = { step: string; title: string };
type Data = { title: string; description: string; steps: Step[]; benefits: string[] };

/**
 * Refer & Earn genuinely is a 3-step process (share code → friend books →
 * earn credits), so numbered markers are earned here — unlike the flat lists
 * used elsewhere on this page for non-sequential feature sets.
 */
export function ReferEarn({ data }: { data: Data }) {
  return (
    <Section spacing="lg" tone="ink" className="overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden
        style={{
          background:
            "radial-gradient(55% 45% at 90% 0%, rgba(15,173,232,0.18) 0%, transparent 60%), radial-gradient(50% 45% at 5% 100%, rgba(3,62,141,0.4) 0%, transparent 55%)",
        }}
      />

      <div className="relative grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#0fade8]/30 bg-[#0fade8]/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#48b8f8]">
            <Gift className="size-3.5" />
            Refer &amp; Earn
          </span>
          <h2
            className="mt-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.5rem]"
            style={{ color: "#ffffff" }}
          >
            {data.title}
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">{data.description}</p>

          <ul className="mt-8 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {data.benefits.map((b) => (
              <li key={b} className="flex items-center gap-2.5 text-sm text-white/85">
                <Check className="size-4 shrink-0 text-[#48b8f8]" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <ol className="relative flex flex-col gap-5">
          {data.steps.map((s, i) => (
            <motion.li
              key={s.step}
              className="relative flex items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-5"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#0fade8]/15 font-heading text-base font-extrabold text-[#48b8f8]">
                {s.step}
              </span>
              <span className="text-[15px] font-semibold text-white">{s.title}</span>
            </motion.li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
