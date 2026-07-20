"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { PhoneMockup } from "@/components/ui/phone-mockup";

type Data = {
  badge: string;
  title: string;
  subtitle: string;
  primaryButton: string;
  secondaryButton: string;
};

const ease = [0.16, 1, 0.3, 1] as const;

const FLOATING_CARDS = [
  { label: "Shipment Cleared", sub: "AWO-2847-SH", dot: "#e57688", top: "10%", left: "-64px" },
  { label: "Payment Confirmed", sub: "₹48,200 received", dot: "#34d399", top: "48%", left: "-84px" },
  { label: "Out for Delivery", sub: "ETA today, 4 PM", dot: "#f59e0b", top: "80%", left: "-56px" },
];

/**
 * Hero uses a real phone mockup rather than a fabricated screenshot image —
 * screenshots.items[].image paths in mobileApp.json point at files that don't
 * exist in public/, so a code-drawn phone (matching PhoneMockup/ShipmentCard
 * elsewhere on the site) is the honest choice, not a broken <Image>.
 */
export function AppHero({ data }: { data: Data }) {
  const words = data.title.split(" ");
  const mid = Math.ceil(words.length * 0.55);
  const line1 = words.slice(0, mid).join(" ");
  const line2 = words.slice(mid).join(" ");

  return (
    <section className="relative overflow-hidden bg-[#CFE8FF] pb-20 pt-32 sm:pb-24 sm:pt-36">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(55% 50% at 85% 15%, rgba(172,32,56,0.12) 0%, transparent 60%), radial-gradient(45% 40% at 5% 100%, rgba(3,62,141,0.2) 0%, transparent 60%)",
        }}
      />

      <Container className="relative grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
        <div className="max-w-xl">
          <motion.span
            className="inline-flex items-center gap-2 rounded-full border border-[#d72846]/30 bg-[#d72846]/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#e05c72]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <span className="size-1.5 animate-pulse rounded-full bg-[#d72846]" />
            {data.badge}
          </motion.span>

          <motion.h1
            className="mt-6 font-heading text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-[3.25rem]"
            style={{ color: "#01214a" }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1, ease }}
          >
            {line1}{" "}
            <span
              style={{
                background: "linear-gradient(110deg, #e05c72 0%, #d72846 55%, #e88797 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {line2}
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 max-w-lg text-base leading-relaxed text-ink/60 sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
          >
            {data.subtitle}
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease }}
          >
            <a href="#" aria-label={data.primaryButton} className="transition-transform hover:-translate-y-0.5">
              <Image
                src="/brand/google-play-real.png"
                alt="Get it on Google Play"
                width={200}
                height={59}
                className="h-14 w-auto"
              />
            </a>
            <a href="#" aria-label={data.secondaryButton} className="transition-transform hover:-translate-y-0.5">
              <Image
                src="/brand/app-store-real.png"
                alt="Download on the App Store"
                width={200}
                height={59}
                className="h-14 w-auto"
              />
            </a>
          </motion.div>
        </div>

        <motion.div
          className="relative mx-auto flex justify-center"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.25, ease }}
        >
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]"
            aria-hidden
            style={{ background: "rgba(172,32,56,0.28)" }}
          />
          <div className="relative animate-float">
            <PhoneMockup />
          </div>
          {FLOATING_CARDS.map((c, i) => (
            <div
              key={c.label}
              className="absolute z-[1] hidden items-center gap-2.5 rounded-xl bg-white/70 px-3.5 py-2.5 text-ink backdrop-blur-md ring-1 ring-ink/10 shadow-lg sm:flex"
              style={{ top: c.top, left: c.left, animationDelay: `${i * 0.7}s` }}
            >
              <span className="size-2 shrink-0 rounded-full" style={{ background: c.dot }} />
              <div className="leading-tight">
                <p className="text-xs font-semibold">{c.label}</p>
                <p className="text-[10px] opacity-70">{c.sub}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
