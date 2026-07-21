"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { ArrowRight, Globe2, Clock, PackageCheck, Zap } from "lucide-react";

type Data = { title: string; description: string; button: string };
type Stat = { number: string; label: string };

const STAT_ICONS = [Globe2, Clock, PackageCheck, Zap];

// Parse "100+" → { value: 100, suffix: "+" }
function parseStat(raw: string) {
  const match = raw.match(/^([\d.]+)(.*)$/);
  if (!match) return { value: 0, suffix: raw };
  return { value: parseFloat(match[1]), suffix: match[2] };
}

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(ease * target));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

const copyVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};
const copyItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export function AboutPreview({
  data,
  stats,
}: {
  data: Data;
  stats?: Stat[];
  eyebrow?: string;
}) {
  const pullStats = stats ?? [];

  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-32">
      {/* Background: radial glow + grid */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 60% at 50% 110%, rgba(158, 73, 83,0.07) 0%, transparent 70%), linear-gradient(to right, rgba(4,22,47,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(4,22,47,0.035) 1px, transparent 1px)",
          backgroundSize: "auto, 48px 48px, 48px 48px",
        }}
      />

      {/* Eyebrow */}
      <div className="relative mx-auto mb-16 flex max-w-[1280px] items-center gap-6 px-4 sm:px-6 lg:px-8">
        <div className="h-px flex-1 bg-[#e4e9f2]" />
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#5b6b82]">About aws overseas</span>
        <div className="h-px flex-1 bg-[#e4e9f2]" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto_1.1fr] lg:gap-0">

          {/* ── Left: stat cards ── */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            {pullStats.map((s, i) => {
              const Icon = STAT_ICONS[i % STAT_ICONS.length];
              const { value, suffix } = parseStat(s.number);
              return (
                <motion.div
                  key={s.label}
                  custom={i}
                  variants={cardVariants}
                  className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-[#e4e9f2] bg-white p-5 shadow-[0_1px_2px_rgba(4,22,47,0.04),0_8px_24px_-8px_rgba(4,22,47,0.10)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#9e4953]/40 hover:shadow-[0_8px_16px_rgba(4,22,47,0.06),0_30px_60px_-20px_rgba(4,22,47,0.22)]"
                >
                  {/* Left accent stripe */}
                  <span className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 bg-gradient-to-b from-[#002144] to-[#9e4953] transition-transform duration-300 group-hover:scale-y-100" />
                  {/* Icon */}
                  <span className="grid size-10 place-items-center rounded-xl bg-[#edf5ff] text-[#002144] transition-colors duration-200 group-hover:bg-[#002144] group-hover:text-white">
                    <Icon className="size-5" />
                  </span>
                  {/* Count */}
                  <span className="font-heading text-3xl font-extrabold leading-none tracking-[-0.04em] text-[#002144] sm:text-4xl">
                    <CountUp target={value} suffix={suffix} />
                  </span>
                  {/* Label */}
                  <span className="text-[13px] font-medium leading-snug text-[#5b6b82]">{s.label}</span>
                </motion.div>
              );
            })}
          </motion.div>

          {/* ── Centre: vertical logistics route ── */}
          <div className="hidden lg:flex lg:flex-col lg:items-center lg:px-10">
            <svg
              width="2"
              height="320"
              viewBox="0 0 2 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="overflow-visible"
            >
              {/* Static track */}
              <line x1="1" y1="0" x2="1" y2="320" stroke="#e4e9f2" strokeWidth="2" />
              {/* Animated travelling dashes */}
              <motion.line
                x1="1" y1="0" x2="1" y2="320"
                stroke="url(#routeGrad)"
                strokeWidth="2"
                strokeDasharray="8 10"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: "easeInOut", delay: 0.2 }}
              />
              {/* Stop dots */}
              {[0, 106, 213, 320].map((y, i) => (
                <motion.circle
                  key={y}
                  cx="1" cy={y} r="5"
                  fill="white"
                  stroke={i === 1 || i === 2 ? "#9e4953" : "#002144"}
                  strokeWidth="2"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.25, duration: 0.35, ease: "backOut" }}
                />
              ))}
              <defs>
                <linearGradient id="routeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#002144" />
                  <stop offset="100%" stopColor="#9e4953" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* ── Right: copy ── */}
          <motion.div
            className="flex flex-col justify-center"
            variants={copyVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
          >
            <motion.h2
              variants={copyItem}
              className="font-heading text-3xl font-bold leading-snug text-balance text-[#002144] sm:text-4xl lg:text-[2.5rem]"
            >
              {data.title}
            </motion.h2>
            <motion.p
              variants={copyItem}
              className="mt-6 text-base leading-[1.85] text-[#5b6b82] text-pretty sm:text-lg"
            >
              {data.description}
            </motion.p>
            <motion.div variants={copyItem} className="mt-10">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 rounded-full bg-[#02224C] px-8 py-4 text-base font-semibold text-white shadow-[0_2px_8px_rgba(3,62,141,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#011a38] hover:shadow-[0_0_0_4px_rgba(144, 45, 57,0.18),0_8px_24px_rgba(3,62,141,0.35)]"
              >
                {data.button}
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
