"use client";

import { motion } from "framer-motion";
import { PackageCheck, UserCheck, Infinity as InfinityIcon, Wallet, type LucideIcon } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

type Item = { title: string; description: string };
type Data = { title: string; items: Item[] };

const ICONS: LucideIcon[] = [PackageCheck, UserCheck, InfinityIcon, Wallet];

const ease = [0.16, 1, 0.3, 1] as const;

/** Flat rule grid — four independent conditions, not a sequence, so no numbering. */
export function ReferralRules({ data }: { data: Data }) {
  return (
    <Section spacing="lg">
      <SectionHeading eyebrow="The Fine Print" title={data.title} />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {data.items.map((item, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <motion.div
              key={item.title}
              className="group rounded-2xl border border-[#e4e9f2] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#0fade8]/30 hover:shadow-[0_18px_40px_-20px_rgba(3,62,141,0.25)]"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08, ease }}
            >
              <span className="grid size-12 place-items-center rounded-xl bg-[#eef3fb] text-[#033e8d] transition-colors duration-300 group-hover:bg-[#033e8d] group-hover:text-white">
                <Icon className="size-5.5" />
              </span>
              <h3 className="mt-5 text-base font-bold text-[#06234d]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5b6b82]">{item.description}</p>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
