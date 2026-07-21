"use client";

import { motion } from "framer-motion";
import { Check, Apple, Play } from "lucide-react";
import { Section } from "@/components/ui/section";
import { PhoneMockup } from "@/components/ui/phone-mockup";

type StoreLink = { text: string; link: string };
type Data = {
  title: string;
  description: string;
  features: string[];
  playStoreButton: StoreLink;
  appStoreButton: StoreLink;
};

export function TrackingAppCta({ data }: { data: Data }) {
  return (
    <Section spacing="lg" tone="ink" className="overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-50" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.12]" aria-hidden />

      <div className="relative grid items-center gap-14 lg:grid-cols-2">
        <div>
          <motion.h2
            className="text-3xl font-bold sm:text-4xl"
            style={{ color: "#002144" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {data.title}
          </motion.h2>
          <motion.p
            className="mt-5 max-w-md text-base leading-relaxed text-ink/60"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            {data.description}
          </motion.p>

          <motion.ul
            className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
          >
            {data.features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-ink/85">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#9e4953]/20 text-maroon-admin">
                  <Check className="size-3.5" />
                </span>
                <span className="text-sm font-medium">{f}</span>
              </li>
            ))}
          </motion.ul>

          <motion.div
            className="mt-9 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <a
              href={data.playStoreButton.link}
              className="inline-flex h-14 items-center gap-3 rounded-2xl bg-white px-6 text-[#002144] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.3)] transition-transform hover:-translate-y-0.5"
            >
              <Play className="size-6" />
              <span className="text-sm font-bold">{data.playStoreButton.text}</span>
            </a>
            <a
              href={data.appStoreButton.link}
              className="inline-flex h-14 items-center gap-3 rounded-2xl px-6 text-[#002144] transition-all hover:-translate-y-0.5"
              style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(1,33,74,0.18)" }}
            >
              <Apple className="size-6" />
              <span className="text-sm font-bold">{data.appStoreButton.text}</span>
            </a>
          </motion.div>
        </div>

        <motion.div
          className="relative flex justify-center"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9e4953]/20 blur-3xl" />
          <div className="relative animate-float">
            <PhoneMockup />
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
