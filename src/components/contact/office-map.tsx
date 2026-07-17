"use client";

import { motion } from "framer-motion";
import { MapPin, ArrowUpRight } from "lucide-react";
import { Section } from "@/components/ui/section";

type Location = { office: string; address: string; city: string; country: string };
type MapData = { title: string; description: string; embedUrl: string };

/**
 * contact.json's googleMap.embedUrl is a placeholder ("https://maps.google.com/"),
 * not a real Maps Embed API URL — iframing it would just render Google's
 * homepage. Rendered as a static map-styled card with an honest external
 * "Open in Google Maps" link instead of a broken embed.
 */
export function OfficeMap({
  data,
  location,
}: {
  data: MapData;
  location?: Location;
}) {
  return (
    <Section spacing="lg" tone="soft">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">
          {data.title}
        </p>
        <h2 className="mt-3 text-3xl font-bold text-[#01214a] sm:text-4xl">
          {location ? `${location.city}, ${location.country}` : "Our Office"}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-[#5b6b82]">{data.description}</p>
      </div>

      <motion.div
        className="relative mx-auto mt-10 max-w-4xl overflow-hidden rounded-3xl border border-[#e4e9f2] bg-white"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Stylized map placeholder */}
        <div
          className="relative flex h-64 items-center justify-center sm:h-80"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(3,62,141,0.12) 1px, transparent 1px), linear-gradient(#eef3fb, #eef3fb)",
            backgroundSize: "22px 22px, 100% 100%",
          }}
        >
          <div className="flex flex-col items-center gap-3">
            <span className="grid size-14 place-items-center rounded-full bg-[#01214a] text-white shadow-[0_8px_24px_-6px_rgba(3,62,141,0.5)]">
              <MapPin className="size-6" />
            </span>
            {location && (
              <p className="text-sm font-semibold text-[#01214a]">
                {location.office} · {location.city}, {location.country}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 border-t border-[#e4e9f2] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-sm text-[#5b6b82]">
            {location
              ? `${location.address}, ${location.city}, ${location.country}`
              : "Full address available on request."}
          </p>
          <a
            href={data.embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#eef3fb] px-5 py-2.5 text-sm font-semibold text-[#01214a] transition-colors hover:bg-[#01214a] hover:text-white"
          >
            Open in Google Maps
            <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </motion.div>
    </Section>
  );
}
