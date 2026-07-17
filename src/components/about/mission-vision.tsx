"use client";

import { motion } from "framer-motion";
import { Compass, Target } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

type Block = { title: string; description: string };
type Data = { title: string; mission: Block; vision: Block };

/**
 * Mission (what we do now) rendered on the ink surface as the near horizon;
 * Vision (where we're headed) on light as the far horizon. Two coordinates, not
 * a numbered list — the contrast in surface encodes near vs. far.
 */
export function MissionVision({ data }: { data: Data }) {
  const cards = [
    {
      Icon: Target,
      eyebrow: "Bearing",
      block: data.mission,
      dark: true,
    },
    {
      Icon: Compass,
      eyebrow: "Horizon",
      block: data.vision,
      dark: false,
    },
  ];

  return (
    <Section spacing="lg">
      <SectionHeading
        eyebrow="Mission & Vision"
        title={data.title}
        align="left"
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        {cards.map((c, i) => (
          <motion.div
            key={c.block.title}
            className={`group relative flex flex-col overflow-hidden rounded-[1.75rem] p-9 sm:p-11 ${
              c.dark
                ? "bg-[#05203a] text-white ring-1 ring-white/8"
                : "border border-[#e4e9f2] bg-white shadow-[0_2px_4px_rgba(4,22,47,0.04),0_18px_40px_-16px_rgba(4,22,47,0.14)]"
            }`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {c.dark && (
              <div
                className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full blur-[70px]"
                aria-hidden
                style={{ background: "rgba(172,32,56,0.28)" }}
              />
            )}

            <div className="relative flex items-center gap-4">
              <span
                className={`grid size-13 place-items-center rounded-2xl ${
                  c.dark
                    ? "bg-white/10 text-[#e05c72]"
                    : "bg-[#eef3fb] text-[#01214a]"
                }`}
              >
                <c.Icon className="size-6" />
              </span>
              <span
                className={`font-mono text-[11px] font-bold uppercase tracking-[0.2em] ${
                  c.dark ? "text-[#e05c72]/80" : "text-[#5b6b82]"
                }`}
              >
                {c.eyebrow}
              </span>
            </div>

            <h3
              className="relative mt-7 text-xl font-bold sm:text-2xl"
              style={{ color: c.dark ? "#ffffff" : "#01214a" }}
            >
              {c.block.title}
            </h3>
            <p
              className={`relative mt-4 text-[15px] leading-[1.8] sm:text-base ${
                c.dark ? "text-white/60" : "text-[#5b6b82]"
              }`}
            >
              {c.block.description}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
