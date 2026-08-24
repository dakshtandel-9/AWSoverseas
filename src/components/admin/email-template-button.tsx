"use client";

import Image from "next/image";
import { Mail, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const WEBMAIL_URL = "https://mail.hostinger.com/";

/**
 * Top-right shortcut to the real inbox. The preview card mirrors the actual
 * transactional email banner (public/email/banner.jpg) rather than a generic
 * envelope graphic, so what admins see here is what customers actually get.
 */
export function WebmailButton() {
  return (
    <div className="group relative">
      <a
        href={WEBMAIL_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open Hostinger webmail in a new tab"
        className="relative flex items-center gap-2 rounded-xl border border-[#e4e9f2] px-3 py-2 text-sm font-medium text-[#1A0A53] transition-colors hover:bg-[#eef3fb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#002144]"
      >
        <motion.span
          className="grid place-items-center"
          initial="rest"
          whileHover="hover"
          animate="rest"
        >
          <motion.span
            variants={{ rest: { rotate: 0, y: 0 }, hover: { rotate: -8, y: -1 } }}
            transition={{ type: "spring", stiffness: 300, damping: 12 }}
          >
            <Mail className="size-4 shrink-0" />
          </motion.span>
        </motion.span>
        <span className="hidden sm:inline">Email</span>
        <ArrowUpRight className="size-3.5 shrink-0 text-[#94a3b8] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>

      {/* Hover preview: a miniature of the real transactional email, reduced motion respected via opacity/scale-only transition */}
      <div
        role="presentation"
        className="pointer-events-none absolute right-0 top-[calc(100%+0.5rem)] z-40 w-72 origin-top-right scale-95 opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:scale-100 group-hover:opacity-100 motion-reduce:transition-none"
      >
        <div className="overflow-hidden rounded-2xl border border-[#e4e9f2] bg-white shadow-[0_24px_64px_-20px_rgba(2,20,68,0.35)]">
          <div className="flex items-center gap-1.5 border-b border-[#e4e9f2] bg-[#f6f8fc] px-3 py-2">
            <span className="size-2 rounded-full bg-[#e4636a]" />
            <span className="size-2 rounded-full bg-[#e8c766]" />
            <span className="size-2 rounded-full bg-[#7fbf7f]" />
            <span className="ml-2 truncate font-mono text-[10px] text-[#94a3b8]">admin@awsoverseas.com</span>
          </div>
          <div className="relative aspect-[1120/400] w-full">
            <Image
              src="/email/banner.jpg"
              alt="AWS OVERSEAS impex — your trusted global trade partner"
              fill
              sizes="288px"
              className="object-cover"
            />
          </div>
          <div className="px-3 py-2.5">
            <p className="text-xs font-semibold text-[#1A0A53]">Open Hostinger webmail</p>
            <p className="mt-0.5 text-[11px] text-[#5b6b82]">Opens mail.hostinger.com in a new tab</p>
          </div>
        </div>
      </div>
    </div>
  );
}
