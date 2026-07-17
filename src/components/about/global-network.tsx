"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { iconFor } from "@/lib/icons";

type Data = { title: string; description: string; highlights: string[] };

const REGIONS = [
  "Asia",
  "Europe",
  "North America",
  "South America",
  "Africa",
  "Middle East",
];

/**
 * Global network. Deliberately NOT the home page's region-card treatment.
 * Here the six regions run as a single continental route line (a manifest of
 * where we reach), and the highlights are the capabilities carried on it.
 */
export function GlobalNetwork({ data }: { data: Data }) {
  return (
    <Section tone="ink" spacing="lg" className="overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden
        style={{
          background:
            "radial-gradient(55% 45% at 15% 0%, rgba(215,40,70,0.16) 0%, transparent 60%), radial-gradient(50% 45% at 95% 100%, rgba(3,62,141,0.4) 0%, transparent 55%)",
        }}
      />

      <div className="relative">
        <Reveal direction="up">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#e05c72]/70">
            Our Global Network
          </p>
          <h2
            className="mt-3 max-w-2xl text-3xl font-bold sm:text-4xl lg:text-[2.5rem] lg:leading-tight"
            style={{ color: "#ffffff" }}
          >
            {data.title}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60">
            {data.description}
          </p>
        </Reveal>

        {/* Continental route line */}
        <Reveal direction="up" delay={0.1}>
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-8 sm:px-9">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
              Route of reach · 6 regions
            </span>
            <div className="relative mt-6">
              <div className="absolute left-0 right-0 top-[7px] h-px bg-white/10" aria-hidden />
              <motion.div
                className="absolute left-0 top-[7px] h-px origin-left bg-gradient-to-r from-[#d72846] to-[#e05c72]"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
                style={{ right: 0 }}
                aria-hidden
              />
              <ol className="relative grid grid-cols-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
                {REGIONS.map((region, i) => (
                  <motion.li
                    key={region}
                    className="flex flex-col items-start"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.45, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="mb-4 size-3.5 rounded-full border-2 border-[#000c1a] bg-[#d72846] shadow-[0_0_0_3px_rgba(172,32,56,0.25)]" />
                    <span className="text-sm font-semibold text-white">{region}</span>
                  </motion.li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>

        {/* Capabilities carried on the network */}
        <motion.ul
          className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {data.highlights.map((h) => {
            const Icon = iconFor(h);
            return (
              <motion.li
                key={h}
                className="group flex items-center gap-3.5 rounded-2xl border border-white/8 bg-white/[0.04] px-5 py-4 transition-colors duration-300 hover:border-white/16 hover:bg-white/[0.08]"
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                }}
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/8 text-[#e05c72]">
                  <Icon className="size-4.5" />
                </span>
                <span className="text-sm font-medium text-white/85">{h}</span>
                <ArrowUpRight className="ml-auto size-4 text-white/25 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#e05c72]" />
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </Section>
  );
}
