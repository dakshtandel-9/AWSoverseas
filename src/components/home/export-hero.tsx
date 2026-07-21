"use client";

import { motion, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  PackageSearch,
  Wheat,
  Shirt,
  Footprints,
  UtensilsCrossed,
  Tractor,
  Beaker,
  FlaskConical,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import DotField from "@/components/ui/dot-field";

type Commodity = { name: string; hsGroup: string; unit: string };

type ExportHeroData = {
  badge: string;
  title: string;
  subtitle: string;
  primaryButton: string;
  secondaryButton: string;
  manifestLabel: string;
  manifestOrigin: string;
  manifestFooterLabel: string;
  manifestFooterValue: string;
  commodities: Commodity[];
  stats: { number: string; label: string }[];
};

const ease = [0.16, 1, 0.3, 1] as const;

const ICONS = [Wheat, Shirt, Footprints, UtensilsCrossed, Tractor, Beaker, FlaskConical];

function useCountUp(target: number, duration = 1600) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return { count, ref };
}

function AnimatedStat({ number, label }: { number: string; label: string }) {
  const match = number.match(/^(\d+)(.*)$/);
  const numericPart = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : number;
  const { count, ref } = useCountUp(numericPart, 1400);

  return (
    <div className="flex flex-col">
      <dt className="sr-only">{label}</dt>
      <dd ref={ref as React.RefObject<HTMLElement>} className="font-heading text-3xl font-extrabold text-ink">
        {count}
        {suffix}
      </dd>
      <p className="mt-1 text-xs font-medium text-ink/50">{label}</p>
    </div>
  );
}

function ManifestCard({ data }: { data: ExportHeroData }) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((i) => (i + 1) % data.commodities.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [data.commodities.length]);

  return (
    <div className="flex flex-col items-center gap-0">
      <div className="relative w-full max-w-[360px] scale-[0.82] sm:scale-90 sm:mr-10 lg:mr-0 lg:scale-100">
        {/* Stacked back cards — mirrors the tracker card's stack language */}
        <div
          className="absolute inset-0 rounded-3xl bg-white ring-1 ring-[#e4e9f2]"
          style={{
            transform: "rotate(12deg) translateX(32px) translateY(14px)",
            transformOrigin: "bottom center",
            boxShadow: "0 4px 12px -4px rgba(4,22,47,0.10)",
          }}
        />
        <div
          className="absolute inset-0 rounded-3xl bg-white ring-1 ring-[#e4e9f2]"
          style={{
            transform: "rotate(8deg) translateX(22px) translateY(10px)",
            transformOrigin: "bottom center",
            boxShadow: "0 4px 14px -4px rgba(4,22,47,0.12)",
          }}
        />
        <div
          className="absolute inset-0 rounded-3xl bg-white ring-1 ring-[#e4e9f2]"
          style={{
            transform: "rotate(5deg) translateX(13px) translateY(6px)",
            transformOrigin: "bottom center",
            boxShadow: "0 4px 16px -4px rgba(4,22,47,0.14)",
          }}
        />
        <div
          className="absolute inset-0 rounded-3xl bg-white ring-1 ring-[#e4e9f2]"
          style={{
            transform: "rotate(2.5deg) translateX(6px) translateY(3px)",
            transformOrigin: "bottom center",
            boxShadow: "0 4px 20px -6px rgba(4,22,47,0.16)",
          }}
        />
        <div
          className="relative"
          style={{
            filter: "drop-shadow(0 0 28px rgba(171, 31, 61,0.22)) drop-shadow(0 0 60px rgba(3,62,141,0.18))",
          }}
        >
          <motion.div
            className="relative w-full rounded-3xl bg-white p-6 ring-1 ring-[#e4e9f2]"
            style={{
              boxShadow:
                "0 8px 32px -8px rgba(4,22,47,0.22), 0 2px 8px rgba(4,22,47,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.35, ease }}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5b6b82]">
                  {data.manifestLabel}
                </p>
                <p className="mt-0.5 font-mono text-[13px] font-bold tracking-wider text-[#002144]">
                  {data.manifestOrigin}
                </p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-[#eef3fb] px-2.5 py-1 text-[11px] font-semibold text-[#002144]">
                <BadgeCheck className="size-3" />
                Verified
              </div>
            </div>

            {/* Commodity rows */}
            <ol className="mt-4 space-y-1.5">
              {data.commodities.map((item, i) => {
                const Icon = ICONS[i % ICONS.length];
                const isActive = i === activeIdx;
                return (
                  <li key={item.name}>
                    <motion.div
                      className="flex items-center gap-2.5 rounded-xl px-2 py-1.5"
                      animate={{
                        backgroundColor: isActive ? "#f6f8fc" : "rgba(246,248,252,0)",
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      <span
                        className="grid size-7 shrink-0 place-items-center rounded-lg transition-colors duration-300"
                        style={{
                          background: isActive ? "#d6274c" : "#eef3fb",
                          color: isActive ? "#ffffff" : "#002144",
                        }}
                      >
                        <Icon className="size-3.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11.5px] font-semibold text-[#002144]">{item.name}</p>
                        <p className="text-[10px] text-[#5b6b82]">{item.unit}</p>
                      </div>
                      <span className="shrink-0 font-mono text-[9px] font-medium text-[#5b6b82]">
                        {item.hsGroup}
                      </span>
                    </motion.div>
                  </li>
                );
              })}
            </ol>

            {/* Footer */}
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#002144] px-3.5 py-2.5">
              <PackageSearch className="size-3.5 shrink-0 text-[#d6274c]" />
              <p className="text-[11px] font-medium text-white/80">
                {data.manifestFooterLabel}: <span className="font-bold text-white">{data.manifestFooterValue}</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function ExportHero({ data, active }: { data: ExportHeroData; active: boolean }) {
  const words = data.title.split(" ");
  const mid = Math.ceil(words.length / 2);
  const line1 = words.slice(0, mid).join(" ");
  const line2 = words.slice(mid).join(" ");

  return (
    <div className="relative min-h-[100svh] h-auto lg:h-[100svh] overflow-hidden bg-[#CFE8FF]">
      <div className="absolute inset-0" aria-hidden>
        <DotField
          dotRadius={4}
          dotSpacing={7}
          cursorRadius={420}
          cursorForce={0.15}
          bulgeOnly={false}
          bulgeStrength={22}
          glowRadius={0}
          sparkle={false}
          waveAmplitude={3}
          gradientFrom="#ab1f3d"
          gradientTo="#023f8d"
          glowColor="transparent"
          baseDotColor="#7fb3e0"
          accentDotColor="#d6274c"
          accentRatio={0.1}
          dotOpacity={0.35}
        />
      </div>

      <Container className="relative flex min-h-[100svh] flex-col justify-center pb-10 pt-24 sm:pb-16 sm:pt-28 lg:h-[100svh] lg:grid lg:grid-cols-[1fr_440px] lg:items-center lg:gap-16 xl:gap-20">
        <div className="max-w-[600px]">
          <motion.div
            className="inline-flex max-w-full items-center gap-1.5 whitespace-nowrap rounded-full border border-[#d6274c]/30 bg-[#d6274c]/8 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#e05c72] sm:gap-2 sm:px-4 sm:text-xs sm:tracking-widest"
            initial={{ opacity: 0, y: 12 }}
            animate={active ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
          >
            <span className="size-1.5 animate-pulse rounded-full bg-[#d6274c]" />
            {data.badge}
          </motion.div>

          <motion.h1
            className="mt-7 font-heading font-extrabold leading-[1.0] tracking-[-0.03em]"
            initial={{ opacity: 0, y: 28 }}
            animate={active ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.08, ease }}
          >
            <span className="block text-5xl sm:text-6xl lg:text-[4rem] xl:text-[4.5rem]" style={{ color: "#002144" }}>{line1}</span>
            <span
              className="block text-5xl sm:text-6xl lg:text-[4rem] xl:text-[4.5rem]"
              style={{
                background: "linear-gradient(110deg, #e05c72 0%, #d6274c 55%, #e88797 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {line2}
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 max-w-[480px] text-base leading-relaxed text-ink/60 sm:text-lg"
            initial={{ opacity: 0, y: 24 }}
            animate={active ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.18, ease }}
          >
            {data.subtitle}
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 24 }}
            animate={active ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.26, ease }}
          >
            <Button href="/products" size="lg" variant="secondary">
              {data.primaryButton} <ArrowRight className="size-4" />
            </Button>
            <a
              href="/products"
              className="group inline-flex h-14 items-center gap-2 rounded-full px-8 text-base font-medium transition-all duration-300"
              style={{
                background: "rgba(1,33,74,0.06)",
                border: "1px solid rgba(1,33,74,0.16)",
                color: "rgba(1,33,74,0.92)",
                backdropFilter: "blur(12px)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(1,33,74,0.1)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 0 0 1px rgba(171, 31, 61,0.4), 0 4px 20px rgba(171, 31, 61,0.15)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(1,33,74,0.06)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 0 rgba(171, 31, 61,0)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <PackageSearch className="size-4" />
              {data.secondaryButton}
            </a>
          </motion.div>

          <motion.dl
            className="mt-12 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4 sm:gap-x-0 sm:divide-x sm:divide-ink/10"
            initial={{ opacity: 0 }}
            animate={active ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5, ease }}
          >
            {data.stats.map((s, i) => (
              <div key={s.label} className={i > 0 ? "sm:pl-8" : ""}>
                <AnimatedStat number={s.number} label={s.label} />
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          className="mt-10 flex justify-center sm:mt-16 lg:mt-0 lg:justify-start lg:-ml-8"
          initial={{ opacity: 0, x: 24 }}
          animate={active ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.2, ease }}
        >
          <ManifestCard data={data} />
        </motion.div>
      </Container>
    </div>
  );
}
