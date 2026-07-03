"use client";

import { motion } from "framer-motion";
import { Apple, Play, Star } from "lucide-react";
import { Section } from "@/components/ui/section";

type Store = { title: string; button: string; link: string };
type Data = { title: string; description: string; playStore: Store; appStore: Store };

export function DownloadBand({ data }: { data: Data }) {
  return (
    <Section spacing="lg">
      <motion.div
        className="relative overflow-hidden rounded-[2rem] bg-[#04162f] px-8 py-14 text-center sm:px-14 sm:py-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(50% 60% at 50% -10%, rgba(15,173,232,0.22) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-xl">
          <div className="mx-auto flex w-fit items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 ring-1 ring-white/15">
            <Star className="size-3.5 fill-current text-[#f59e0b]" />
            Free on Android &amp; iOS
          </div>
          <h2 className="mt-5 text-3xl font-bold sm:text-4xl" style={{ color: "#ffffff" }}>
            {data.title}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/60">
            {data.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={data.playStore.link}
              className="inline-flex h-14 items-center gap-3 rounded-2xl bg-white px-6 text-[#06234d] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.3)] transition-transform hover:-translate-y-0.5"
            >
              <Play className="size-6" />
              <span className="flex flex-col text-left leading-tight">
                <span className="text-[10px] opacity-60">{data.playStore.title}</span>
                <span className="text-sm font-bold">{data.playStore.button}</span>
              </span>
            </a>
            <a
              href={data.appStore.link}
              className="inline-flex h-14 items-center gap-3 rounded-2xl px-6 text-white transition-all hover:-translate-y-0.5"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)" }}
            >
              <Apple className="size-6" />
              <span className="flex flex-col text-left leading-tight">
                <span className="text-[10px] opacity-60">{data.appStore.title}</span>
                <span className="text-sm font-bold">{data.appStore.button}</span>
              </span>
            </a>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
