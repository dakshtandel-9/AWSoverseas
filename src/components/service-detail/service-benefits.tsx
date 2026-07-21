"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { iconFor } from "@/lib/icons";

type Item = { title: string; description: string };
type Data = { title: string; items: Item[] };

const ease = [0.16, 1, 0.3, 1] as const;

export function ServiceBenefits({ data }: { data: Data }) {
  return (
    <Section spacing="lg" tone="soft">
      <SectionHeading eyebrow="Benefits" title={data.title} />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((item, i) => {
          const Icon = iconFor(item.title);
          return (
            <motion.div
              key={item.title}
              className="group rounded-2xl border border-[#e4e9f2] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#002144]/25 hover:shadow-[0_20px_44px_-24px_rgba(4,22,47,0.25)]"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease }}
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#eef3fb] text-[#002144] transition-colors duration-300 group-hover:bg-[#002144] group-hover:text-white">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-[#002144]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5b6b82]">{item.description}</p>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
