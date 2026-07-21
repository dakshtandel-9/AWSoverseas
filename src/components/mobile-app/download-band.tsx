"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Section } from "@/components/ui/section";

type Store = { title: string; button: string; link: string };
type Data = { title: string; description: string; playStore: Store; appStore: Store };

export function DownloadBand({ data }: { data: Data }) {
  return (
    <Section spacing="lg">
      <motion.div
        className="relative overflow-hidden rounded-[2rem] bg-[#CFE8FF] px-8 py-14 text-center sm:px-14 sm:py-16"
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
              "radial-gradient(50% 60% at 50% -10%, rgba(144, 45, 57,0.14) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-xl">
          <div className="mx-auto flex w-fit items-center gap-1 rounded-full bg-ink/8 px-3 py-1 text-xs font-semibold text-ink/80 ring-1 ring-ink/15">
            <Star className="size-3.5 fill-current text-[#f59e0b]" />
            Free on Android &amp; iOS
          </div>
          <h2 className="mt-5 text-3xl font-bold sm:text-4xl" style={{ color: "#002144" }}>
            {data.title}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-ink/60">
            {data.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={data.playStore.link}
              aria-label={`${data.playStore.title} ${data.playStore.button}`}
              className="flex items-center rounded-xl px-4 py-2.5 shadow-lg shadow-[#002144]/15 transition-transform hover:-translate-y-0.5"
              style={{ background: "#002144" }}
            >
              <Image
                src="/brand/google-play-real.png"
                alt="Get it on Google Play"
                width={200}
                height={59}
                className="h-9 w-auto"
              />
            </a>
            <a
              href={data.appStore.link}
              aria-label={`${data.appStore.title} ${data.appStore.button}`}
              className="flex items-center rounded-xl px-4 py-2.5 shadow-lg shadow-[#002144]/15 transition-transform hover:-translate-y-0.5"
              style={{ background: "#002144" }}
            >
              <Image
                src="/brand/app-store-real.png"
                alt="Download on the App Store"
                width={200}
                height={59}
                className="h-9 w-auto"
              />
            </a>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}
