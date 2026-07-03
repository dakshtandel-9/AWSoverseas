"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { iconFor } from "@/lib/icons";

type Item = { title: string; description: string };
type Data = { title: string; items: Item[] };

/**
 * "Why businesses choose us" as a sticky-heading + capability rows layout —
 * intentionally different from the home page's 3-column metric cards so the two
 * pages don't read as duplicates. Rows, not a numbered sequence.
 */
export function WhyChoose({ data }: { data: Data }) {
  return (
    <Section spacing="lg" tone="soft">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal direction="up">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">
              The Case for AWSoversea
            </p>
            <h2 className="mt-3 text-3xl font-bold text-[#06234d] sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
              {data.title}
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[#5b6b82]">
              Six reasons enterprises and first-time shippers alike hand us their
              cargo — and keep coming back.
            </p>
          </div>
        </Reveal>

        <motion.div
          className="divide-y divide-[#dfe6f1] border-y border-[#dfe6f1]"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {data.items.map((item) => {
            const Icon = iconFor(item.title);
            return (
              <motion.div
                key={item.title}
                className="group flex items-center gap-5 py-6"
                variants={{
                  hidden: { opacity: 0, x: 16 },
                  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                }}
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white text-[#033e8d] shadow-[0_1px_2px_rgba(4,22,47,0.04),0_8px_20px_-10px_rgba(4,22,47,0.18)] ring-1 ring-[#e4e9f2] transition-all duration-300 group-hover:bg-[#033e8d] group-hover:text-white">
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-[#06234d]">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#5b6b82]">
                    {item.description}
                  </p>
                </div>
                <span
                  className="hidden h-8 w-px shrink-0 bg-[#dfe6f1] transition-colors duration-300 group-hover:bg-[#0fade8] sm:block"
                  aria-hidden
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </Section>
  );
}
