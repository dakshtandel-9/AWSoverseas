"use client";

import { motion } from "framer-motion";
import { Phone, Mail, Headset, MessageCircle, Clock, MapPin, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

type InfoItem = { type: string; value: string };
type Schedule = { day: string; time: string };
type Location = { office: string; address: string; city?: string; country?: string };

const INFO_ICONS: Record<string, typeof Phone> = {
  Phone,
  Email: Mail,
  Support: Headset,
};

/**
 * Sticky "routing" rail — direct channels, WhatsApp, hours, and office,
 * styled with the same mono-label device as the About/Industries manifest
 * pages, framed here as dispatch routing information rather than credentials.
 */
export function ContactChannels({
  contactInfo,
  whatsapp,
  businessHours,
  location,
}: {
  contactInfo: { title: string; items: InfoItem[] };
  whatsapp: { title: string; description: string; buttonText: string; link: string };
  businessHours: { title: string; schedule: Schedule[]; timezone: string };
  location?: Location;
}) {
  return (
    <div className="flex flex-col gap-5 lg:sticky lg:top-28">
      {/* Direct channels */}
      <motion.div
        className="rounded-3xl border border-[#e4e9f2] bg-white p-7"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">
          {contactInfo.title}
        </p>
        <ul className="mt-5 flex flex-col gap-4">
          {contactInfo.items.map((item) => {
            const Icon = INFO_ICONS[item.type] ?? Mail;
            const href =
              item.type === "Phone" ? `tel:${item.value.replace(/\s+/g, "")}` : `mailto:${item.value}`;
            return (
              <li key={`${item.type}-${item.value}`}>
                <a
                  href={href}
                  className="group flex items-center gap-4 rounded-2xl px-2 py-1 transition-colors hover:bg-[#f6f8fc]"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#eef3fb] text-[#002144] transition-colors group-hover:bg-[#002144] group-hover:text-white">
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#94a3b8]">
                      {item.type}
                    </p>
                    <p className="truncate text-sm font-semibold text-[#002144]">{item.value}</p>
                  </div>
                </a>
              </li>
            );
          })}
          {location && (
            <li className="flex items-start gap-4 px-2 py-1">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#eef3fb] text-[#002144]">
                <MapPin className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#94a3b8]">
                  {location.office}
                </p>
                <p className="text-sm font-semibold leading-snug text-[#002144]">
                  {[location.address, location.city, location.country].filter(Boolean).join(", ")}
                </p>
              </div>
            </li>
          )}
        </ul>
      </motion.div>

      {/* WhatsApp */}
      <motion.a
        href={whatsapp.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-4 overflow-hidden rounded-3xl bg-[#CFE8FF] p-6 transition-transform duration-300 hover:-translate-y-0.5"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full blur-[60px]"
          aria-hidden
          style={{ background: "rgba(171, 31, 61,0.22)" }}
        />
        <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-[#d6274c]/15 text-[#e05c72]">
          <MessageCircle className="size-6" />
        </span>
        <div className="relative min-w-0 flex-1">
          <p className="text-sm font-bold text-ink">{whatsapp.title}</p>
          <p className="mt-0.5 text-xs leading-snug text-ink/55">{whatsapp.description}</p>
        </div>
        <ArrowUpRight className="relative size-4 shrink-0 text-ink/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#e05c72]" />
      </motion.a>

      {/* Business hours */}
      <motion.div
        className="rounded-3xl border border-[#e4e9f2] bg-white p-7"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center gap-2.5">
          <Clock className="size-4 text-[#8d1a32]" />
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">
            {businessHours.title}
          </p>
        </div>
        <ul className="mt-5 flex flex-col gap-3">
          {businessHours.schedule.map((s) => (
            <li key={s.day} className="flex items-center justify-between text-sm">
              <span className="text-[#5b6b82]">{s.day}</span>
              <span
                className={cn(
                  "font-semibold",
                  s.time.toLowerCase() === "closed" ? "text-[#94a3b8]" : "text-[#002144]",
                )}
              >
                {s.time}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-5 border-t border-[#e4e9f2] pt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#94a3b8]">
          {businessHours.timezone}
        </p>
      </motion.div>
    </div>
  );
}
