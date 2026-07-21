"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy, Gift } from "lucide-react";

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
    <div className="rounded-3xl border border-[#e4e9f2] bg-[#CFE8FF] p-7 text-ink">
      <p className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e05c72]">
        <Gift className="size-3.5" />
        Your referral code
      </p>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-ink/15 bg-ink/5 px-5 py-4">
        <span className="font-mono text-xl font-bold tracking-[0.12em]">{code}</span>
        <button
          type="button"
          onClick={copy}
          className="grid size-9 shrink-0 place-items-center rounded-full border border-ink/20 text-ink/80 transition-colors hover:border-[#d6274c] hover:text-ink"
          aria-label={copied ? "Copied" : "Copy referral code"}
        >
          {copied ? <Check className="size-4 text-[#d6274c]" /> : <Copy className="size-4" />}
        </button>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink/60">
        Share this code with other importers — anyone who signs up with it shows in your
        referrals.
      </p>

      <Link
        href="/profile/referrals"
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#e05c72] hover:text-ink"
      >
        View your referrals <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}
