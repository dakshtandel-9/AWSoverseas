"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Tracking number entry. Per spec, full tracking lives in the app — submitting
 * routes the user to the tracking page with the number as a query param.
 */
export function TrackingInput({
  placeholder,
  buttonText,
  tone = "light",
  className,
}: {
  placeholder: string;
  buttonText: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/tracking?ref=${encodeURIComponent(q)}` : "/tracking");
  }

  const dark = tone === "dark";

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "flex items-center gap-2 rounded-2xl p-2 ring-1 transition-shadow focus-within:ring-2",
        dark
          ? "bg-white/10 ring-white/15 focus-within:ring-accent-400"
          : "bg-white shadow-card ring-line focus-within:ring-accent-400",
        className,
      )}
    >
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-xl",
          dark ? "bg-white/10 text-accent-300" : "bg-brand-50 text-brand-600",
        )}
      >
        <Search className="size-5" />
      </span>
      <label htmlFor="track-ref" className="sr-only">
        Tracking number
      </label>
      <input
        id="track-ref"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "min-w-0 flex-1 bg-transparent px-1 text-sm font-medium focus:outline-none sm:text-base",
          dark ? "text-white placeholder:text-brand-100/50" : "text-ink placeholder:text-muted",
        )}
      />
      <button
        type="submit"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-brand-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800 sm:px-5"
      >
        {buttonText}
        <ArrowRight className="size-4" />
      </button>
    </form>
  );
}
