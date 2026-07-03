"use client";

import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
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
 * Lighter cut of the manifest register used on About/Industries — this page's
 * job is to get a visitor to the form fast, so the hero is shorter and skips
 * the boxed reference-field block those pages use.
 */
export function ContactHero({ data, phone }: { data: Data; phone?: string }) {
  const words = data.title.split(" ");
  const mid = Math.ceil(words.length * 0.55);
  const line1 = words.slice(0, mid).join(" ");
  const line2 = words.slice(mid).join(" ");

  return (
    <section className="relative overflow-hidden bg-[#04162f] pb-16 pt-32 sm:pb-20 sm:pt-36">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(60% 55% at 82% 8%, rgba(15,173,232,0.16) 0%, transparent 60%), radial-gradient(45% 40% at 6% 100%, rgba(3,62,141,0.42) 0%, transparent 60%), linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "auto, auto, 44px 44px, 44px 44px",
        }}
      />

      <Container className="relative">
        <motion.div
          className="flex items-center gap-4 border-b border-white/12 pb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <span className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#48b8f8]">
            <span className="size-1.5 animate-pulse rounded-full bg-[#0fade8]" />
            {data.badge}
          </span>
          <span className="ml-auto hidden font-mono text-[11px] tracking-[0.18em] text-white/35 sm:block">
            DISPATCH&nbsp;REQUEST&nbsp;/&nbsp;OPEN&nbsp;CHANNEL
          </span>
        </motion.div>

        <div className="mt-10 max-w-2xl">
          <motion.h1
            className="font-heading text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-[3.1rem]"
            style={{ color: "#ffffff" }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1, ease }}
          >
            {line1}{" "}
            <span
              style={{
                background: "linear-gradient(110deg, #48b8f8 0%, #0fade8 55%, #7dd8ff 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {line2}
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
          >
            {data.subtitle}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease }}
          >
            <Button href="/quote" size="lg" variant="secondary">
              {data.primaryButton} <ArrowRight className="size-4" />
            </Button>
            {phone && (
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="group inline-flex h-14 items-center gap-2 rounded-full px-8 text-base font-medium text-white/90 transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  backdropFilter: "blur(12px)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "rgba(255,255,255,0.14)";
                  el.style.boxShadow = "0 0 0 1px rgba(15,173,232,0.4), 0 4px 20px rgba(15,173,232,0.15)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.background = "rgba(255,255,255,0.08)";
                  el.style.boxShadow = "none";
                }}
              >
                <Phone className="size-4" />
                {data.secondaryButton}
              </a>
            )}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
