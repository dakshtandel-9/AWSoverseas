"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Phone, Mail, MapPin, Share2, Check, X, ImageOff } from "lucide-react";
import type { CityAgent } from "@/lib/city-agents";

/**
 * The card behind a city tile — agent name, address, phone, email, and a
 * Share control. `shareUrl` already carries `?agent=<id>` so the recipient
 * lands with this same card open (see CityAgents' effect reading that param).
 */
export function CityAgentModal({
  agent,
  shareUrl,
  onClose,
}: {
  agent: CityAgent | null;
  shareUrl: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const reduceMotion = useReducedMotion();
  const open = Boolean(agent);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  async function share() {
    if (!agent) return;
    const shareData = {
      title: `${agent.agent_name} — AWS Overseas, ${agent.city}`,
      text: `Contact card for ${agent.agent_name} in ${agent.city}.`,
      url: shareUrl,
    };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Share sheet dismissed — nothing to do.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
    } catch {
      // Clipboard unavailable — the link is still visible in the address bar.
    }
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && agent && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-[#000c1a]/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="city-agent-modal-title"
            className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-[#e4e9f2] bg-white shadow-[0_32px_96px_-24px_rgba(4,22,47,0.5)]"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative h-36 w-full shrink-0 bg-[#eef3fb]">
              {agent.image_url ? (
                <Image src={agent.image_url} alt="" fill sizes="448px" className="object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-[#94a3b8]">
                  <ImageOff className="size-6" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" aria-hidden />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute right-3.5 top-3.5 grid size-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-[#1A0A53]"
              >
                <X className="size-4" />
              </button>
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
                  Local Agent
                </p>
                <h2 id="city-agent-modal-title" className="mt-0.5 text-xl font-bold text-white">
                  {agent.city}
                </h2>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-6 py-6">
              <p className="text-lg font-bold leading-snug text-[#1A0A53]">{agent.agent_name}</p>

              {agent.address && (
                <p className="-mt-3 flex items-start gap-3 text-sm leading-relaxed text-[#5b6b82]">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-[#94a3b8]" aria-hidden />
                  {agent.address}
                </p>
              )}

              <ul className="flex flex-col gap-3.5">
                {agent.phone && (
                  <DetailRow icon={Phone} href={`tel:${agent.phone.replace(/[^\d+]/g, "")}`}>
                    {agent.phone}
                  </DetailRow>
                )}
                {agent.email && (
                  <DetailRow icon={Mail} href={`mailto:${agent.email}`}>
                    {agent.email}
                  </DetailRow>
                )}
              </ul>

              <button
                type="button"
                onClick={share}
                className="mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-full btn-navy px-6 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(3,62,141,0.25)] transition-all duration-300 hover:-translate-y-0.5"
              >
                {copied ? (
                  <>
                    <Check className="size-4" />
                    Link copied
                  </>
                ) : (
                  <>
                    <Share2 className="size-4" />
                    Share this card
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function DetailRow({
  icon: Icon,
  href,
  children,
}: {
  icon: typeof Phone;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <a href={href} className="group flex items-start gap-3">
        <Icon className="mt-0.5 size-4 shrink-0 text-maroon-admin" aria-hidden />
        <span className="min-w-0 break-words text-sm font-semibold text-[#1A0A53] transition-colors group-hover:text-maroon-admin">
          {children}
        </span>
      </a>
    </li>
  );
}
