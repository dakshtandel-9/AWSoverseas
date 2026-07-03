"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

type Data = { title: string; items: string[] };

/**
 * whyAWS.items is a flat array of credential phrases, not paired titles —
 * rendered as stamped credential tags (echoes About's stamped certifications
 * register) rather than a card grid, since there's no description per item
 * to fill a card body with.
 */
export function ServiceWhy({ data }: { data: Data }) {
  return (
    <Section spacing="md" tone="soft">
      <Reveal direction="up">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">
            Credentials
          </p>
          <h2 className="mt-3 text-3xl font-bold text-[#06234d] sm:text-4xl lg:text-[2.5rem]">
            {data.title}
          </h2>
        </div>
      </Reveal>

      <motion.div
        className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-3"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {data.items.map((item) => (
          <motion.span
            key={item}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[#06234d] shadow-[0_1px_2px_rgba(4,22,47,0.04)] ring-1 ring-[#e4e9f2]"
            variants={{
              hidden: { opacity: 0, scale: 0.92 },
              show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
            }}
          >
            <ShieldCheck className="size-4 text-[#0fade8]" />
            {item}
          </motion.span>
        ))}
      </motion.div>
    </Section>
  );
}
