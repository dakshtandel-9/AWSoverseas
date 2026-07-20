"use client";

import { motion } from "framer-motion";
import { MapPin, ArrowUpRight } from "lucide-react";
import { Section } from "@/components/ui/section";

type Location = { office: string; address: string; city?: string; country?: string };
type MapData = { title: string; description: string; embedUrl: string };

/**
 * Embeds a live Google Maps iframe via the no-API-key "output=embed" search
 * form, built from the office address — no Maps Embed API key required.
 */
export function OfficeMap({
  data,
  location,
}: {
  data: MapData;
  location?: Location;
}) {
  const query = location
    ? [location.address, location.city, location.country].filter(Boolean).join(", ")
    : "";
  const mapsSearchUrl = query
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
    : data.embedUrl;
  const mapsEmbedUrl = query
    ? `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`
    : null;

  return (
    <Section spacing="lg" tone="soft">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">
          {data.title}
        </p>
        <h2 className="mt-3 text-3xl font-bold text-[#01214a] sm:text-4xl">
          {location?.city && location?.country ? `${location.city}, ${location.country}` : "Our Office"}
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
        {mapsEmbedUrl ? (
          <iframe
            src={mapsEmbedUrl}
            className="h-64 w-full border-0 sm:h-80"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={location ? `Map to ${location.office}` : "Office location map"}
          />
        ) : (
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
              <p className="text-sm font-semibold text-[#01214a]">Full address available on request.</p>
            </div>
          </div>
        )}

        <div className="flex flex-col items-start gap-4 border-t border-[#e4e9f2] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-sm text-[#5b6b82]">
            {location ? `${location.office} · ${query}` : "Full address available on request."}
          </p>
          <a
            href={mapsSearchUrl}
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
