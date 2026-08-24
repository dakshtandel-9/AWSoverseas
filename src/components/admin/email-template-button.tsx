"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Mail, Copy, Check, TriangleAlert } from "lucide-react";
import { motion } from "framer-motion";
import { composeEmailTemplateHtml, composeEmailTemplateText } from "@/lib/email-compose-template";

type CopyState = "idle" | "copied" | "failed";

/**
 * Writes both a text/html and a text/plain clipboard entry so pasting into a
 * rich-text compose box (Hostinger's included) keeps the masthead, banner,
 * colors and fonts — the same way pasting from Word or Docs preserves
 * formatting — while a plain-text-only field still gets readable copy
 * instead of raw tags.
 */
async function copyEmailTemplate(): Promise<boolean> {
  const html = composeEmailTemplateHtml();
  const text = composeEmailTemplateText();
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([text], { type: "text/plain" }),
      }),
    ]);
    return true;
  } catch {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Top-right action that copies the branded email shell to the clipboard —
 * the same masthead, route-strip motion graphic, banner, colors and fonts the
 * transactional sender uses. Paste it into any compose box and the
 * hand-written email still looks like it came from AWS OVERSEAS impex.
 */
export function EmailTemplateButton({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  async function handleCopy() {
    const ok = await copyEmailTemplate();
    setState(ok ? "copied" : "failed");
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), ok ? 2400 : 4000);
  }

  const label = state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "Email";
  const Icon = state === "copied" ? Check : state === "failed" ? TriangleAlert : Mail;
  const iconTone = state === "copied" ? "text-[#2f9e59]" : state === "failed" ? "text-[#861B28]" : "";

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy the branded email template"
        className={
          compact
            ? "relative grid size-10 place-items-center rounded-xl border border-[#e4e9f2] text-[#1A0A53] transition-colors hover:bg-[#eef3fb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#002144]"
            : "relative flex items-center gap-2 rounded-xl border border-[#e4e9f2] px-3 py-2 text-sm font-medium text-[#1A0A53] transition-colors hover:bg-[#eef3fb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#002144]"
        }
      >
        <motion.span className="grid place-items-center" initial="rest" whileHover="hover" animate="rest">
          <motion.span
            variants={{ rest: { rotate: 0, y: 0 }, hover: { rotate: -8, y: -1 } }}
            transition={{ type: "spring", stiffness: 300, damping: 12 }}
          >
            <Icon className={`size-4 shrink-0 ${iconTone}`} />
          </motion.span>
        </motion.span>
        {!compact && (
          <>
            <span className="hidden sm:inline">{label}</span>
            <Copy className="size-3.5 shrink-0 text-[#94a3b8] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </>
        )}
      </button>

      <span aria-live="polite" className="sr-only">
        {state === "copied"
          ? "Email template copied. Paste it into your compose box."
          : state === "failed"
            ? "Copy failed. Your browser blocked clipboard access — try again."
            : ""}
      </span>

      {/* Hover preview: a miniature of what lands on the clipboard. Reduced motion respected via opacity/scale-only transition. */}
      <div className="pointer-events-none absolute right-0 top-[calc(100%+0.5rem)] z-40 w-72 origin-top-right scale-95 opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100 motion-reduce:transition-none">
        <div className="overflow-hidden rounded-2xl border border-[#e4e9f2] bg-white shadow-[0_24px_64px_-20px_rgba(2,20,68,0.35)]">
          <div className="flex items-center gap-1.5 border-b border-[#e4e9f2] bg-[#f6f8fc] px-3 py-2">
            <span className="size-2 rounded-full bg-[#e4636a]" />
            <span className="size-2 rounded-full bg-[#e8c766]" />
            <span className="size-2 rounded-full bg-[#7fbf7f]" />
            <span className="ml-2 truncate font-mono text-[10px] text-[#94a3b8]">admin@awsoverseas.com</span>
          </div>
          <div className="bg-[#1A0A53] px-3 py-2.5">
            <p className="text-[11px] font-bold tracking-[0.02em] text-white">AWS OVERSEAS impex</p>
            <p className="pt-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#90c0fe]">
              Global Shipping Beyond Borders
            </p>
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
            <p className="text-xs font-semibold text-[#1A0A53]">
              {state === "failed" ? "Clipboard access blocked" : "Copy the branded email"}
            </p>
            <p className="mt-0.5 text-[11px] text-[#5b6b82]">
              {state === "failed"
                ? "Allow clipboard access for this site, then click again."
                : "Paste into your compose box — the layout comes with it."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
