"use client";

import { motion } from "framer-motion";
import { BadgeDollarSign, BadgeCheck, Clock, ShieldCheck, Handshake, Users, Boxes, type LucideIcon } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";

type Item = { title: string; description: string };
type Data = { eyebrow: string; title: string; subtitle: string; items: Item[] };

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Dedicated map instead of the freight-vocabulary iconFor() — these benefit
 * titles ("Save Time", "Reliable Services"...) don't share keywords with
 * services/industries/products, so iconFor's matching would fall through to
 * the generic Boxes icon for most of them (same reasoning as Products'
 * PRODUCT_ICONS map in src/lib/icons.ts).
 */
const BENEFIT_ICONS: Record<string, LucideIcon> = {
  "Cost Savings": BadgeDollarSign,
  "Quality Products & Services": BadgeCheck,
  "Save Time": Clock,
  "Reduced Risks": ShieldCheck,
  "Reliable Services": Handshake,
  "Expert Guidance": Users,
};

/** Flat value-prop grid — not a sequence, so no numbering (same call as Partner's PartnerBenefits). */
export function SourcingBenefits({ data }: { data: Data }) {
  return (
    <Section spacing="lg" tone="ink" className="overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(55% 60% at 15% 10%, rgba(15,173,232,0.14) 0%, transparent 60%)",
        }}
      />

      <div className="relative">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <Reveal direction="up">
            <Badge tone="light">{data.eyebrow}</Badge>
          </Reveal>
          <Reveal direction="up" delay={0.05}>
            <h2
              className="text-balance text-3xl font-bold sm:text-4xl lg:text-[2.75rem]"
              style={{ color: "#002144" }}
            >
              {data.title}
            </h2>
          </Reveal>
          <Reveal direction="up" delay={0.1}>
            <p className="text-pretty text-base leading-relaxed text-ink/60 sm:text-lg">
              {data.subtitle}
            </p>
          </Reveal>
        </div>

        <div className="relative mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((item, i) => {
            const Icon = BENEFIT_ICONS[item.title] ?? Boxes;
            const isLast = i === data.items.length - 1;

            return (
              <motion.div
                key={item.title}
                className="rounded-2xl border p-7"
                style={{
                  background: isLast ? "rgba(15,173,232,0.12)" : "rgba(255,255,255,0.55)",
                  borderColor: isLast ? "rgba(15,173,232,0.35)" : "rgba(1,33,74,0.1)",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.06, ease }}
              >
                <span
                  className="grid size-12 place-items-center rounded-xl"
                  style={{
                    background: "rgba(15,173,232,0.14)",
                    border: "1px solid rgba(15,173,232,0.3)",
                  }}
                >
                  <Icon className="size-5 text-[#0891b2]" strokeWidth={1.6} />
                </span>
                <h3
                  className="mt-5 text-base font-bold"
                  style={{ color: isLast ? "#0891b2" : "#002144" }}
                >
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
