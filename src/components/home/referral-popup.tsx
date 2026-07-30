"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Copy, Gift, Wallet, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const OPEN_DELAY_MS = 2000;

/** Auto-opens on every home page load; reachable again after dismissal via the floating tab. */
export function ReferralPopup({
  loggedIn,
  referralCode,
}: {
  loggedIn: boolean;
  referralCode: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [dismissedOnce, setDismissedOnce] = useState(false);
  const [copied, setCopied] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), OPEN_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  function close() {
    setOpen(false);
    setDismissedOnce(true);
  }

  async function copyCode() {
    if (!referralCode) return;
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
    } catch {
      // Clipboard unavailable — the code is still visible to copy by hand.
    }
  }

  if (typeof document === "undefined") return null;

  return (
    <>
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute inset-0 bg-[#000c1a]/60 backdrop-blur-sm"
                onClick={close}
                aria-hidden
              />

              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="referral-popup-title"
                className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-[#e4e9f2] bg-white shadow-[0_32px_96px_-24px_rgba(4,22,47,0.5)]"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="absolute right-4 top-4 z-10 grid size-9 shrink-0 place-items-center rounded-full bg-white/80 text-[#5b6b82] backdrop-blur-sm transition-colors hover:bg-white hover:text-[#1A0A53]"
                >
                  <X className="size-4" />
                </button>

                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto sm:flex-row">
                  {/* Left: the pitch, over a real cargo photo */}
                  <div className="relative flex overflow-hidden p-7 sm:w-[300px] sm:shrink-0 sm:justify-center sm:p-8">
                    <Image
                      src="https://res.cloudinary.com/dwethh3fq/image/upload/v1785242164/awsoversea/referral/cargo-vs-shipment.jpg"
                      alt=""
                      fill
                      priority
                      sizes="(min-width: 640px) 300px, 100vw"
                      className="object-cover object-left"
                    />
                    <div className="absolute inset-0 bg-[#000c1a]/65" aria-hidden />

                    <div className="relative flex flex-col gap-5">
                      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-maroon-admin">
                        <Gift className="size-3.5" />
                        Refer &amp; Earn
                      </span>
                      <h2
                        id="referral-popup-title"
                        className="text-balance text-[1.7rem] font-bold leading-[1.15]"
                        style={{ color: "#ffffff" }}
                      >
                        Sign up and get $25 in your wallet.
                      </h2>
                      <p className="text-sm leading-relaxed text-white/70">
                        It&rsquo;s instant, and yours to use toward your next shipment. Refer
                        others to earn even more.
                      </p>
                    </div>
                  </div>

                  {/* Right: the offer and action */}
                  <div className="flex flex-1 flex-col gap-5 p-7 sm:p-8">
                    <div className="flex items-center gap-4 rounded-2xl border border-[#e4e9f2] bg-[#f6f8fc] px-5 py-4">
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#CFE8FF] text-[#1A0A53]">
                        <Wallet className="size-5" />
                      </span>
                      <div>
                        <p className="font-mono text-2xl font-bold leading-none text-maroon-admin">$25</p>
                        <p className="mt-1 text-sm text-[#5b6b82]">Credited to your wallet on signup</p>
                      </div>
                    </div>

                    {loggedIn && referralCode ? (
                      <div className="mt-auto flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#e4e9f2] bg-[#f6f8fc] px-5 py-3.5">
                          <span className="font-mono text-lg font-bold tracking-[0.12em] text-[#1A0A53]">
                            {referralCode}
                          </span>
                          <button
                            type="button"
                            onClick={copyCode}
                            aria-label={copied ? "Copied" : "Copy referral code"}
                            className="grid size-9 shrink-0 place-items-center rounded-full border border-[#e4e9f2] text-[#5b6b82] transition-colors hover:border-[#9e4953] hover:text-[#1A0A53]"
                          >
                            {copied ? <Check className="size-4 text-maroon-admin" /> : <Copy className="size-4" />}
                          </button>
                        </div>
                        <Button href="/profile/referrals" variant="secondary" size="lg" className="w-full">
                          View my referrals <ArrowRight className="size-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-auto flex flex-col gap-3">
                        <Button
                          href="/login?mode=sign-up&next=/profile/referrals"
                          variant="secondary"
                          size="lg"
                          className="w-full"
                        >
                          Create free account — get $25 <ArrowRight className="size-4" />
                        </Button>
                        <Link
                          href="/login?next=/profile/referrals"
                          className="text-center text-sm font-medium text-[#5b6b82] hover:text-[#1A0A53]"
                        >
                          Already have an account? Sign in
                        </Link>
                      </div>
                    )}

                    <p className="text-xs leading-relaxed text-[#94a3b8]">
                      Credits aren&rsquo;t transferable and may be changed or withdrawn at any time, at aws
                      overseas&rsquo;s discretion.{" "}
                      <Link href="/referral-rewards" className="font-semibold text-maroon-admin hover:underline">
                        Full program terms
                      </Link>
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      {createPortal(
        <AnimatePresence>
          {dismissedOnce && !open && (
            <motion.button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open refer and earn"
              className="fixed bottom-5 right-5 z-[90] inline-flex items-center gap-2 rounded-full border border-[#9e4953]/25 bg-white px-4 py-3 text-sm font-semibold text-[#1A0A53] shadow-[0_18px_40px_-16px_rgba(4,22,47,0.35)] transition-colors hover:border-[#9e4953]/50 sm:bottom-6 sm:right-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <Gift className="size-4 text-maroon-admin" />
              Refer &amp; Earn
            </motion.button>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
