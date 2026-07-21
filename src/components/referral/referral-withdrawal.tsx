"use client";

import { motion } from "framer-motion";
import { Landmark, ArrowDownToLine, ShieldCheck, Wallet2, type LucideIcon } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

type Step = { step: string; title: string; description: string };
type Data = { title: string; description: string; steps: Step[]; note: string };

const ICONS: LucideIcon[] = [Landmark, ArrowDownToLine, ShieldCheck, Wallet2];

const ease = [0.16, 1, 0.3, 1] as const;

/** Wallet-to-bank is a real ordered process, so it reuses numbered steps — but as a
 *  connected vertical path in a tinted card, distinct from the hero-adjacent flow above. */
export function ReferralWithdrawal({ data }: { data: Data }) {
  return (
    <Section spacing="lg" tone="soft">
      <SectionHeading eyebrow="Getting Paid Out" title={data.title} subtitle={data.description} />

      <div className="mx-auto mt-14 max-w-3xl">
        <div className="relative rounded-[1.75rem] border border-[#e4e9f2] bg-white p-8 sm:p-10">
          <ol className="relative flex flex-col gap-9">
            <div
              className="pointer-events-none absolute left-6 top-6 bottom-6 w-px bg-[#dfe6f1]"
              aria-hidden
            />
            {data.steps.map((s, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <motion.li
                  key={s.step}
                  className="relative flex gap-5"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease }}
                >
                  <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full bg-[#eef3fb] text-[#002144] ring-4 ring-white">
                    <Icon className="size-5" strokeWidth={1.8} />
                  </span>
                  <div className="pt-1.5">
                    <span className="font-mono text-xs font-semibold tracking-wide text-[#94a3b8]">
                      {s.step}
                    </span>
                    <h3 className="mt-1 text-base font-bold text-[#002144]">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#5b6b82]">{s.description}</p>
                  </div>
                </motion.li>
              );
            })}
          </ol>

          <div className="mt-9 border-t border-[#eef1f6] pt-6">
            <p className="text-sm leading-relaxed text-[#5b6b82]">
              <span className="font-semibold text-[#002144]">Good to know: </span>
              {data.note}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
