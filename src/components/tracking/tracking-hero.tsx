"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ArrowRight, Loader2, PackageSearch } from "lucide-react";
import { Container } from "@/components/ui/container";

type Data = { badge: string; title: string; subtitle: string };
type FormData = { title: string; description: string; placeholder: string; button: string; validationMessage: string };
type ButtonData = { loadingText: string };

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Primary tool on this page: enter a tracking number, get routed to the
 * tracking result (full live tracking lives in the app per TrackingInput's
 * existing convention). trackButton.loadingText from the JSON becomes a real
 * brief "checking" state before navigating — honest UX polish, not a fake
 * async call.
 */
export function TrackingHero({
  data,
  form,
  button,
}: {
  data: Data;
  form: FormData;
  button: ButtonData;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRef = searchParams.get("ref");
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // The hero stays mounted across the navigation (same route, only the
  // `ref` query param changes) — once that param updates, the lookup below
  // has resolved, so clear the loading state and hand off to it.
  useEffect(() => {
    setLoading(false);
    if (currentRef) {
      document.getElementById("tracking-result")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentRef]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ref = value.trim();
    if (!ref) {
      setError(true);
      return;
    }
    setError(false);
    setLoading(true);
    router.push(`/tracking?ref=${encodeURIComponent(ref)}`);
  }

  return (
    <section className="relative overflow-hidden bg-[#C4DFFD] pb-20 pt-32 sm:pb-24 sm:pt-36">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(60% 55% at 50% 0%, rgba(144, 45, 57,0.16) 0%, transparent 60%), linear-gradient(to right, rgba(1,33,74,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(1,33,74,0.05) 1px, transparent 1px)",
          backgroundSize: "auto, 44px 44px, 44px 44px",
        }}
      />

      <Container className="relative flex flex-col items-center text-center">
        <motion.span
          className="inline-flex items-center gap-2 rounded-full border border-[#9e4953]/30 bg-[#9e4953]/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-maroon-admin"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <PackageSearch className="size-3.5" />
          {data.badge}
        </motion.span>

        <motion.h1
          className="mt-6 max-w-2xl font-heading text-4xl font-extrabold leading-[1.1] tracking-[-0.03em] sm:text-5xl"
          style={{ color: "#002144" }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1, ease }}
        >
          {data.title}
        </motion.h1>

        <motion.p
          className="mt-5 max-w-xl text-base leading-relaxed text-[#002144]/65 sm:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease }}
        >
          {data.subtitle}
        </motion.p>

        {/* Tracking form card */}
        <motion.div
          className="mt-10 w-full max-w-xl rounded-3xl border border-[#002144]/10 bg-white/70 p-7 backdrop-blur-sm sm:p-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.28, ease }}
        >
          <p className="text-left font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#002144]/45">
            {form.title}
          </p>
          <p className="mt-2 text-left text-sm text-[#002144]/60">{form.description}</p>

          <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
            <label htmlFor="tracking-ref" className="sr-only">
              Tracking number
            </label>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-[#002144]/40" />
              <input
                id="tracking-ref"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  if (error) setError(false);
                }}
                placeholder={form.placeholder}
                className="w-full rounded-2xl border border-[#002144]/15 bg-white py-4 pl-11 pr-4 text-sm font-medium text-[#002144] placeholder:text-[#002144]/35 outline-none focus:border-[#9e4953]/50 focus:ring-2 focus:ring-[#9e4953]/25"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl btn-maroon px-7 py-4 text-sm font-semibold text-white transition-colors disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {button.loadingText}
                </>
              ) : (
                <>
                  {form.button}
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          {error && (
            <p className="mt-3 text-left text-sm font-medium text-[#f59e0b]">
              {form.validationMessage}
            </p>
          )}
        </motion.div>
      </Container>
    </section>
  );
}
