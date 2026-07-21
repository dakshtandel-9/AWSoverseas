"use client";

import { motion } from "framer-motion";
import { ArrowRight, Boxes } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

type Data = {
  badge: string;
  title: string;
  subtitle: string;
  primaryButton: string;
  secondaryButton: string;
};

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Signature "verification dossier" hero — the company is introduced the way
 * its own sourcing desk introduces a partner: a document header, a headline,
 * and a strip of boxed credential fields. Encodes something true about the
 * subject (trust, verified on the ground, is the product) rather than
 * decorating with a generic centered headline or freight waybill framing.
 */
const FIELDS = [
  { k: "Focus", v: "India sourcing & export" },
  { k: "Manufacturing hubs", v: "Nationwide" },
  { k: "Registered", v: "GST · IEC" },
  { k: "Ref", v: "AWO / PARTNER" },
];

export function AboutHero({ data }: { data: Data }) {
  const words = data.title.split(" ");
  const mid = Math.ceil(words.length * 0.55);
  const line1 = words.slice(0, mid).join(" ");
  const line2 = words.slice(mid).join(" ");

  return (
    <section className="relative overflow-hidden bg-[#CFE8FF] pb-20 pt-32 sm:pb-24 sm:pt-36">
      {/* Blueprint grid + ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(60% 55% at 82% 8%, rgba(144, 45, 57,0.12) 0%, transparent 60%), radial-gradient(45% 40% at 6% 100%, rgba(3,62,141,0.2) 0%, transparent 60%), linear-gradient(to right, rgba(1,33,74,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(1,33,74,0.05) 1px, transparent 1px)",
          backgroundSize: "auto, auto, 44px 44px, 44px 44px",
        }}
      />

      <Container className="relative">
        {/* Document header rule */}
        <motion.div
          className="flex items-center gap-4 border-b border-ink/12 pb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <span className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-maroon-admin">
            <span className="size-1.5 animate-pulse rounded-full bg-[#9e4953]" />
            {data.badge}
          </span>
          <span className="ml-auto hidden font-mono text-[11px] tracking-[0.18em] text-ink/35 sm:block">
            VERIFICATION&nbsp;DOSSIER&nbsp;/&nbsp;INDIA
          </span>
        </motion.div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-16">
          {/* Partner line = headline */}
          <div>
            <motion.p
              className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
            >
              Your sourcing partner
            </motion.p>
            <motion.h1
              className="mt-3 font-heading text-4xl font-extrabold leading-[1.03] tracking-[-0.03em] sm:text-5xl lg:text-[3.4rem]"
              style={{ color: "#002144" }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.14, ease }}
            >
              {line1}{" "}
              <span
                style={{
                  background:
                    "linear-gradient(110deg, #e05c72 0%, #9e4953 55%, #e88797 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {line2}
              </span>
            </motion.h1>

            <motion.p
              className="mt-6 max-w-xl text-base leading-relaxed text-ink/60 sm:text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22, ease }}
            >
              {data.subtitle}
            </motion.p>

            <motion.div
              className="mt-9 flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease }}
            >
              <Button href="/quote" size="lg" variant="secondary">
                {data.primaryButton} <ArrowRight className="size-4" />
              </Button>
              <a
                href="/services"
                className="group inline-flex h-14 items-center gap-2 rounded-full px-8 text-base font-medium text-ink/90 transition-all duration-300"
                style={{
                  background: "rgba(1,33,74,0.06)",
                  border: "1px solid rgba(1,33,74,0.16)",
                  backdropFilter: "blur(12px)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "rgba(1,33,74,0.1)";
                  el.style.boxShadow =
                    "0 0 0 1px rgba(144, 45, 57,0.4), 0 4px 20px rgba(144, 45, 57,0.15)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "rgba(1,33,74,0.06)";
                  el.style.boxShadow = "none";
                }}
              >
                <Boxes className="size-4" />
                {data.secondaryButton}
              </a>
            </motion.div>
          </div>

          {/* Boxed reference fields — the waybill metadata block */}
          <motion.dl
            className="grid grid-cols-2 overflow-hidden rounded-2xl border border-ink/12 bg-white/50 backdrop-blur-sm"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.34, ease }}
          >
            {FIELDS.map((f, i) => (
              <div
                key={f.k}
                className={`px-5 py-5 ${i % 2 === 0 ? "border-r border-ink/10" : ""} ${
                  i < 2 ? "border-b border-ink/10" : ""
                }`}
              >
                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40">
                  {f.k}
                </dt>
                <dd className="mt-2 font-mono text-sm font-semibold text-ink">
                  {f.v}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </Container>
    </section>
  );
}
