"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Gift } from "lucide-react";

export function ReferralCodeCard({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — the code is visible to copy by hand.
    }
  }

  return (
    <div className="rounded-3xl border border-[#e4e9f2] bg-[#04162f] p-7 text-white">
      <p className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#48b8f8]">
        <Gift className="size-3.5" />
        Your referral code
      </p>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-white/15 bg-white/5 px-5 py-4">
        <span className="font-mono text-xl font-bold tracking-[0.12em]">{code}</span>
        <button
          type="button"
          onClick={copy}
          className="grid size-9 shrink-0 place-items-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-[#0fade8] hover:text-white"
          aria-label={copied ? "Copied" : "Copy referral code"}
        >
          {copied ? <Check className="size-4 text-[#0fade8]" /> : <Copy className="size-4" />}
        </button>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-white/60">
        Share this code with other importers — anyone who signs up with it shows below in your
        referrals.
      </p>
    </div>
  );
}
