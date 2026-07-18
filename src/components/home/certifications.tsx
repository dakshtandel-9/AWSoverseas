"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

type CertItem = { name: string; issuer: string; code: string; logo: string };
type Data = { badge: string; title: string; description: string; items: CertItem[] };

const ease = [0.16, 1, 0.3, 1] as const;

function CertPlaque({ item }: { item: CertItem }) {
  return (
    <div className="group relative flex h-40 w-64 shrink-0 items-center justify-center rounded-2xl border border-[#e4e9f2] bg-white px-8 shadow-[0_1px_2px_rgba(4,22,47,0.04),0_8px_24px_-10px_rgba(4,22,47,0.1)] transition-all duration-300 hover:border-[#d72846]/35 hover:shadow-[0_14px_36px_-14px_rgba(4,22,47,0.24)] sm:h-44 sm:w-72">
      <Image
        src={item.logo}
        alt={`${item.name} — ${item.issuer}`}
        width={180}
        height={135}
        className="h-full max-h-24 w-auto object-contain sm:max-h-28"
      />
    </div>
  );
}

export function Certifications({ data }: { data: Data }) {
  return (
    <Section spacing="lg" tone="soft" id="certifications" className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(4,22,47,0.028) 1px, transparent 1px), linear-gradient(to bottom, rgba(4,22,47,0.028) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <Reveal direction="up" className="relative mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700 ring-1 ring-emerald-100">
          <ShieldCheck className="size-3.5" aria-hidden />
          {data.badge}
        </span>
        <h2 className="mt-4 text-3xl font-bold leading-tight text-[#01214a] sm:text-4xl lg:text-[2.6rem]">
          {data.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-[#5b6b82]">{data.description}</p>
      </Reveal>

      <motion.div
        className="relative mt-14 overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease }}
      >
        <div className="flex w-max motion-safe:animate-[cert-marquee_36s_linear_infinite] gap-4">
          {[...data.items, ...data.items].map((item, i) => (
            <CertPlaque item={item} key={`${item.code}-${i}`} />
          ))}
        </div>
      </motion.div>

      <style>{`
        @keyframes cert-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </Section>
  );
}
