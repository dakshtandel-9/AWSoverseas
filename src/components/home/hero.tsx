"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Smartphone, Plane, Ship, CheckCircle2, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { TrackingInput } from "@/components/forms/tracking-input";
import DotField from "@/components/ui/dot-field";

type HeroData = {
  badge: string;
  title: string;
  subtitle: string;
  primaryButton: string;
  secondaryButton: string;
  trackingPlaceholder: string;
  trackingButton: string;
  stats: { number: string; label: string }[];
};

const ease = [0.16, 1, 0.3, 1] as const;

const SHIPMENT_STEPS = [
  { id: 0, label: "Collected", location: "Shanghai, CN", done: true },
  { id: 1, label: "Customs cleared", location: "Port of Shanghai", done: true },
  { id: 2, label: "In transit", location: "Pacific Route · ETA 3 days", done: false, active: true },
  { id: 3, label: "Destination", location: "Los Angeles, US", done: false },
];

const MODES = [
  { Icon: Plane, label: "Air Freight" },
  { Icon: Ship, label: "Sea Freight" },
];

// Animated count-up hook
function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      // ease-out-expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return { count, ref };
}

function AnimatedStat({ number, label }: { number: string; label: string }) {
  // Parse numeric prefix and suffix (e.g. "100+" → 100, "+")
  const match = number.match(/^(\d+)(.*)$/);
  const numericPart = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : number;
  const { count, ref } = useCountUp(numericPart, 1600);

  return (
    <div className="flex flex-col">
      <dt className="sr-only">{label}</dt>
      <dd
        ref={ref as React.RefObject<HTMLElement>}
        className="font-heading text-3xl font-extrabold text-white"
      >
        {count}
        {suffix}
      </dd>
      <p className="mt-1 text-xs font-medium text-white/50">{label}</p>
    </div>
  );
}


function ShipmentCard() {
  const [modeIdx, setModeIdx] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setModeIdx((i) => (i + 1) % MODES.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 1800);
    return () => clearInterval(t);
  }, []);

  const Mode = MODES[modeIdx];

  return (
    <div className="flex flex-col items-center gap-0">
      {/* Stacked card stack wrapper */}
      <div className="relative w-full max-w-md mr-8 sm:mr-10 lg:mr-0">
        {/* Card back 4 — furthest */}
        <div
          className="absolute inset-0 rounded-3xl bg-white ring-1 ring-[#e4e9f2]"
          style={{
            transform: "rotate(12deg) translateX(32px) translateY(14px)",
            transformOrigin: "bottom center",
            boxShadow: "0 4px 12px -4px rgba(4,22,47,0.10)",
          }}
        />
        {/* Card back 3 */}
        <div
          className="absolute inset-0 rounded-3xl bg-white ring-1 ring-[#e4e9f2]"
          style={{
            transform: "rotate(8deg) translateX(22px) translateY(10px)",
            transformOrigin: "bottom center",
            boxShadow: "0 4px 14px -4px rgba(4,22,47,0.12)",
          }}
        />
        {/* Card back 2 */}
        <div
          className="absolute inset-0 rounded-3xl bg-white ring-1 ring-[#e4e9f2]"
          style={{
            transform: "rotate(5deg) translateX(13px) translateY(6px)",
            transformOrigin: "bottom center",
            boxShadow: "0 4px 16px -4px rgba(4,22,47,0.14)",
          }}
        />
        {/* Card back 1 — closest */}
        <div
          className="absolute inset-0 rounded-3xl bg-white ring-1 ring-[#e4e9f2]"
          style={{
            transform: "rotate(2.5deg) translateX(6px) translateY(3px)",
            transformOrigin: "bottom center",
            boxShadow: "0 4px 20px -6px rgba(4,22,47,0.16)",
          }}
        />
        {/* Glow halo + main card */}
        <div
          className="relative"
          style={{
            filter: "drop-shadow(0 0 28px rgba(172,32,56,0.22)) drop-shadow(0 0 60px rgba(3,62,141,0.18))",
          }}
        >
        <motion.div
          className="relative w-full rounded-3xl bg-white p-8 ring-1 ring-[#e4e9f2]"
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
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#5b6b82]">Shipment</p>
              <p className="mt-0.5 font-mono text-sm font-bold tracking-wider text-[#01214a]">AWO-2847-SH</p>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={modeIdx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-1.5 rounded-full bg-[#eef3fb] px-3 py-1.5 text-xs font-semibold text-[#01214a]"
              >
                <Mode.Icon className="size-3.5" />
                {Mode.label}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Route bar */}
          <div className="mt-5 flex items-center gap-2.5 rounded-2xl bg-[#f6f8fc] px-4 py-3">
            <MapPin className="size-4 shrink-0 text-[#d72846]" />
            <span className="text-sm font-semibold text-[#01214a]">Shanghai</span>
            <div className="flex flex-1 items-center gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="h-px flex-1 rounded-full"
                  style={{ background: i < 3 ? "#d72846" : "#e4e9f2" }}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-[#01214a]">Los Angeles</span>
            <MapPin className="size-4 shrink-0 text-[#5b6b82]" />
          </div>

          {/* Steps */}
          <ol className="mt-5 space-y-3.5">
            {SHIPMENT_STEPS.map((step) => (
              <li key={step.id} className="flex items-start gap-3">
                {step.done ? (
                  <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-[#d72846]" />
                ) : step.active ? (
                  <motion.span
                    className="mt-1 size-3.5 shrink-0 rounded-full bg-[#f59e0b]"
                    animate={{ scale: tick % 2 === 0 ? 1 : 1.3, opacity: tick % 2 === 0 ? 1 : 0.65 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                ) : (
                  <span className="mt-1 size-3.5 shrink-0 rounded-full border-2 border-[#e4e9f2]" />
                )}
                <div className="min-w-0">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: step.active ? "#f59e0b" : step.done ? "#01214a" : "#5b6b82" }}
                  >
                    {step.label}
                  </p>
                  <p className="mt-0.5 text-xs text-[#5b6b82]">{step.location}</p>
                </div>
                {step.active && (
                  <span className="ml-auto shrink-0 rounded-full bg-[#fffbeb] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#d97706]">
                    Live
                  </span>
                )}
              </li>
            ))}
          </ol>

          {/* ETA footer */}
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#01214a] px-4 py-3">
            <Clock className="size-4 shrink-0 text-[#d72846]" />
            <p className="text-xs font-medium text-white/80">
              Estimated delivery: <span className="font-bold text-white">Jul 3, 2026</span>
            </p>
          </div>
        </motion.div>
        </div>{/* /glow wrapper */}
      </div>{/* /stack wrapper */}
    </div>
  );
}

// Subtle world-map SVG pattern (landmark dots at major ports/cities)

export function Hero({ data, active = true }: { data: HeroData; active?: boolean }) {
  // Split title into two lines at first space after halfway point
  const words = data.title.split(" ");
  const mid = Math.ceil(words.length / 2);
  const line1 = words.slice(0, mid).join(" ");
  const line2 = words.slice(mid).join(" ");

  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-[#000c1a]">
      {/* Interactive dot field */}
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
          gradientFrom="#ac2038"
          gradientTo="#023f8d"
          glowColor="transparent"
          baseDotColor="#012d65"
          accentDotColor="#d72846"
          accentRatio={0.1}
          dotOpacity={0.25}
        />
      </div>

      <Container className="relative flex min-h-[100svh] flex-col justify-center pb-16 pt-28 lg:grid lg:grid-cols-[1fr_440px] lg:items-center lg:gap-16 xl:gap-20">
        {/* Left — headline + actions */}
        <div className="max-w-[600px]">
          {/* Eyebrow */}
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-[#d72846]/30 bg-[#d72846]/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#e05c72]"
            initial={{ opacity: 0, y: 12 }}
            animate={active ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
          >
            <span className="size-1.5 animate-pulse rounded-full bg-[#d72846]" />
            {data.badge}
          </motion.div>

          {/* Display headline — two-line with accent second line */}
          <motion.h1
            className="mt-7 font-heading font-extrabold leading-[1.0] tracking-[-0.03em]"
            initial={{ opacity: 0, y: 28 }}
            animate={active ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.08, ease }}
          >
            <span className="block text-5xl text-white sm:text-6xl lg:text-[4rem] xl:text-[4.5rem]">
              {line1}
            </span>
            <span
              className="block text-5xl sm:text-6xl lg:text-[4rem] xl:text-[4.5rem]"
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
            className="mt-6 max-w-[480px] text-base leading-relaxed text-white/60 sm:text-lg"
            initial={{ opacity: 0, y: 24 }}
            animate={active ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.18, ease }}
          >
            {data.subtitle}
          </motion.p>

          {/* CTA row */}
          <motion.div
            className="mt-9 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 24 }}
            animate={active ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.26, ease }}
          >
            <Button href="/quote" size="lg" variant="secondary">
              {data.primaryButton} <ArrowRight className="size-4" />
            </Button>
            {/* Glass-effect white button */}
            <a
              href="/mobile-app"
              className="group inline-flex h-14 items-center gap-2 rounded-full px-8 text-base font-medium transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 0 0 0 rgba(172,32,56,0)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.14)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 1px rgba(172,32,56,0.4), 0 4px 20px rgba(172,32,56,0.15)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 0 rgba(172,32,56,0)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <Smartphone className="size-4" />
              {data.secondaryButton}
            </a>
          </motion.div>

          {/* Tracking input */}
          <motion.div
            className="mt-8 max-w-[480px]"
            initial={{ opacity: 0, y: 24 }}
            animate={active ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.34, ease }}
          >
            <TrackingInput
              placeholder={data.trackingPlaceholder}
              buttonText={data.trackingButton}
              tone="dark"
            />
          </motion.div>

          {/* Stats row — animated count-up */}
          <motion.dl
            className="mt-12 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4 sm:gap-x-0 sm:divide-x sm:divide-white/10"
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

        {/* Right — Shipment Status card with route viz */}
        <motion.div
          className="mt-16 flex justify-center lg:mt-0 lg:justify-start lg:-ml-8"
          initial={{ opacity: 0, x: 24 }}
          animate={active ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.2, ease }}
        >
          <ShipmentCard />
        </motion.div>
      </Container>
    </div>
  );
}
