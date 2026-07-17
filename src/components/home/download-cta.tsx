"use client";

import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { PhoneMockup } from "@/components/ui/phone-mockup";
import Image from "next/image";

type Data = {
  title: string;
  description: string;
  playStoreButton: string;
  appStoreButton: string;
};

const FLOATING_CARDS = [
  { label: "Shipment Cleared", sub: "AWS-9X42-118", dot: "#e57688" },
  { label: "ETA Updated", sub: "Rotterdam · 3 days", dot: "#f59e0b" },
  { label: "Payment Received", sub: "$4,280 confirmed", dot: "#34d399" },
];

export function DownloadCTA({ data }: { data: Data }) {
  const titleParts = data.title.split(/(AWSOverseas)/i);

  return (
    <Section spacing="lg">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-[#05203a] px-8 py-16 shadow-[0_32px_96px_-24px_rgba(5,32,58,0.6)] sm:px-14 sm:py-20">
          {/* Dot grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            aria-hidden
            style={{
              backgroundImage: "radial-gradient(circle, #e05c72 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Left ambient glow */}
          <div
            className="pointer-events-none absolute -left-32 top-1/2 size-[600px] -translate-y-1/2 rounded-full blur-[100px]"
            aria-hidden
            style={{ background: "rgba(215,40,70,0.22)" }}
          />

          {/* Right / phone glow */}
          <div
            className="pointer-events-none absolute -right-16 top-1/2 size-[520px] -translate-y-1/2 rounded-full blur-[90px]"
            aria-hidden
            style={{ background: "rgba(172,32,56,0.28)" }}
          />

          <div className="relative grid items-center gap-14 lg:grid-cols-[1fr_auto]">
            {/* ── Left column ─────────────────────────────── */}
            <div className="max-w-xl">
              {/* Eyebrow */}
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d72846]/30 bg-[#d72846]/8 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#e05c72]">
                <span className="size-1.5 animate-pulse rounded-full bg-[#d72846]" />
                Mobile App
              </span>

              {/* Heading */}
              <h2 className="mt-6 text-balance text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-[3.25rem]">
                {titleParts.map((part, i) =>
                  /AWSOverseas/i.test(part) ? (
                    <span
                      key={i}
                      style={{
                        background: "linear-gradient(120deg, #e05c72 0%, #d72846 50%, #023f8d 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {part}
                    </span>
                  ) : (
                    <span key={i} className="text-white">
                      {part}
                    </span>
                  )
                )}
              </h2>

              <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">
                {data.description}
              </p>

              {/* Store buttons */}
              <div className="mt-7 flex flex-wrap gap-4">
                <a
                  href="#"
                  aria-label={data.appStoreButton}
                  className="transition-all duration-200 hover:-translate-y-1 hover:scale-[1.03] hover:drop-shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
                >
                  <Image
                    src="/brand/app-store-badge.png"
                    alt="Download on the App Store"
                    width={160}
                    height={53}
                    className="h-[52px] w-auto rounded-xl"
                  />
                </a>
                <a
                  href="#"
                  aria-label={data.playStoreButton}
                  className="transition-all duration-200 hover:-translate-y-1 hover:scale-[1.03] hover:drop-shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
                >
                  <Image
                    src="/brand/google-play-badge.png"
                    alt="Get it on Google Play"
                    width={160}
                    height={53}
                    className="h-[52px] w-auto rounded-xl"
                  />
                </a>
              </div>

            </div>

            {/* ── Phone column ─────────────────────────────── */}
            <div className="relative hidden justify-center lg:flex">
              {/* Big radial glow behind phone */}
              <div
                className="pointer-events-none absolute top-1/2 left-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[72px]"
                aria-hidden
                style={{ background: "rgba(215,40,70,0.32)" }}
              />

              {/* Floating notification cards */}
              {FLOATING_CARDS.map((card, i) => (
                <div
                  key={card.label}
                  className="absolute z-10 flex items-center gap-2.5 rounded-xl bg-white/10 px-3.5 py-2.5 text-white backdrop-blur-md ring-1 ring-white/15 shadow-lg"
                  style={{
                    top: i === 0 ? "10%" : i === 1 ? "48%" : "78%",
                    left: i === 1 ? "-80px" : "-60px",
                    animation: `floatCard${i} ${3.5 + i * 0.6}s ease-in-out infinite`,
                    animationDelay: `${i * 0.8}s`,
                  }}
                >
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ background: card.dot }}
                  />
                  <div className="leading-tight">
                    <p className="text-xs font-semibold">{card.label}</p>
                    <p className="text-[10px] opacity-55">{card.sub}</p>
                  </div>
                </div>
              ))}

              {/* Phone with float animation */}
              <div
                className="relative z-[1] drop-shadow-2xl"
                style={{ animation: "phoneBob 5s ease-in-out infinite" }}
              >
                <PhoneMockup />
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Keyframes injected via a style tag — avoids Tailwind plugin dependency */}
      <style>{`
        @keyframes phoneBob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes floatCard0 {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-8px) rotate(0deg); }
        }
        @keyframes floatCard1 {
          0%, 100% { transform: translateY(0px) rotate(1deg); }
          50% { transform: translateY(-10px) rotate(0deg); }
        }
        @keyframes floatCard2 {
          0%, 100% { transform: translateY(0px) rotate(-0.5deg); }
          50% { transform: translateY(-6px) rotate(0.5deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes phoneBob { from, to { transform: none; } }
          @keyframes floatCard0, @keyframes floatCard1, @keyframes floatCard2 { from, to { transform: none; } }
        }
      `}</style>
    </Section>
  );
}
