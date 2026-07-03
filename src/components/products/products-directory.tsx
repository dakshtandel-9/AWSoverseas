"use client";

import { motion } from "framer-motion";
import { Boxes } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { PRODUCT_ICONS } from "@/lib/icons";

type Item = { title: string; icon: string };
type Data = { title: string; description: string; items: Item[] };

/**
 * All 11 commodity classes rendered as a numbered export schedule — the same
 * table register as Industries' classification directory, but without the
 * "profile below / custom quote" split badge since every row here does have
 * a full profile section beneath (unlike Industries' 5-of-8 split).
 */
export function ProductsDirectory({ data }: { data: Data }) {
  return (
    <Section spacing="lg" tone="soft">
      <SectionHeading eyebrow="Directory" title={data.title} subtitle={data.description} />

      <div className="mt-12 overflow-hidden rounded-2xl border border-[#e4e9f2] bg-white">
        {data.items.map((item, i) => {
          const Icon = PRODUCT_ICONS[item.icon] ?? Boxes;
          const code = String(i + 1).padStart(2, "0");

          return (
            <motion.div
              key={item.title}
              className="group flex items-center gap-5 border-b border-[#e4e9f2] px-5 py-5 transition-colors duration-200 last:border-b-0 hover:bg-[#f6f8fc] sm:gap-6 sm:px-8"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: (i % 11) * 0.035, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="hidden font-mono text-xs font-semibold text-[#94a3b8] sm:block">
                {code}
              </span>
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#eef3fb] text-[#033e8d] transition-colors duration-300 group-hover:bg-[#033e8d] group-hover:text-white">
                <Icon className="size-5" />
              </span>
              <span className="min-w-0 flex-1 truncate text-base font-bold text-[#06234d]">
                {item.title}
              </span>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
