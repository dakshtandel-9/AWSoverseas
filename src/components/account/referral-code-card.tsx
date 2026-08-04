"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy, Gift, Share2 } from "lucide-react";

/** Builds the shareable sign-up link that carries this code to a new account. */
function referralLink(code: string) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/login?mode=sign-up&ref=${encodeURIComponent(code)}`;
}

export function ReferralCodeCard({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  useEffect(() => {
    if (!shared) return;
    const t = setTimeout(() => setShared(false), 2000);
    return () => clearTimeout(t);
  }, [shared]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — the code is visible to copy by hand.
    }
  }

  async function share() {
    const url = referralLink(code);
    if (navigator.share) {
      try {
        // url only, deliberately — iOS/macOS's share sheet "Copy" action
        // concatenates a separate `text` field onto the url with a space,
        // and that combined string breaks when the recipient pastes it into
        // a browser's address bar instead of a share target.
        await navigator.share({ title: "Join AWS OVERSEAS impex", url });
      } catch {
        // User cancelled the share sheet — nothing to do.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setShared(true);
    } catch {
      // Clipboard unavailable — the code above is still visible to copy by hand.
    }
  }

  return (
    <div className="rounded-3xl border border-[#e4e9f2] bg-[#CFE8FF] p-7 text-ink">
      <p className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-maroon-admin">
        <Gift className="size-3.5" />
        Your referral code
      </p>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-ink/15 bg-ink/5 px-5 py-4">
        <span className="font-mono text-xl font-bold tracking-[0.12em]">{code}</span>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={copy}
            className="grid size-9 shrink-0 place-items-center rounded-full border border-ink/20 text-ink/80 transition-colors hover:border-[#9e4953] hover:text-ink"
            aria-label={copied ? "Copied" : "Copy referral code"}
          >
            {copied ? <Check className="size-4 text-maroon-admin" /> : <Copy className="size-4" />}
          </button>
          <button
            type="button"
            onClick={share}
            className="grid size-9 shrink-0 place-items-center rounded-full border border-ink/20 text-ink/80 transition-colors hover:border-[#9e4953] hover:text-ink"
            aria-label={shared ? "Link copied" : "Share your referral link"}
          >
            {shared ? <Check className="size-4 text-maroon-admin" /> : <Share2 className="size-4" />}
          </button>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink/60">
        Share this code with other importers — anyone who signs up with it shows in your
        referrals.
      </p>

      <Link
        href="/profile/referrals"
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-maroon-admin hover:text-ink"
      >
        View your referrals <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}
