"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

type Category = { number: string; title: string; description: string };
type Data = { eyebrow: string; title: string; description: string; categories: Category[] };

const ease = [0.16, 1, 0.3, 1] as const;

/** Three distinct partner categories, each labeled 1/2/3 in the source copy — numbering kept as given. */
export function ReferralPartnerCategories({ data }: { data: Data }) {
  return (
    <Section spacing="lg">
      <SectionHeading eyebrow={data.eyebrow} title={data.title} subtitle={data.description} />

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {data.categories.map((category, i) => (
          <motion.div
            key={category.title}
            className="flex flex-col rounded-2xl border border-[#e4e9f2] bg-white p-8"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1, ease }}
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#002144] font-mono text-sm font-bold text-white">
              {category.number}
            </span>
            <h3 className="mt-5 text-lg font-bold text-[#1A0A53]">{category.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#5b6b82]">{category.description}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
