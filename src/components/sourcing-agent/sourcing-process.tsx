"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

type Step = { step: string; title: string; description: string };
type Data = { eyebrow: string; title: string; subtitle: string; steps: Step[] };

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Genuine ordered sequence (requirements -> source -> inspect -> logistics ->
 * support), so numbered markers are earned here, same reasoning as
 * ServiceProcess on the service-detail pages.
 */
export function SourcingProcess({ data }: { data: Data }) {
  return (
    <Section spacing="lg">
      <SectionHeading eyebrow={data.eyebrow} title={data.title} subtitle={data.subtitle} />

      <div className="mt-16 grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-12">
        <ol className="relative flex flex-col gap-9">
          <div
            className="pointer-events-none absolute left-[23px] top-3 bottom-3 hidden w-px bg-[#dfe6f1] sm:block"
            aria-hidden
          />
          {data.steps.map((s, i) => (
            <motion.li
              key={s.step}
              className="relative flex items-start gap-5"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease }}
            >
              <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full bg-[#01214a] font-mono text-sm font-bold text-white ring-4 ring-[#f6f8fc]">
                {s.step}
              </span>
              <div className="pt-1.5">
                <h3 className="text-lg font-bold text-[#01214a]">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#5b6b82]">{s.description}</p>
              </div>
            </motion.li>
          ))}
        </ol>

        <motion.div
          className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_1px_2px_rgba(4,22,47,0.04),0_24px_48px_-16px_rgba(4,22,47,0.2)] lg:aspect-square"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
        >
          <Image
            src="https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=1200&q=80"
            alt="Container port operations"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 480px, 100vw"
          />
        </motion.div>
      </div>
    </Section>
  );
}
