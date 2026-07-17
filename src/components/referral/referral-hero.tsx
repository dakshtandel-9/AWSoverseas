"use client";

import { motion } from "framer-motion";
import { ArrowRight, Gift } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

type Data = {
  badge: string;
  title: string;
  subtitle: string;
  primaryButton: string;
  secondaryButton: string;
  stat: { value: string; label: string };
};

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * A payout, not an invitation — the stat badge takes the Handshake slot
 * PartnerHero uses, but reads as a receipt (the number owed) rather than
 * an icon, since the whole page's job is to make one dollar figure stick.
 */
export function ReferralHero({ data }: { data: Data }) {
  return (
    <section className="relative overflow-hidden bg-[#000c1a] pb-16 pt-32 sm:pb-20 sm:pt-36">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(60% 55% at 85% 0%, rgba(172,32,56,0.16) 0%, transparent 60%), radial-gradient(45% 40% at 0% 100%, rgba(3,62,141,0.42) 0%, transparent 60%), linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
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
          <span className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e05c72]">
            <span className="size-1.5 animate-pulse rounded-full bg-[#d72846]" />
            {data.badge}
          </span>
          <span className="ml-auto hidden font-mono text-[11px] tracking-[0.18em] text-white/35 sm:block">
            $25&nbsp;PER&nbsp;REFERRAL&nbsp;/&nbsp;NO&nbsp;CAP
          </span>
        </motion.div>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <motion.h1
              className="font-heading text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-[3.1rem]"
              style={{ color: "#ffffff" }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1, ease }}
            >
              {data.title}
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
              <Button href="/login?next=/profile/referrals" size="lg" variant="secondary">
                {data.primaryButton} <ArrowRight className="size-4" />
              </Button>
              <Button href="#how-it-works" size="lg" variant="ghost" className="text-white hover:bg-white/10">
                {data.secondaryButton}
              </Button>
            </motion.div>
          </div>

          <motion.div
            className="hidden shrink-0 lg:block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.35, ease }}
          >
            <div
              className="flex w-56 flex-col items-center gap-2 rounded-[2rem] py-8"
              style={{
                background: "rgba(172,32,56,0.1)",
                border: "1px solid rgba(172,32,56,0.25)",
              }}
            >
              <Gift className="size-7 text-[#e05c72]" strokeWidth={1.6} />
              <span
                className="font-heading text-5xl font-extrabold tracking-tight"
                style={{
                  background: "linear-gradient(110deg, #e05c72 0%, #d72846 55%, #e88797 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {data.stat.value}
              </span>
              <span className="text-center text-xs font-medium uppercase tracking-wide text-white/50">
                {data.stat.label}
              </span>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
